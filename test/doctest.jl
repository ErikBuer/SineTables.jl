using Documenter
using AssortedDSP

DocMeta.setdocmeta!(AssortedDSP, :DocTestSetup, :(using AssortedDSP); recursive=true)
Documenter.doctest(AssortedDSP)