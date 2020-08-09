---
title: "Glossary"
description: "Glossary"
tags: ["machine learning"]
date: 2020-05-25 15:04:38
---

Check https://developers.google.com/machine-learning/glossary

### iterations, batch, batch size and epoch

- A batch is the set of examples used in one iteration, the number of examples in the set is the **batch size**. 
- For example, the batch size of SGD is 1, while the batch size of a mini-batch is usually between 10 and 1000.
Batch size is usually fixed during training and inference; however, TensorFlow does permit dynamic batch sizes.
- Each iteration is the span in which the system processes one **batch** of size **batch size**.
- An **epoch** spans spans sufficient iterations to process every example in the dataset i.e. an **epoch** represents $\frac{N}{batchSize}$ training iterations
where $N$ is the number of samples.

{{< figure src="https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F99A7774E5B7E1B302D" 
  title="Batch, batch size, epoch" class="bg" >}}
<style> .bg { filter: invert(1); } </style>

### k-fold cross validation

From https://www.analyticsvidhya.com/blog/2018/05/improve-model-performance-cross-validation-in-python-r/

1. Randomly split your entire dataset into k "folds"
2. For each k-fold in your dataset, build your model on k – 1 folds of the dataset. Then, test the model to check the effectiveness for kth fold
3. Record the error you see on each of the predictions
4. Repeat this until each of the k-folds has served as the test set
5. The average of your k recorded errors is called the cross-validation error and will serve as your performance metric for the model

### feature extraction

Merge several correlated features into one. Also see dimensionality reduction

### sampling noise/bias

Sampling noise: nonrepresentative sample data as result of chance (typically when the sample is too small)
Sampling bias: nonrepresentative sample data as result of a flaw in the sampling method