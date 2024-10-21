# SineTables.jl

This package experiments with using LUTs to speed up tone generation.

## Testing the code

From project root, run the following bash command.

```bash
julia --project=. -e 'using Pkg; Pkg.test()'
```

## Make docs

Use either of the two methods:

```bash
cd docs
julia --project=.. make.jl
```

Or run

```bash
julia make_local.jl
```
