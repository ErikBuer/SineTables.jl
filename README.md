# SineTables.jl

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
