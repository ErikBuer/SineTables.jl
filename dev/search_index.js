var documenterSearchIndex = {"docs":
[{"location":"Examples/dynamic_range/#Dynamic-Range","page":"Dynamic Range","title":"Dynamic Range","text":"","category":"section"},{"location":"Examples/dynamic_range/","page":"Dynamic Range","title":"Dynamic Range","text":"Lets see what dynamic range we can achieve with LUTs of different sizes. We'll assume that the signal will be generated on a 12-bit DAC.","category":"page"},{"location":"Examples/dynamic_range/","page":"Dynamic Range","title":"Dynamic Range","text":"using ..SineTables\nusing Plots\nusing DSP\n\n# Create a sine lookup table with integer\nsine_table_50 = create_sine_table(\n    Int16, # LUT type\n    50,    # Number of pints in a quarter sine'\n    0,     # Bias\n    2047   # Scaling\n)\n\n# Create a sine lookup table with integer\nsine_table_100 = create_sine_table(\n    Int16, # LUT type\n    100,   # Number of pints in a quarter sine'\n    0,     # Bias\n    2047    # Scaling\n)\n\nsine_table_500 = create_sine_table(\n    Int16, # LUT type\n    500,   # Number of pints in a quarter sine'\n    0,     # Bias\n    2047   # Scaling\n)\n\nsine_table_2000 = create_sine_table(\n    Int16, # LUT type\n    2000,  # Number of pints in a quarter sine'\n    0,     # Bias\n    2047   # Scaling\n)\n\n\nsine_50 = [lut_sine(sine_table_50, 2 * pi * i / 21.12) for i in 0:8192]\nplot(sine_50[1:127], linetype = [:steppre], label = \"Sine\")\nsavefig(\"sine_50.svg\"); nothing # hide\n\nsine_100 = [lut_sine(sine_table_100, 2 * pi * i / 21.12) for i in 0:8192]\nsine_500 = [lut_sine(sine_table_500, 2 * pi * i / 21.12) for i in 0:8192]\nsine_2000 = [lut_sine(sine_table_2000, 2 * pi * i / 21.12) for i in 0:8192]\nnothing","category":"page"},{"location":"Examples/dynamic_range/","page":"Dynamic Range","title":"Dynamic Range","text":"We repeat the sine period a couple of times to achieve better resolution in our periodogram.","category":"page"},{"location":"Examples/dynamic_range/","page":"Dynamic Range","title":"Dynamic Range","text":"(Image: Lut-generated Sin-Cos Period)","category":"page"},{"location":"Examples/dynamic_range/","page":"Dynamic Range","title":"Dynamic Range","text":"Now lets compare the signals.","category":"page"},{"location":"Examples/dynamic_range/","page":"Dynamic Range","title":"Dynamic Range","text":"periodogram_50 = DSP.Periodograms.welch_pgram(sine_50, 2048, fs=1)\nperiodogram_100 = DSP.Periodograms.welch_pgram(sine_100, 2048, fs=1)\nperiodogram_500 = DSP.Periodograms.welch_pgram(sine_500, 2048, fs=1)\nperiodogram_2000 = DSP.Periodograms.welch_pgram(sine_2000, 2048, fs=1)\n\n# Normalize the power\nnormalized_power(pgram) = pow2db.(pgram.power ./ maximum(pgram.power))\n\nplot(periodogram_50.freq, normalized_power(periodogram_50), reuse = false, label=\"50\")\nplot!(periodogram_50.freq, normalized_power(periodogram_2000), reuse = false, label=\"2000\")\n\nplot!(xlabel=\"Frequency [Hz]\", ylabel=\"Power [dB/Hz]\", title=\"Spurious-free dynamic range vs LUT size\")\nsavefig(\"lut-length_dynamic_range_small.svg\"); nothing # hide\n","category":"page"},{"location":"Examples/dynamic_range/","page":"Dynamic Range","title":"Dynamic Range","text":"The plot below shows the normalized dynamic range resulting from tables of different length. As we see, the harmonics decrease with increasing table length.","category":"page"},{"location":"Examples/dynamic_range/","page":"Dynamic Range","title":"Dynamic Range","text":"(Image: Lut Dynamic Range)","category":"page"},{"location":"Examples/dynamic_range/","page":"Dynamic Range","title":"Dynamic Range","text":"Due to the high number of spurs in the smaller tables, we have separated the results in two plots.","category":"page"},{"location":"Examples/dynamic_range/","page":"Dynamic Range","title":"Dynamic Range","text":"#plot(periodogram_50.freq, normalized_power(periodogram_50), reuse = false, label=\"50\")\n#plot(periodogram_50.freq, normalized_power(periodogram_100), reuse = false, label=\"100\")\nplot(periodogram_50.freq, normalized_power(periodogram_500), reuse = false, label=\"500\")\nplot!(periodogram_50.freq, normalized_power(periodogram_2000), reuse = false, label=\"2000\")\n\nplot!(xlabel=\"Frequency [Hz]\", ylabel=\"Power [dB/Hz]\", title=\"Spurious-free dynamic range vs LUT size\")\nsavefig(\"lut-length_dynamic_range_large.svg\"); nothing # hide\n","category":"page"},{"location":"Examples/dynamic_range/","page":"Dynamic Range","title":"Dynamic Range","text":"(Image: Lut Dynamic Range)","category":"page"},{"location":"Examples/basic_use/#Basic-Use","page":"Basic Use","title":"Basic Use","text":"","category":"section"},{"location":"Examples/basic_use/","page":"Basic Use","title":"Basic Use","text":"Lets create a lookup table for a 12-bit DAC.","category":"page"},{"location":"Examples/basic_use/","page":"Basic Use","title":"Basic Use","text":"using ..SineTables\nusing Plots\n\n# Create a sine lookup table with integer\nsine_table = create_sine_table(\n    Int16, # LUT type\n    256,   # Number of pints in a quarter sine'\n    0,     # Bias\n    2047    # Scaling\n)\n\n\n# Fetch a sine value for a phase (in radians)\nsine_value = lut_sine(sine_table, pi / 4)  # For phase = π/4\n\n# Fetch a cosine value for the same phase\ncosine_value = lut_cosine(sine_table, pi / 4)","category":"page"},{"location":"Examples/basic_use/","page":"Basic Use","title":"Basic Use","text":"Now we can create a sine with the created LUT.","category":"page"},{"location":"Examples/basic_use/","page":"Basic Use","title":"Basic Use","text":"# Create a vector of the sine values for a full period\nsine_period = [lut_sine(sine_table, 2 * pi * i / 64) for i in 0:63]\ncosine_period = [lut_cosine(sine_table, 2 * pi * i / 64) for i in 0:63]\nplot(sine_period, linetype = [:steppre], label = \"Sine\")\nplot!(cosine_period, linetype = [:steppre], label = \"Cosine\")\n\nsavefig(\"sin_cos.svg\"); nothing # hide","category":"page"},{"location":"Examples/basic_use/","page":"Basic Use","title":"Basic Use","text":"The below plot shows the resulting sine and cosine period.","category":"page"},{"location":"Examples/basic_use/","page":"Basic Use","title":"Basic Use","text":"(Image: Lut-generated Sin-Cos Period)","category":"page"},{"location":"#SineTables.jl-Documentation","page":"SineTables.jl Documentation","title":"SineTables.jl Documentation","text":"","category":"section"},{"location":"","page":"SineTables.jl Documentation","title":"SineTables.jl Documentation","text":"Modules = [SineTables]","category":"page"},{"location":"#SineTables.SineTable","page":"SineTables.jl Documentation","title":"SineTables.SineTable","text":"Store the lookup table and additional parameters\n\n\n\n\n\n","category":"type"},{"location":"#SineTables.create_sine_table-Union{Tuple{T}, Tuple{Type{T}, Integer}, Tuple{Type{T}, Integer, Number}, Tuple{Type{T}, Integer, Number, Number}} where T","page":"SineTables.jl Documentation","title":"SineTables.create_sine_table","text":"create_sine_table(::Type{T}, points::Int, bias::T=0, scale::T=1) -> SineTable{T}\n\nCreates a lookup table for the sine function for a quarter wave.\n\n\n\n\n\n","category":"method"},{"location":"#SineTables.lut_cosine-Tuple{SineTables.SineTable, Float64}","page":"SineTables.jl Documentation","title":"SineTables.lut_cosine","text":"lut_cosine(table::SineTable, phase::Float64) -> T\n\nFetch a cosine value for a given phase using the lookup table.\n\n\n\n\n\n","category":"method"},{"location":"#SineTables.lut_sine-Tuple{SineTables.SineTable, Float64}","page":"SineTables.jl Documentation","title":"SineTables.lut_sine","text":"lut_sine(table::SineTable, phase::Float64) -> T\n\nFetch a sine value for a given phase using the lookup table.\n\n\n\n\n\n","category":"method"}]
}
