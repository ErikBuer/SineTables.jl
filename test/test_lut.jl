using SineTables
using Plots, DSP

# Create a sine lookup table with integer
sine_table = create_sine_table(Int, 512, 0, 1024)


# Fetch a sine value for a phase (in radians)
sine_value = lut_sine(sine_table, pi / 4)  # For phase = π/4

# Fetch a cosine value for the same phase
cosine_value = lut_cosine(sine_table, pi / 4)

# Create a vector of the sine values for a full period
sine_period = [lut_sine(sine_table, 2 * pi * i / 64) for i in 0:63]
cosine_period = [lut_cosine(sine_table, 2 * pi * i / 64) for i in 0:63]
plot(sine_period, linetype = [:steppre], label = "Sine")
plot!(cosine_period, linetype = [:steppre], label = "Cosine")

#______________________________________________________________________________

# append ten waves after each other
sine_waves = vcat([sine_period for _ in 1:100]...)
plot(sine_waves, linetype = [:steppre])



#______________________________________________________________________________

function plot_periodogram(signal::AbstractVector, sample_rate_hz::Real=1.0)
    periodogram = DSP.Periodograms.welch_pgram(signal, fs=sample_rate_hz)
    # Normalize the power
    periodogram_power = periodogram.power ./ maximum(periodogram.power)
    periodogram_plot = plot(periodogram.freq, 10 .*log10.(periodogram_power), reuse = false)
    plot!(xlabel="Frequency [Hz]", ylabel="Power [dB/Hz]")
    display(periodogram_plot)
end


plot_periodogram(sine_waves)