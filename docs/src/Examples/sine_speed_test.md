# Sine Speeed Test

Lets compare the speed difference of using SineTables and `Base.sin`.
We'll assume that the signal will be generated on a 12-bit DAC.

Lets start by looking at the `Base.sin` version, so get the time-to-beat.

```@example SpeedTest
using BenchmarkTools

# Define the parameters for the sine wave generation
num_points = 4096
scaling_factor = 2047  # Assuming 12-bit DAC

# Function to generate a sine wave using Julia's base sin function (mutating version)
function generate_sine_using_base_sin!(result::Vector{Int16}, num_points::Int, scaling_factor::Int)
    for i in 1:num_points
        phase = 2 * pi * (i-1) / num_points
        result[i] = Int16(round(scaling_factor * sin(phase)))
    end
end

# Preallocate the result array for the base sin version
result_base_sin = Vector{Int16}(undef, num_points)

# Benchmark the Base.sin version with preallocated array
@benchmark generate_sine_using_base_sin!($result_base_sin, $num_points, $scaling_factor)
```

Now lets see what we can accomplish with our LUT-based sine.

```@example SpeedTest
using ..SineTables

# Generate a sine lookup table
sine_table = create_sine_table(
    Int16,          # LUT type
    num_points,     # Number of points
    0,              # Bias
    scaling_factor  # Scaling
)

# Function to generate a sine wave using the LUT (mutating version)
function generate_sine_using_lut!(result::Vector{Int16}, table::SineTable, num_points::Int)
    lut_result = Ref{Int16}(0)
    for i in 1:num_points
        phase = 2 * pi * (i-1) / num_points
        lut_sine!(lut_result, table, phase)
        result[i] = lut_result[]
    end
end

# Preallocate the result array
result_lut = Vector{Int16}(undef, num_points)

# Benchmark the LUT version with preallocated array
@benchmark generate_sine_using_lut!($result_lut, $sine_table, $num_points)
```

Well this is embarresing.. The LUT-version is way slower than simply using `Base.sin`.
Maybe we can reduce the time by precalculationg the phase increment.

```@example SpeedTest
# Function to generate a sine wave using the LUT (optimized version)
function generate_sine_using_lut_optimized!(result::Vector{Int16}, table::SineTable, num_points::Int)
    phase_increment = 2 * pi / num_points  # Precompute phase increment
    phase = 0.0

    for i in 1:num_points
        index = SineTables.get_index(phase, num_points)
        result[i] = table.table[index + 1]  # Direct access, no Ref needed
        phase += phase_increment
    end
end

# Preallocate the result array
result_lut = Vector{Int16}(undef, num_points)

# Benchmark the optimized LUT version with preallocated array
@benchmark generate_sine_using_lut_optimized!($result_lut, $sine_table, $num_points)
```

Puh, that was close! As we can see, it is possible to get slightly faster sin-generation using this LUT package.
If this is worth the added complexity is another matter.
