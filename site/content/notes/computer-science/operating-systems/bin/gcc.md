---
title: "gcc"
summary: |
  GCC is a suite of compilers for various programming languages, including C, C++. In this article,
  I cover the compilation stages and the flags used to compile source code into a binary
image: https://upload.wikimedia.org/wikipedia/commons/a/af/GNU_Compiler_Collection_logo.svg
tags: ["gcc", "build tools", "tooling", "c++", "c"]
date: 2016-04-05 17:56:08
references:
  - "GCC, C. (2008). Compilation process in GCC ~ Codingfreak. [online] Codingfreak.blogspot.com. Available at: http://codingfreak.blogspot.com/2008/02/compilation-process-in-gcc.html [Accessed 5 Apr. 2016]."
---

## Stages

- *preprocessing* - text substitution, stripping comments and file inclusion

```sh
g++ -E main.cpp -o main.i
```

- *compilation* - compilation of the processed source code into assembly language

```sh
g++ -S main.i -o main.s
# or
g++ -S main.cpp -o main.s
```

- *assembler* - conversion of assembly code into machine code

```sh
as main.s -o main.o
# or
g++ -c main.cpp -o main.o
```

- *linker* - produce a single executable program file, it combines our program with startup code like the following ones
  - standard code at the beginning of the program to set up the running environment to pass command-line parameters and environmental variables
  - standard code at the end of the program to pass back a return code

```sh
g++ main.cpp -o main
```

## Flags

- `-E` run the preprocessing stage
- `-S` run the preprocessing and compilation stages
- `-c` run the preprocessing, compilation and assemble stages
- `-o file` write output to *file*
- `-llibrary`, `-l library` search the library named *library* when linking
- `-Idir` add *dir* to the list of directories to be searched for header files
- `-Ldir` add *dir* to the list of directories to be searched for `-l`
- `-Wall` enable all the warnings about some constructions considered questionable by some users
- `-O` enable optimization


