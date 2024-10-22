# Dynamic Range

Let's see what dynamic range we can achieve with LUTs of different sizes.
We'll assume that the signal will be generated on a 12-bit DAC.

```@example SineTables
using ..SineTables
using Plots
using DSP

# Create a sine lookup table with integer
sine_table_50 = create_sine_table(
    Int16, # LUT type
    50,    # Number of pints
    0,     # Bias
    2047   # Scaling
)

# Create a sine lookup table with integer
sine_table_100 = create_sine_table(
    Int16, # LUT type
    100,   # Number of pints
    0,     # Bias
    2047    # Scaling
)

sine_table_500 = create_sine_table(
    Int16, # LUT type
    500,   # Number of pints
    0,     # Bias
    2047   # Scaling
)

sine_table_2000 = create_sine_table(
    Int16, # LUT type
    2000,  # Number of pints
    0,     # Bias
    2047   # Scaling
)


sine_50 = [lut_sine(sine_table_50, 2 * pi * i / 21.12) for i in 0:8192]
plot(sine_50[1:127], linetype = [:steppre], label = "Sine")
savefig("sine_50.svg"); nothing # hide

sine_100 = [lut_sine(sine_table_100, 2 * pi * i / 21.12) for i in 0:8192]
sine_500 = [lut_sine(sine_table_500, 2 * pi * i / 21.12) for i in 0:8192]
sine_2000 = [lut_sine(sine_table_2000, 2 * pi * i / 21.12) for i in 0:8192]
nothing
```

We repeat the sine period a couple of times to achieve better resolution in our periodogram.

![Lut-generated Sin-Cos Period](sine_50.svg)

Now lets compare the signals.

```@example SineTables
periodogram_50 = DSP.Periodograms.welch_pgram(sine_50, 2048, fs=1)
periodogram_100 = DSP.Periodograms.welch_pgram(sine_100, 2048, fs=1)
periodogram_500 = DSP.Periodograms.welch_pgram(sine_500, 2048, fs=1)
periodogram_2000 = DSP.Periodograms.welch_pgram(sine_2000, 2048, fs=1)

# Normalize the power
normalized_power(pgram) = pow2db.(pgram.power ./ maximum(pgram.power))

plot(periodogram_50.freq, normalized_power(periodogram_50), reuse = false, label="50")
plot!(periodogram_50.freq, normalized_power(periodogram_2000), reuse = false, label="2000")

plot!(xlabel="Frequency [Hz]", ylabel="Power [dB/Hz]", title="Spurious-free dynamic range vs LUT size")
savefig("lut-length_dynamic_range_small.svg"); nothing # hide

```

The plot below shows the normalized dynamic range resulting from tables of different lengths.
As we see, the harmonics decrease with increasing table length.

![Lut Dynamic Range](lut-length_dynamic_range_small.svg)

Due to the high number of spurs in the smaller tables, we have separated the results into two plots.

```@example SineTables
#plot(periodogram_50.freq, normalized_power(periodogram_50), reuse = false, label="50")
#plot(periodogram_50.freq, normalized_power(periodogram_100), reuse = false, label="100")
plot(periodogram_50.freq, normalized_power(periodogram_500), reuse = false, label="500")
plot!(periodogram_50.freq, normalized_power(periodogram_2000), reuse = false, label="2000")

plot!(xlabel="Frequency [Hz]", ylabel="Power [dB/Hz]", title="Spurious-free dynamic range vs LUT size")
savefig("lut-length_dynamic_range_large.svg"); nothing # hide

```

![Lut Dynamic Range](lut-length_dynamic_range_large.svg)
