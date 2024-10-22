var documenterSearchIndex = {"docs":
[{"location":"Examples/dynamic_range/#Dynamic-Range","page":"Dynamic Range","title":"Dynamic Range","text":"","category":"section"},{"location":"Examples/dynamic_range/","page":"Dynamic Range","title":"Dynamic Range","text":"Let's see what dynamic range we can achieve with LUTs of different sizes. We'll assume that the signal will be generated on a 12-bit DAC.","category":"page"},{"location":"Examples/dynamic_range/","page":"Dynamic Range","title":"Dynamic Range","text":"using ..SineTables\nusing Plots\nusing DSP\n\n# Create a sine lookup table with integer\nsine_table_50 = create_sine_table(\n    Int16, # LUT type\n    50,    # Number of pints\n    0,     # Bias\n    2047   # Scaling\n)\n\n# Create a sine lookup table with integer\nsine_table_100 = create_sine_table(\n    Int16, # LUT type\n    100,   # Number of pints\n    0,     # Bias\n    2047    # Scaling\n)\n\nsine_table_500 = create_sine_table(\n    Int16, # LUT type\n    500,   # Number of pints\n    0,     # Bias\n    2047   # Scaling\n)\n\nsine_table_2000 = create_sine_table(\n    Int16, # LUT type\n    2000,  # Number of pints\n    0,     # Bias\n    2047   # Scaling\n)\n\n\nsine_50 = [lut_sine(sine_table_50, 2 * pi * i / 21.12) for i in 0:8192]\nplot(sine_50[1:127], linetype = [:steppre], label = \"Sine\")\nsavefig(\"sine_50.svg\"); nothing # hide\n\nsine_100 = [lut_sine(sine_table_100, 2 * pi * i / 21.12) for i in 0:8192]\nsine_500 = [lut_sine(sine_table_500, 2 * pi * i / 21.12) for i in 0:8192]\nsine_2000 = [lut_sine(sine_table_2000, 2 * pi * i / 21.12) for i in 0:8192]\nnothing","category":"page"},{"location":"Examples/dynamic_range/","page":"Dynamic Range","title":"Dynamic Range","text":"We repeat the sine period a couple of times to achieve better resolution in our periodogram.","category":"page"},{"location":"Examples/dynamic_range/","page":"Dynamic Range","title":"Dynamic Range","text":"(Image: Lut-generated Sin-Cos Period)","category":"page"},{"location":"Examples/dynamic_range/","page":"Dynamic Range","title":"Dynamic Range","text":"Now lets compare the signals.","category":"page"},{"location":"Examples/dynamic_range/","page":"Dynamic Range","title":"Dynamic Range","text":"periodogram_50 = DSP.Periodograms.welch_pgram(sine_50, 2048, fs=1)\nperiodogram_100 = DSP.Periodograms.welch_pgram(sine_100, 2048, fs=1)\nperiodogram_500 = DSP.Periodograms.welch_pgram(sine_500, 2048, fs=1)\nperiodogram_2000 = DSP.Periodograms.welch_pgram(sine_2000, 2048, fs=1)\n\n# Normalize the power\nnormalized_power(pgram) = pow2db.(pgram.power ./ maximum(pgram.power))\n\nplot(periodogram_50.freq, normalized_power(periodogram_50), reuse = false, label=\"50\")\nplot!(periodogram_50.freq, normalized_power(periodogram_2000), reuse = false, label=\"2000\")\n\nplot!(xlabel=\"Normalized Frequency\", ylabel=\"Power [dB]\", title=\"Spurious-free dynamic range vs LUT size\")\nsavefig(\"lut-length_dynamic_range_small.svg\"); nothing # hide\n","category":"page"},{"location":"Examples/dynamic_range/","page":"Dynamic Range","title":"Dynamic Range","text":"The plot below shows the normalized dynamic range resulting from tables of different lengths. As we see, the harmonics decrease with increasing table length.","category":"page"},{"location":"Examples/dynamic_range/","page":"Dynamic Range","title":"Dynamic Range","text":"(Image: Lut Dynamic Range)","category":"page"},{"location":"Examples/dynamic_range/","page":"Dynamic Range","title":"Dynamic Range","text":"Due to the high number of spurs in the smaller tables, we have separated the results into two plots.","category":"page"},{"location":"Examples/dynamic_range/","page":"Dynamic Range","title":"Dynamic Range","text":"#plot(periodogram_50.freq, normalized_power(periodogram_50), reuse = false, label=\"50\")\n#plot(periodogram_50.freq, normalized_power(periodogram_100), reuse = false, label=\"100\")\nplot(periodogram_50.freq, normalized_power(periodogram_500), reuse = false, label=\"500\")\nplot!(periodogram_50.freq, normalized_power(periodogram_2000), reuse = false, label=\"2000\")\n\nplot!(xlabel=\"Normalized Frequency\", ylabel=\"Power [dB]\", title=\"Spurious-free dynamic range vs LUT size\")\nsavefig(\"lut-length_dynamic_range_large.svg\"); nothing # hide\n","category":"page"},{"location":"Examples/dynamic_range/","page":"Dynamic Range","title":"Dynamic Range","text":"(Image: Lut Dynamic Range)","category":"page"},{"location":"Examples/sine_speed_test/#Sine-Speeed-Test","page":"Sine Speeed Test","title":"Sine Speeed Test","text":"","category":"section"},{"location":"Examples/sine_speed_test/","page":"Sine Speeed Test","title":"Sine Speeed Test","text":"Let's compare the speed difference of using SineTables and Base.sin. We'll assume that the signal will be generated on a 12-bit DAC.","category":"page"},{"location":"Examples/sine_speed_test/","page":"Sine Speeed Test","title":"Sine Speeed Test","text":"We'll start by looking at the Base.sin version, so get the time-to-beat.","category":"page"},{"location":"Examples/sine_speed_test/","page":"Sine Speeed Test","title":"Sine Speeed Test","text":"using BenchmarkTools\n\n# Define the parameters for the sine wave generation\nnum_points = 4096\nscaling_factor = 2047  # Assuming 12-bit DAC\n\n# Function to generate a sine wave using Julia's base sin function (mutating version)\nfunction generate_sine_using_base_sin!(result::Vector{Int16}, num_points::Int, scaling_factor::Int)\n    for i in 1:num_points\n        phase = 2 * pi * (i-1) / num_points\n        result[i] = Int16(round(scaling_factor * sin(phase)))\n    end\nend\n\n# Preallocate the result array for the base sin version\nresult_base_sin = Vector{Int16}(undef, num_points)\n\n# Benchmark the Base.sin version with preallocated array\n@benchmark generate_sine_using_base_sin!($result_base_sin, $num_points, $scaling_factor)","category":"page"},{"location":"Examples/sine_speed_test/","page":"Sine Speeed Test","title":"Sine Speeed Test","text":"Now let's see what we can accomplish with our LUT-based sine.","category":"page"},{"location":"Examples/sine_speed_test/","page":"Sine Speeed Test","title":"Sine Speeed Test","text":"using ..SineTables\n\n# Generate a sine lookup table\nsine_table = create_sine_table(\n    Int16,          # LUT type\n    num_points,     # Number of points\n    0,              # Bias\n    scaling_factor  # Scaling\n)\n\n# Function to generate a sine wave using the LUT (mutating version)\nfunction generate_sine_using_lut!(result::Vector{Int16}, table::SineTable, num_points::Int)\n    lut_result = Ref{Int16}(0)\n    for i in 1:num_points\n        phase = 2 * pi * (i-1) / num_points\n        lut_sine!(lut_result, table, phase)\n        result[i] = lut_result[]\n    end\nend\n\n# Preallocate the result array\nresult_lut = Vector{Int16}(undef, num_points)\n\n# Benchmark the LUT version with preallocated array\n@benchmark generate_sine_using_lut!($result_lut, $sine_table, $num_points)","category":"page"},{"location":"Examples/sine_speed_test/","page":"Sine Speeed Test","title":"Sine Speeed Test","text":"Well this is embarresing.. The LUT-version is way slower than simply using Base.sin. Maybe we can reduce the time by precalculationg the phase increment?","category":"page"},{"location":"Examples/sine_speed_test/","page":"Sine Speeed Test","title":"Sine Speeed Test","text":"# Function to generate a sine wave using the LUT (optimized version)\nfunction generate_sine_using_lut_optimized!(result::Vector{Int16}, table::SineTable, num_points::Int)\n    phase_increment = 2 * pi / num_points  # Precompute phase increment\n    phase = 0.0\n\n    for i in 1:num_points\n        index = SineTables.get_index(phase, num_points)\n        result[i] = table.table[index + 1]  # Direct access, no Ref needed\n        phase += phase_increment\n    end\nend\n\n# Preallocate the result array\nresult_lut = Vector{Int16}(undef, num_points)\n\n# Benchmark the optimized LUT version with preallocated array\n@benchmark generate_sine_using_lut_optimized!($result_lut, $sine_table, $num_points)","category":"page"},{"location":"Examples/sine_speed_test/","page":"Sine Speeed Test","title":"Sine Speeed Test","text":"Puh, that was close! As we can see, it is possible to get slightly faster sin-generation using this LUT package. If this is worth the added complexity is another matter.","category":"page"},{"location":"Examples/basic_use/#Basic-Use","page":"Basic Use","title":"Basic Use","text":"","category":"section"},{"location":"Examples/basic_use/","page":"Basic Use","title":"Basic Use","text":"Let's create a lookup table for a 12-bit DAC.","category":"page"},{"location":"Examples/basic_use/","page":"Basic Use","title":"Basic Use","text":"using ..SineTables\nusing Plots\n\n# Create a sine lookup table with integer\nsine_table = create_sine_table(\n    Int16, # LUT type\n    256,   # Number of pints\n    0,     # Bias\n    2047   # Scaling\n)\n\n\n# Fetch a sine value for a phase (in radians)\nsine_value = lut_sine(sine_table, pi / 4)  # For phase = π/4\n\n# Fetch a cosine value for the same phase\ncosine_value = lut_cosine(sine_table, pi / 4)","category":"page"},{"location":"Examples/basic_use/","page":"Basic Use","title":"Basic Use","text":"length(sine_table.table)","category":"page"},{"location":"Examples/basic_use/","page":"Basic Use","title":"Basic Use","text":"plot(sine_table.table, linetype = [:steppre], title=\"LUT Contents\")\nsavefig(\"LUT_table.svg\"); nothing # hide","category":"page"},{"location":"Examples/basic_use/","page":"Basic Use","title":"Basic Use","text":"(Image: LUT Table)","category":"page"},{"location":"Examples/basic_use/","page":"Basic Use","title":"Basic Use","text":"Now we can make a sine with our LUT.","category":"page"},{"location":"Examples/basic_use/","page":"Basic Use","title":"Basic Use","text":"# Create a vector of the sine values for a full period\nsine_period = [lut_sine(sine_table, 2 * pi * i / 64) for i in 0:63]\ncosine_period = [lut_cosine(sine_table, 2 * pi * i / 64) for i in 0:63]\nplot(sine_period, linetype = [:steppre], label = \"Sine\")\nplot!(cosine_period, linetype = [:steppre], label = \"Cosine\")\n\nsavefig(\"sin_cos.svg\"); nothing # hide","category":"page"},{"location":"Examples/basic_use/","page":"Basic Use","title":"Basic Use","text":"The below plot shows the resulting sine and cosine period.","category":"page"},{"location":"Examples/basic_use/","page":"Basic Use","title":"Basic Use","text":"(Image: Lut-generated Sin-Cos Period)","category":"page"},{"location":"#SineTables.jl-Documentation","page":"SineTables.jl Documentation","title":"SineTables.jl Documentation","text":"","category":"section"},{"location":"","page":"SineTables.jl Documentation","title":"SineTables.jl Documentation","text":"Modules = [SineTables]","category":"page"},{"location":"#SineTables.SineTable","page":"SineTables.jl Documentation","title":"SineTables.SineTable","text":"Store the lookup table and additional parameters\n\n\n\n\n\n","category":"type"},{"location":"#SineTables.create_sine_table-Union{Tuple{T}, Tuple{Type{T}, Integer}, Tuple{Type{T}, Integer, Number}, Tuple{Type{T}, Integer, Number, Number}} where T","page":"SineTables.jl Documentation","title":"SineTables.create_sine_table","text":"create_sine_table(::Type{T}, points::Integer, bias::Number=0, scale::Number=1) -> SineTable{T}\n\nCreates a lookup table for the sine function for the entire wave.\n\n\n\n\n\n","category":"method"},{"location":"#SineTables.get_index-Tuple{Number, Integer}","page":"SineTables.jl Documentation","title":"SineTables.get_index","text":"get_index(phase::Number, points::Integer) -> Integer\n\nUtility function to fetch the index corresponding to the phase\n\n\n\n\n\n","category":"method"},{"location":"#SineTables.lut_cosine!-Union{Tuple{T}, Tuple{Ref{T}, SineTable, Float64}} where T","page":"SineTables.jl Documentation","title":"SineTables.lut_cosine!","text":"lut_cosine!(result::T, table::SineTable, phase::Float64) -> nothing\n\nMutating version of lut_cosine, stores the cosine value in result.\n\n\n\n\n\n","category":"method"},{"location":"#SineTables.lut_cosine-Tuple{SineTable, Float64}","page":"SineTables.jl Documentation","title":"SineTables.lut_cosine","text":"lut_cosine(table::SineTable, phase::Float64) -> T\n\nFetch a cosine value for a given phase using the lookup table.\n\n\n\n\n\n","category":"method"},{"location":"#SineTables.lut_sine!-Union{Tuple{T}, Tuple{Ref{T}, SineTable, Float64}} where T","page":"SineTables.jl Documentation","title":"SineTables.lut_sine!","text":"lut_sine!(result::T, table::SineTable, phase::Float64) -> nothing\n\nMutating version of lut_sine, stores the sine value in result.\n\n\n\n\n\n","category":"method"},{"location":"#SineTables.lut_sine-Tuple{SineTable, Float64}","page":"SineTables.jl Documentation","title":"SineTables.lut_sine","text":"lut_sine(table::SineTable, phase::Float64) -> T\n\nFetch a sine value for a given phase using the lookup table.\n\n\n\n\n\n","category":"method"}]
}
