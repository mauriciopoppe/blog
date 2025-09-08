---
title: "CMake"
summary: |
  CMake is a cross-platform build system generator of `Makefile`s. Projects specify their build process with platform-independent CMake listfiles included in each directory of a source tree with the name `CMakeLists.txt`. This article explains how to use CMake to build projects.
image: https://www.kitware.com/main/wp-content/uploads/2016/11/CMake-Logo-and-Text-e1540917038464.png
tags: ["cmake", "tooling", "build automation tools", "c++", "c"]
date: 2016-03-31 19:31:37
references:
  - "C++ project organisation (with gtest, c. (2016). C++ project organisation (with gtest, cmake and doxygen). [online] Stackoverflow.com. Available at: http://stackoverflow.com/a/13522826/3341726 [Accessed 5 Apr. 2016]."
---

Executable:

```sh
$ cmake [options] (<path-to-source> | <path-to-existing-build>)
```

Assuming that the directory contains:

```plain
.
├── CMakeLists.txt
└── main.cpp
```

```cpp
#include <iostream>
using namespace std;
int main () {
  cout << "Hello world" << endl;
  return 0;
}
```

The minimal `CMakeLists.txt` file contains:

```plain
cmake_minimum_required (VERSION 2.6)
project(Hello)
add_executable(${PROJECT_NAME} main.cpp)
```

Running `cmake .` creates a `Makefile` in the same directory whose recipes are cross-platform commands. CMake's documentation suggests that the build is separated from the source.

```sh
$ mkdir build
$ cd build
$ cmake ..
```

Running the default target in the makefile creates the executable `Hello`. Note that this is done in the `./build/` directory.

```sh
$ make
Scanning dependencies of target Hello
[ 50%] Building CXX object CMakeFiles/Hello.dir/main.cc.o
[100%] Linking CXX executable Hello
[100%] Built target Hello
$ ./Hello
Hello world
```

- [`set(<variable> <value>)`](https://cmake.org/cmake/help/latest/command/set.html) sets a normal variable available to the current function or directory scope. Variables can be accessed with `${variable}`.
- [`project(<PROJECT-NAME> [LANGUAGES] [<language-name>...])`](https://cmake.org/cmake/help/latest/command/project.html) sets the following variables:
  - `PROJECT_NAME`: same as `<PROJECT-NAME>`.
  - `PROJECT_SOURCE_DIR`: same as `/path/to/project/`.
  - `PROJECT_BINARY_DIR`: same as `/path/to/project/build/`.
- [`add_executable(<name> source1 [source2 ...])`](https://cmake.org/cmake/help/latest/command/add_executable.html) adds an executable target called `name` to be built from the source files listed.

Useful variables:

- `CMAKE_SOURCE_DIR`: path to the top level of the source tree (default value `./`).
- `CMAKE_BINARY_DIR`: path to the top level of the build tree (default value `./build/`).
- `CMAKE_RUNTIME_OUTPUT_DIRECTORY`: path to the executable (usually set to `${CMAKE_BINARY_DIR}/bin/`).
- `CMAKE_ARCHIVE_OUTPUT_DIRECTORY`: path to the static libraries (code from static libraries is included in the executable, usually set to `${CMAKE_BINARY_DIR}/lib/`).
- `CMAKE_LIBRARY_OUTPUT_DIRECTORY`: path to the shared libraries (additional code required by the executable, usually set to `${CMAKE_BINARY_DIR}/lib/`).

### Project structure and organization

```plain
. project
├── build
├── include
│   └── project
│       └── World.hpp
└── src
    ├── World.cpp
    └── main.cpp
```

The `CMakeLists.txt` file should do the following:

- Add the `./include` path to the compiler include search path.
- Create an executable file from `main.cpp` into `./build/bin/`.
- Create a static/dynamic library (in the example, `World.cpp`) into `./build/lib/`.
- Link the library with the executable.

```cmake
cmake_minimum_required(VERSION 3.0)

project(runner)

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/bin")
set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/lib")
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/lib")

# the -I flag in gcc
include_directories(
  ${PROJECT_SOURCE_DIR}/include/
)

set(APP_SOURCES src/main.cpp)
set(LIB_SOURCES src/World.cpp)

# creates ./build/bin/runner
add_executable(${PROJECT_NAME} ${APP_SOURCES})

# shared library
set(LIBRARY_NAME World)
add_library(${LIBRARY_NAME} SHARED ${LIB_SOURCES})
target_link_libraries(${PROJECT_NAME} ${LIBRARY_NAME})
```

- [`include_directories(dir)`](https://cmake.org/cmake/help/latest/command/include_directories.html): adds the given directories to those the compiler uses to search for include files (gcc `-I dir`).
- [`add_library(library_name [STATIC | SHARED | MODULE] source1 [source2...])`](https://cmake.org/cmake/help/latest/command/add_library.html): adds a library called `library_name` to be built from the source files listed.
    - `STATIC`: archives of object files `.a` (archive).
    - `SHARED`: libraries dynamically linked at runtime `.so` (shared object).
- [`target_link_libraries(target item)`](https://cmake.org/cmake/help/latest/command/target_link_libraries.html): specifies libraries/flags to use when linking a given target.

<div style="font-size: 25px; text-align:center">
<a href="https://github.com/maurizzzio/cmake-starter">cmake demo</a>
</div>

### Complex CMake configuration

A complex CMake configuration will have multiple `CMakeLists.txt` files per directory:

- `./CMakeLists.txt`: configures dependencies, platform specifics, and output paths.
- `./src/CMakeLists.txt`: configures the library to build.


