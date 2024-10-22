module SineTables

using Base: pi

export create_sine_table, lut_sine, lut_sine!, lut_cosine, lut_cosine!, SineTable

"""
Store the lookup table and additional parameters
"""
struct SineTable{T}
    table::Vector{T}
    bias::Number
    scale::Number
    points::Integer
end

"""
    create_sine_table(::Type{T}, points::Integer, bias::Number=0, scale::Number=1) -> SineTable{T}

Creates a lookup table for the sine function for the entire wave.
"""
function create_sine_table(::Type{T}, points::Integer, bias::Number=0, scale::Number=1) where T
    # Precompute the sine wave for the entire cycle (0 to 2*pi)
    table = [T(round(bias + scale * sin(2pi * i / points))) for i in 0:points-1]
    return SineTable{T}(table, bias, scale, points)
end

"""
    get_index(phase::Number, points::Integer) -> Integer
    
Utility function to fetch the index corresponding to the phase
"""
function get_index(phase::Number, points::Integer)
    # Normalize the phase in the range [0, 2*pi)
    norm_phase = mod(phase, 2pi)
    index = round(Int, (norm_phase / (2pi)) * points)
    return index % points  # Ensure the index wraps around
end

"""
    lut_sine(table::SineTable, phase::Float64) -> T

Fetch a sine value for a given phase using the lookup table.
"""
function lut_sine(table::SineTable, phase::Float64)
    index = get_index(phase, table.points)
    return table.table[index + 1]
end

"""
    lut_sine!(result::T, table::SineTable, phase::Float64) -> nothing

Mutating version of lut_sine, stores the sine value in `result`.
"""
function lut_sine!(result::Ref{T}, table::SineTable, phase::Float64) where T
    index = get_index(phase, table.points)
    result[] = table.table[index + 1]
end

"""
    lut_cosine(table::SineTable, phase::Float64) -> T

Fetch a cosine value for a given phase using the lookup table.
"""
function lut_cosine(table::SineTable, phase::Float64)
    index = get_index(phase + pi/2, table.points)  # Cosine is just a phase shift of sine
    return table.table[index + 1]
end

"""
    lut_cosine!(result::T, table::SineTable, phase::Float64) -> nothing

Mutating version of lut_cosine, stores the cosine value in `result`.
"""
function lut_cosine!(result::Ref{T}, table::SineTable, phase::Float64) where T
    index = get_index(phase + pi/2, table.points)  # Cosine is just a phase shift of sine
    result[] = table.table[index + 1]
end

end  # module SineTables
