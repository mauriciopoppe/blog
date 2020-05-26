---

title: "C++ refresher"
date: 2016-03-26 12:30:00
references:
  - "C++ project organisation (with gtest, c. (2016). C++ project organisation (with gtest, cmake and doxygen). [online] Stackoverflow.com. Available at: http://stackoverflow.com/a/13522826/3341726 [Accessed 5 Apr. 2016]."
  - "GCC, C. (2008). Compilation process in GCC ~ Codingfreak. [online] Codingfreak.blogspot.com. Available at: http://codingfreak.blogspot.com/2008/02/compilation-process-in-gcc.html [Accessed 5 Apr. 2016]."
---

## Mechanics of a C++ program

1. **Write source code**
  1.1 Unix extensions: `C,cc,cxx,c`
  1.2 GNU C++ extensions: `C,cc,cxx,cpp,c++`
2. **Compile the source code** - translate the code to machine code, the file containing the translation is the *object code* of the program
3. **Link the object code with additional code** - combination of the source code with *startup code* and *libraries object code* to produce a *runtime version*, the final product is a file called the *executable code* which contains a set of machine language instructions
4. **Execute the program**

Compilation and linking is done with

- *UNIX* - `CC`
- *GNU C++* - `gcc,g++` ([notes on the difference](http://stackoverflow.com/a/173007/3341726)), [gcc small description](/static/*nix/bin/gcc.html)

### Preprocessor

The [preprocessor]( https://gcc.gnu.org/onlinedocs/cpp/index.html#Top ) processes a source file before compilation, it allows to define macros which are abbreviations for longer constructs

#### Directives

Lines which begin with `#`

- `#define IDENTIFIER [value]` - replaces the occurrences of `IDENTIFIER` in the code with `value`, note that value is optional
- `#undef IDENTIFIER` - removes the definition of `IDENTIFIER`

Conditional directives allow to include or discard parts of the code if a certain condition is met

- `#ifdef IDENTIFIER` - if `IDENTIFIER` is defined then the code that follows is included until `#endif` is included
- `#ifndef IDENTIFIER` - if `IDENTIFIER` is not defined then the code that follows until `#endif` is included

Conditional directives are used for example to include headers only once

```cpp
#ifndef FOO_BAR_BAZ_H_
#define FOO_BAR_BAZ_H_
  // header code
#endif // FOO_BAR_BAZ_H_
```

File inclusion

- `#include <library>` - the contents of the `librfry` file are sent along the source code, in essence the contents of the `library` **replace** the `#include` line, note that the compiler tries to find `library` in the host system's file system that holds the standard header files
- `#include "library"` - same as above but `library` is looked in the current working directory
- [`#pragma`](https://gcc.gnu.org/onlinedocs/cpp/Pragmas.html) - specify diverse options to the compiler specific of the platform/compiler

### Program structure

Large programs can be split in multiple files which can be compiled (if needed) and linked to generate an executable program, for example a program can be split into three files

- a *header file* that contains structure declarations and prototypes for functions that use those structures
- a *source code* file that contains the code for the functions
- a *source code* that uses those functions

The following things are commonly found in headers

- function prototypes
- symbolic constants defined with `#define` or `const`
- structure, class, template declarations
- inline functions

```plain
trunk
├── bin     : for all executables (applications)
├── lib     : for all other binaries (static and shared libraries (.so or .dll))
├── include : for all project header files, 3rd party files not present in `/usr/local/include` should be here
├── src     : for source files
├── doc     : for documentation
├── build   : for all the object files, removed by `clean`
└── test    : for testing
```

Example

```plain
. project
├── build
├── include
│   └── project
│       └── Vector.hpp
│   └── [third party library]
└── src
    ├── Vector.cpp
    └── main.cpp
```

---

## Strings

### C-style strings

The last character is the *null character* `\0`

```cpp
char name[20];              // initialized with random data
char name[5] = {'j', 'h', 'o', 'n', '\0'};
char name[8] = {'j', 'h', 'o', 'n', '\0'};    // right padded with \0
char name[5] = "john";      // the \0 is understood
char name[8] = "john";      // right padded with \0
char name[] = "john";       // let the compiler count
```

Operations

```cpp
#include <cstring>
char source[] = "john";       // let the compiler count
char dest[10];

// size of the string
strlen(source);   // 4
strlen(dest);     // 10, 10 random characters, the 11th is \0

// copy `source` to `dest`
strcpy(dest, source);

// concat `dest` with `source`
strcat(dest, source);
```

Reading input

```cpp
char name[20];
cin >> name;            // read until space or newline
cin.getline(name, 20);  // read 20 characters or until newline
cin.get(name, 20);      // read 20 characters or until before newline
```

### C++ strings

```cpp
#include <string>

string str;           // ""
string name = "john";

cin >> name;          // reads until space or newline
cin.getline(name);   // reads until newline
```

---

## Pointers

Given a variable the address operator `&` is used to get its address or location in memory

```cpp
int oranges = 5;
int apples = 6;

// location in memory e.g. 0x0065fd40
&oranges;

// location in memory e.g. 0x0065fd44
&apples;

// NOTE: the difference between them is 4 bytes, the size of int
```

Pointers are variables that store addresses of values rather than the values themselves, to declare a pointer we use the form `typeName * pointerName`

```cpp
int oranges = 5;
int* p_oranges;        // declare pointer to an int
p_oranges = &oranges;  // assign address to pointer
sizeof(p_oranges);     // 4 bytes
```

The dereferencing operator `*` yields the value at the location.

```cpp
int oranges = 5;
int* p_oranges = &oranges;
*p_oranges;                   // 5
*p_oranges = *p_oranges + 1;  // update the value
oranges;                      // 6
*p_oranges;                   // 6
```

Always initialize a pointer to a definite address before applying the dereferencing operator.

```cpp
int* p_int;
*p_int = 3;     // value is lost forever
```

When a pointer is assigned to another pointer the value stored is the address stored in the first pointer.

```cpp
int oranges = 5;        // value: 5,     address: 0x000
int* p = &oranges;      // value: 0x000, address: 0x004
int* q = p;             // value: 0x000, address: 0x008
*q;                     // 5
```

If we want to create a pointer to a pointer we use extra '*', for the declaration the number of '*' must be equal to the length of pointers (including this one), in the same fashion we must use the same number of '*' for dereferencing.

```cpp
int oranges = 5;        // value: 5,     address: 0x000
int* p = &oranges;      // value: 0x000, address: 0x004
int** q = &p;           // value: 0x004, address: 0x008
*p;                     // 5
**q;                    // 5
```

### Pointer and arrays

C++ handles arrays internally using pointers which may seem equivalent, an ordinary array variable name is interpreted as the **address of the first element of the array**, the bracket notation `[]` allows us to get/set elements of the array.

```cpp
int numbers[] = {1, 2, 3};
numbers;      // address 0x0065fd40
numbers[0];   // 1, the value allocated in memory
// NOTE: numbers ~ &numbers[0]

// since a pointer is a reference to an address we can also do
int* p_numbers = numbers;
*p_numbers;   // 1, the value in memory accessed through pointer dereferencing
```

Adding one to a pointer variable increases its value by the number of bytes of the type to which it points

```cpp
int numbers[] = {1, 2, 3};
int* p_numbers = numbers;
p_numbers;      // points to the first element of the array
p_numbers + 1;  // points to the second element of the array
p_numbers + 2;  // points to the third element of the array

// NOTE:
//  numbers[0] == *(p_numbers)
//  numbers[1] == *(p_numbers + 1)
//  numbers[2] == *(p_numbers + 2)
```

The value `&numbers` is the address of a 3-int block of memory, so even though `&numbers[0] == numbers == &numbers` numerically the value of `&numbers + 1 != numbers + 1` because `&numbers + 1` points to the next 3-int block of memory however `numbers + 1` points to the second element of the initial 3-int block of memory

- `numbers` is type pointer-to-int or `int*`
- `&numbers` is type pointer-to-array-of-3-int or `(*int)[3]`

The relationship of pointers and arrays also extend to C-style strings, and it's for C++ a quoted string constant, strings in an array and strings described by pointers are all handled equivalently

```cpp
char first[20] = "john";
const char* last = "smith";    // string literals are constant
cout << "I am the agent" << first << " " << last
```

Given a multidimensional array `int a[][2] = { { 1, 2 } }`, `a` is a pointer to the first element which is a 2 element array (which is a pointer to the first of its elements), therefore a pointer to `a` has form of a pointer-to-array-of-2-int

```cpp
int a[][2] = { { 1, 2 } };
int (*b)[2] = a;
(*b)[0];       // 1
```

### Array of pointers

```cpp
int a = 1, b = 2;
int* p[2] = {&a, &b};
```

Since `p` is a pointer to the first element which is `&a` and `&a` is another pointer then we can reference `p` with a pointer to pointer

```cpp
int** q = p;
```

### Runtime allocation: new

Pointers are sort of an alias for memory accessed which could be accessed by named variables (memory allocated in compile time), however we can allocate memory in runtime with the operator `new`, runtime allocated memory can be freed with the operator `delete`

Advantages of runtime allocated memory:

- Memory is allocated only when needed

Drawbacks of runtime allocated memory:

- Memory allocated by `new` must be freed using the operator `delete` otherwise we have a *memory leak* which is memory allocated but unused, if it grows too large it can halt the execution of the program
- An attempt of freeing a block of memory previously freed results in an undefined behavior i.e. don't use `delete` twice on the same block of memory in succession

Additional notes regarding runtime allocated memory

- Ordinary variable have their values stored in a memory region called the **stack**, memory allocated with `new` have their values stored in a memory region called the **heap**

```cpp
// p_int address = 0x0065fd40
int* p_int = new int;
delete p_int;

int oranges = 5;
int* p_oranges = &oranges;
// INVALID since delete works only with memory allocated with new
delete p_oranges;
```

Dynamic arrays can be created with `new typeName[count]`, a pointer can be assigned to the location of the **first** element of the dynamic array

```cpp
// dynamic array
int* p_array = new int[10];

// p_array points to the first element of the array
// *p_array is the value of the first element using pointer dereferencing
// p_array[0] is also the value of the first element using array notation

delete [] p_array;
```

Dynamic structures can be created with `new structName`, when a pointer pointer to this block of memory we can access the properties with the arrow membership operator `->`

```cpp
struct person {
  string name;
  int age;
};
person* p_person = new person;
p_person->name = "john smith";
p_person->age = 25;
```

---

## Functions

Steps to build a function

- Provide a function prototype
- Provide a function definition
- Call the function

```cpp
// function prototype
double cube(double x);

int main() {
  // function call
  double q = cube(2.2);
}

// function definition
double cube(double x) {
  return x * x * x;
}
```

Writing prototypes have the following advantages:

- the compiler correctly handles the function return value
- the compiler checks the use of the correct number of arguments
- the compiler checks the use of the correct type of arguments (performing conversion to the correct type if possible)

When a function is called with basic types for arguments the function creates a new variable and initializes it with the same value, i.e. the function works with a copy with basic types

```cpp
int main() {
  double x = 1.3;
  cube(x);
  // ..
}

double cube(double x) {
  // x is passed by value
  // x is private to this function
  return x * x * x;
}
```

However we can pass instead the address of the basic type which means that the function should be rewritten to use pointers

```cpp
int main() {
  double x = 1.3;
  cube(&x);
  // ..
}

double cube(double* x) {
  // x is passed by value
  // x is private to this function
  return (*x) * (*x) * (*x);
}
```

This is useful for complex structures if we want to save time/space by passing a reference to the structure instead of passing the entire structure

```cpp
struct person {
  string name;
  int age;
};

int main() {
  person john = { "john doe", 25 };
  greet(&john);
  // ..
}

double cube(person* someone) {
  // someone is private to this function
  // someone is a pointer to the original person
  someone->age;       // 25
}
```

When a function is called with an array what's sent actually is the name of the array which is the address of the first element/a pointer-to-int (`int *`), this is different from basic types because the array is not copied, instead the function works with the original array

```cpp
const int k_size = 3;

int main() {
  int a[k_size] = {1, 2, 3}
  sum(a, k_size);         // 6
  cout << *a << endl;     // 1
}

double sum(int* a, int k_size) {
  // a is another pointer to the original array
  // a is private to this function
  int sum = 0;
  for (int i = 0; i < k_size; ++i) {
    sum += *a;
    a++;
  }
  return sum;
}
```

### Inline functions

When a program is executed and a function is about to be invoked the following steps occur with the program

- store the memory address of the next instruction
- copy function arguments to the stack
- jump to the memory address the function is located
- execute the function code
- jump back to the instruction stored

A little enhancement to speed up the program is to make the function *inline*, that is the program replaces the function call with the function code avoiding the jumps

When to use it:

- the function is small and called very often

```cpp
inline double cube(double x) { return x * x * x; }
```

### Reference variables

A reference variable is a name that acts as an alias on a previously defined variable

```cpp
int p;
int& q = p;
```

In this context `&` is not the address operator, instead it serves as part of the type identifier, like `int*` is a pointer-to-int `int&` is a reference-to-int

- a reference must be initialized to a defined variable when declared
- a reference is like a const pointer e.g. `int& r_n = n;` is like `int* const r_n = &n;`

```cpp
int n = 5;
int* p_n = &n;
int& r_n = n;

// the following expressions can be used interchangeably
// - *p_n, r_n, n  to get the value
// - p_n, &r_n, &n to get the address
```

Example with a function

```cpp
int main() {
  int x = 2;
  pow2(x); // 4
  x;       // 2
}

int pow2(int& x) {
  // x is an alias to the x in main
  return x * x;
}
```

Note any change to `x` in `pow2()` will actually change the original value, to avoid this behavior use `const` e.g. `int pow2(const int &x)`

Reference arguments should be used to

- allow the modification of data inside a function
- speed the program by passing a reference instead of an entire data object

---

## Classes

```cpp
class Person {
  // var, functions declared here are private by default
private:
  // private vars and function prototypes
public:
  // public vars and function prototypes
  void sayHi();
};
```

### Class member functions

- class member functions can access the private components of the class
- to identify to which class a function definition belongs to the operator `::` is used

```cpp
void Person::sayHi() { /* ... */ }
```

- if a class member function won't modify the instance created then use the `const` qualifier for the function

```cpp
// function prototype
class Person {
  // ..
  void show() const;
}

// function definition
void Person::show() const { /* ... */ }
```

All class methods have a `this` pointer set to the address of the object that invokes this method, class members can be accessed through pointer dereferencing

### Class constructor/destructor

- a class has the *default constructor* by default, it has the form `Person() {}`
- custom constructors/destructor can be defined as follows

```cpp
class Person {
  string name;
  int age;
public:
  // implicit default constructor:
  //    Person() {}
  Person();                         // default constructor
  Person(string &name);             // operator overload
  Person(string &name, int &age);   // operator overload
  ~Person();                        // default destructor
}

// constructor definition
Person::Person() {
  // explicit default constructor
  // NOTE: constructor/destructor returns the class object (no need to add return)
}
Person::Person(string& name) { /* ... */ }
Person::Person(string& name, int& age) { /* ... */ }
Person::~Person() { /* ... */ }
```

### Class objects

```cpp
int main() {
  Person a;                               // default constructor
  Person b = Person("john", 25);          // with parameters
  World c("john", 25);                    // alternative syntax
  World* p_d = new Person("john", 25);    // pointer-to-Person

  b.show();
  p_d->show();
}
```

### Operator overloading

```cpp
class Time {
public:
  Time operator+(const Time& other) const;
}
// ..
Time Time::operator+(const Time& other) const {
  Tim total;
  // code for `total = other + *this`
  return total;
}
// ..
int main() {
  Time a, b;
  Time c = a + b;
  // translated to a.operator+(b)
}
```

---

## Misc

### Deciphering variable types

http://andybohn.com/deciphering-variable-types/

1. Find the identifier and start there
2. Sweep to the right, translating the symbols you see. You should stop your sweep to the right when you get to the end of the type, or if you see a lone right parenthesis ). (Seeing a left parenthesis ( is the start of a function symbol, so continue sweeping right.)
3. Sweep left of the identifier until you run out of symbols, or you hit a left parenthesis (. If you hit the left parenthesis now, you should go back to part 2, sweeping right, but now on the outside of the enclosing ), and continuing onto part 3 on the outside of the enclosing (.

### Reading examples

Read a number and the next line as a string

```cpp
// input:
//   1234\n
//   a line of text
int year;
string name;
(cin >> year).get();
getline(cin, name);
```

Read until a char is found (note that `cin >> ch` omits spaces)

```cpp
char ch;
cin.get(ch);            // or ch = cin.get();
while (ch != '#') {
  // do something with ch
  cin.get(ch);
}
```

Read until EOF

```cpp
int a, b;
// cin is an istream object that is casted to bool in this case
while (cin >> a >> b) { ... }

string str;
// same as before cin is casted to bool
while (getline(cin, str)) { ... }

char ch;
cin.get(ch);
// same as before cin is casted to bool
while (cin) { cin.get(ch); }

char ch;
while ((ch = cin.get()) != EOF) { ... }
```

Tokenize

```cpp
// example: split the following line by commas
// 1,2,hello
stringstream tokens(line);
string token;
string id, rank, description;

getline(tokens, id, ',')
getline(tokens, rank, ',')
getline(tokens, description)
```

Read/write files

```cpp
#include <fstream>

ifstream inFile;
inFile.open("input");
ofstream outFile;
outFile.open("output");

string line;
int n;

// reading input from file
getline(inFile, line);
inFile >> n;

// writing output to file
outFile << line;
outFile << n;

// close the stream
inFile.close();
outFile.close();
```

Read from file reusing the stdin stream, write to file reusing the stdout stream, see [`freopen`](http://www.cplusplus.com/reference/cstdio/freopen/)

```cpp
#include <cstdio>
freopen("input", "r", stdin);
freopen("output", "w", stdout);
// use cin here
// close the streams
fclose(stdin);
fclose(stdout);
```

### Type casts

```cpp
(long) value
long(value)
static_cast<long> (value)

// pointer cast
int* p_number = (int*) 0xB8000000;
```

### Conversion between types

### C++11

Declarations

- `auto` automatic type deduction
- `decltype` creates a variable of the type indicated by an expression

Range-based `for` loop

```cpp
int numbers[] = {1, 2, 3, 4, 5};
for (int n : numbers) { ... }
for (int n : {1, 2, 3, 4}) { ... }
for (auto n : {1, 2, 3, 4}) { ... }
```

