---
date: 2017-05-21T00:05:17-07:00
subtitle: ""
tags: []
title: Introduction
libs: [mermaid]
---

## Computational process

**Represents an abstract entity that runs some work inside a computer**, it may manage *data* according to a pattern of rules called a *program*.

<div class="mermaid" style="font-size: 25px">
graph LR;
  p[Program]-- directs -->cp[Computational Process];
  cp-- manipulates -->data[Data];
</div>

Additional definitions: https://www.quora.com/How-best-would-you-define-a-computational-process-and-why-is-it-as-Rob-Pikes-puts-it-difficult-to-define

## Elements of programming

Every program written in some programming language deals with the following entities:

- **data** - stuff that we want to manipulate
- **procedures** - description of the rules to manipulate data

A programming language serves as a framework used to organize ideas about processes, ideally a language should provide a way to *combine simple ideas to form more complex ideas*.

Every powerful language provides the following:

- **primitive expressions**, the simplest entities the language is concerned with
- **means of combination**, by which compound elements are built from simpler ones
- **means of abstraction**, by which compound elements can be named and manipulated as units

We can combine a primitive expression with a *primitive procedure* such as `*` or `+` to form a **compound expression**

We can give a name to a compound expression and treat it as a unit, this is then referred as a **compound procedure**, this procedure can be used in combination with other expressions in the form of an operator or a simple value.

