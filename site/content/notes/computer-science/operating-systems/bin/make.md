---
title: make
description: |
  "Make" is a build automation tool commonly used in software development to compile source code and
  create executable programs or other output files. It automates the process of building complex
  software projects, including compiling source code, linking object files, and creating executable files or other types of output.

  <br />
  In this article I cover the following: targets and prerequisites, variables, recipes to build an out of date target and
  finally an example of how to use it in a simple C++ project.
image: https://interrupt.memfault.com/img/gnu-make-guidelines/gnu-make.png
tags: ["make", "makefile", "tooling", "build automation tools", "c++", "c"]

date: 2016-03-31 19:34:48
nomath: true
references:
  - "Lipschitz, H. (2013). A Simple C++ Project Structure - Hiltmon. [online] Hiltmon.com. Available at: http://hiltmon.com/blog/2013/07/03/a-simple-c-plus-plus-project-structure/ [Accessed 5 Apr. 2016]."
  - Makefile tutorial by example. Makefile Tutorial. (n.d.). Retrieved April 12, 2023, from https://makefiletutorial.com/ 
---

[`make`](http://www.gnu.org/software/make/manual/make.html) is a tool to simplify building executables from many sources, `make` will only re-build things that need to be re-built

Contents of a makefile

- **variable definitions**, text that can be substituted later
- **explicit rules**, says when and how to remake files called the rule's *targets*, it lists files that the target depends on called *prerequisites* and may also give a *recipe* to update the targets
- **implicit rules**, says when and how to remake files *based on the filename*, it describes the dependencies of the target and gives a recipe to create/update such a target
- **directives**, special instructions like
  - reading from another makefile `include a.Makefile b.Makefile`
  - decide based on some variables to use or not part of the makefile
  - defining multiline variables

## Rules

```makefile
targets : prerequisites
[tab] recipe
```

A rule tells `make` two things, when `targets` are out of date and how to update them when necessary

- `targets` are filenames separated by spaces, usually there's only one filename per rule
- `prerequisites` determine when `targets` are out of date, `targets` are out of date if it doesn't exist or is older than any of the `prerequisites` (by comparison of the last-modification time)
- `recipe` determines how to update `targets` when they're out of date, this is one or more lines to be executed by the shell

Example

```makefile
foo.o : foo.c defs.h
  cc -c -g foo.c
```

The target is `foo.o`, the prerequisites are `foo.c` and `defs.h`, the command to update `foo.o` is `cc -c -g foo.c`, additionally it tells two things

- how to decide whether `foo.o` is out of date, it's out of date if `foo.c` or `defs.h` is more recent than it
- how to update `foo.o`, it's updated by compiling `foo.c` assuming that it includes `defs.h`

### Wildcards

A single file can specify multiple files using wildcard character (the same as the ones in Bash e.g. `*`, `?`, `""`)

```makefile
clean:
  rm -f *.o     # `make clean` removes all the object files
```

To define a variable with a wildcard use

```makefile
objects := $(wildcard *.o)
```

### Phony targets

A phony target is one that is not the name of a file, it's just the name of a recipe to be executed when you make an explicit request, the two reasons to use a phony target are

- to avoid conflict with a file of the same name
- to improve performance by avoiding the implicit rule search on this type of targets

When a rule has a recipe that won't create the target file it will be executed every time the target comes up for remaking

```makefile
clean:
  rm *.o program
```

If `make clean` is run the target clean will always be out of date (assuming such a file doesn't exist) then the recipe will always be executed

If there's a file `clean` the recipe will never be executed because since the target `clean` has no dependencies it's considered to be always up to date, to avoid this problem we make the target a phony target, once this is done the recipe will be executed regardless of the existence of a file named `clean`

```makefile
.PHONY: clean
clean:
  rm *.o program
```

### Implicit rules

`make` is able to figure out which implicit rule to use based on the kind of source file that needs to be make/updated, for example the makefile

```makefile
foo : foo.o bar.o
  cc -o foo foo.o bar.o $(CFLAGS) $(LDFLAGS)
```

Doesn't have rules on how to make `foo.o` or `bar.o`, `make` will automatically look for an implicit rule that tells how to make/update it from a catalogue of built in rules

Among the [ catalogue of built in rules ](http://www.gnu.org/software/make/manual/make.html#Catalogue-of-Rules) for POSIX based OS the ones for C and C++ programs are

- Compiling C, `n.o` is made from `n.c` automatically with a recipe of the form

```makefile
$(CC) $(CPPFLAGS) $(CFLAGS) -c
```

- Compiling C++, `n.c` is made from `n.cc,n.cpp,n.C` with a recipe of the form

```makefile
$(CXX) $(CPPFLAGS) $(CXXFLAGS) -c
```

- Linking C, `n` is made from `n.o` by running the linker `ld` via the C compiler with a recipe of the form

```makefile
$(CC) $(LDFLAGS) n.o $(LOADLIBES) $(LDLIBS)
```

Variables used by implicit rules

- `CC` (default `cc`)
- `CXX` (default `g++`)
- `CXXFLAGS, CPPFLAGS, CFLAGS` (default empty)

### Pattern rules

A pattern rule contains `%` exactly once in the target which matches any nonempty substring called the *stem*, then `%` in the prerequisites of a rule stands for the same stem that was matched in the target, for example a rule in the form

```makefile
%.o: %.c
  rule
```

The recipe then needs a way to operate on the right source file name, such a name can't be written on the recipe because the name is different each time the implicit rule is used, to refer to the correct name we use [**automatic variables**](http://www.gnu.org/software/make/manual/make.html#Automatic-Variables) which are variables computed afresh for each rule that is executed, they only have values *within* the recipe, the most used ones are

- `$@` - the filename of the target of the rule
- `$<` - the name of the first prerequisite
- `$^` - the name of all the prerequisites
- `$?` - the name of all the prerequisites that are newer than the target
- `$*` - the stem

For example

```makefile
%.o: %.c
  $(CC) -c $(CFLAGS) $(CPPFLAGS) $< -o $@
```

Specifies how to make an object file `n.o` from a source file `n.c` provided that `n.c` exists or can be made, inside the recipe the automatic variables `$@` and `$<` correspond to the target file and source file respectively

## Variables

To substitute a variable's value write `$(var)` or `${var}`

```makefile
objects = program.o foo.o utils.o
program : $(objects)
  cc -o program $(objects)

$(objects) : defs.h
```

### Setting variables

Variables defined with

- `=`, `define` *recursively expanded variable* - if the value contains references to other variables these references are expanded whenever this variable is substituted

```makefile
foo = $(bar)
bar = $(message)
message = hello

all:
  echo $(foo)   # prints hello
```

- `:=` or `::=` *simple expanded variable* - the value of a variable is set as of the time it was defined

```makefile
x := foo
y := $(x) bar
x := later

# at this point
#   - x is equal to `later`
#   - y is equal to `foo bar`
```

- `?=` sets the value of a variable if it's not already set

```makefile
foo = hello
foo ?= bar
# foo is equal to `hello`
```

- `!=` executes a program and sets a variable to its output (alternatively use `$(shell commands)`)

```makefile
foo != printf `hi`
# foo is equal to `hi`
```

### Advanced features for reference to variables

- substitution reference `$(var:a=b)` - substitutes every `a` at the end of a word with `b`

```makefile
foo := a.o b.o c.o
bar := $(foo:.o=.c)
# bar is equal to `a.c b.c c.c`
```

- computed variable names `$($(a))` - nested variable reference

```makefile
x = y
y = z
a := $($(x))   # a is equal to `z`
```

## Recipes

Each line must start with a tab, any line in the makefile that begins with tab and appears in a "rule context" will be considered part of the recipe for that rule, blank lines that appear in the middle of rules are ignored

Each time a recipe is executed `make` will invoke a new sub-shell for each line of the recipe, this implies that setting shell variables will not affect the following lines in the recipe

```makefile
foo: bar/lose
  cd $bar   # dir is ./bar/
  cat file  # dir is ./
```

Normally `make` prints each line of the recipe in the shell before it's executed to avoid this behavior prepend `@`

```makefile
program.o: program.c
  @cc -c -g program.c
  # won't print the compilation line on the terminal
```

To ignore errors in a recipe line prepend the command with `-`

```makefile
clean:
  -rm -f *.o
```

## Running `make`

The simplest use is to recompile every file that is out of date, however it's possible to update only some files, or find out which files are out of date without changing them

The exist status of make is always one of the following

- 0 - `make` is successful
- 1 - if `-q` is used and `make` determines that some target is not already up to date
- 2 - if `make` encountered any errors

### Goals

The goals are the targets that `make` should strive to update (other targets are updated if they appear as prerequisites of goals, or prerequisites of prerequisites of goals, etc)

By default the goal is the first target in the makefile (not counting targets that start with `.`)

A different goal can be specified with arguments to `make` by using their names, if many goals are specified `make` processes each of them in turn, any target in the makefile may be specified as a goal unless it starts with `-` or contains `=` (parsed as a switch or variable definition respectively)

For example given a project with multiple programs we can compile only a part of the program by specifying as a goal each file that we wish to remake

```makefile
.PHONY: all
all: a b c
```

If we're working on the program `a` we can execute `make a` so that only files of that program are recompiled

Specifying a goal has the following advantages

- make files that are normally not made i.e. rules that are not prerequisites of the default goal e.g. a file for debugging output
- run a recipe associated with a phony target

### Flags

- `-f [filename]` - use `filename` as the makefile (default to `GNUMakefile,makefile,Makefile`)
- `-n` - prints all the recipes that are needed to update the targets without executing them
- `-q` - check whether the targets are up to date, the exit code shows if updates are needed
- `-t` - makes targets up to date without changing them (their modified times are updated)
- `-k` - try to compile every file that can be tried instead of exiting on the first failure

### Overriding variables

Given the following makefile

```makefile
CFLAGS = -g

all: program.o

program.o: program.c
  cc -c $(CFLAGS) program.c

.PHONY: all
```

We can override the value of the variable `CFLAGS` when make is executed like this `make CFLAGS="-g -O"`

## Convention for makefiles

Every makefile should include

```makefile
# avoid trouble on systems where `SHELL` might be inherited from the environment
SHELL = /bin/sh

# specify all the suffixes which may be subject to implicit rules in this makefile
.SUFFIXES:            # clears the suffix list
.SUFFIXES: .c .o
```

- Use `$(srcdir)/` to refer to the location of the source files when the build directory is distinct from the source file directory
- Use variables for specifying commands e.g. `$(CXX)` instead of `g++`
- File management utilities such as `ln,rm,mv` don't need to be referred through variables since users don't need to replace them with other programs
- Every makefile should define the var `INSTALL` which is the basic command for installing a file into the system

Standard targets

- `all` - compiles the entire program, this should be the default target
- `install` - compile the program and copy the executables, libraries to the desired place
- `clean` - delete all the files that are created by building the program

## Example

<div>
  {{< gist mauriciopoppe de8908f67923091982c8c8136a063ea6 >}}
</div>

