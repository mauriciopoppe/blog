---
title: "Glossary"
description: "Glossary"
tags: ["machine learning"]
date: 2020-05-25 15:04:38
---

Check https://developers.google.com/machine-learning/glossary

My understanding of some of these terms:

### iterations, batch, batch size and epoch

- Given a set of $N$ samples
- A batch is the set of examples used in one iteration, the number of examples in the set is the **batch size**. 
- For example, the batch size of SGD is 1, while the batch size of a mini-batch is usually between 10 and 1000.
Batch size is usually fixed during training and inference; however, TensorFlow does permit dynamic batch sizes.
- Each iteration is the span in which the system processes one **batch** of size **batch size**
- An **epoch** spans spans sufficient iterations to process every example in the dataset i.e. an **epoch** encompasses $\frac{N}{batchSize}$ iterations

{{< figure src="https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F99A7774E5B7E1B302D" 
  title="Batch, batch size, epoch" class="bg" >}}
<style> .bg { filter: invert(1); } </style>
