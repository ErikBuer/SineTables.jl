push!(LOAD_PATH,"../src/")

using Documenter


# Running `julia --project docs/make.jl` can be very slow locally.
# To speed it up during development, one can use make_local.jl instead.
# The code below checks wether its being called from make_local.jl or not.
const LOCAL = get(ENV, "LOCAL", "false") == "true"

if LOCAL
    include("../src/SineTables.jl")
    using .SineTables
else
    using SineTables
    ENV["GKSwstype"] = "100"
end

DocMeta.setdocmeta!(SineTables, :DocTestSetup, :(using SineTables); recursive=true)

makedocs(
    format = Documenter.HTML(),
    modules=[SineTables],
    sitename="SineTables.jl",
    pages = Any[
        "index.md",
        "Examples"  => Any[ 
                        "Examples/basic_use.md",
                        "Examples/dynamic_range.md",
                        "Examples/speed_test.md",
                    ],
    ],
    doctest  = true,
)

deploydocs(
    repo = "github.com/ErikBuer/SineTables.jl.git",
    push_preview = true,
)