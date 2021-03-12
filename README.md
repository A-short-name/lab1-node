# WA1 2020/21 - LAB1

This Repository contains all the exercises from LAB1 of WA1 course of Politecnico di Torino. The exercises text is shown below, but the original PDF is left anyway in the repository.

## Exercise 0 - Preparation

First of all, check that your Node.js installation is working within Visual Studio Code. Create a function that, given an array of strings, for each string computes a new string made of the first two and the last two characters of the original string. The new string should replace the old one in the same array.

e.g., ‘_spring_’ yields ‘_spng_’

If the word is shorter than two characters, return the empty string.

## Exercise 1 - Functional Programming

Implement a program to manage a series of tasks (i.e., actions that the user wants to do in the future). In particular, a task is made of the following fields:
* a unique numerical _id_ (required);
* a textual _description_ (required);
* whether it is _urgent_ (default: false);
* whether it is _private_ (default: true);
* a _deadline_ (i.e., a date with or without a time. This field is optional).

By means of _constructor functions_, create some Task objects and add them to a TaskList object, i.e., an object that is able to store a list of tasks (as an array, internally). Then, implement the following methods:

* _sortAndPrint_: the method should sort the content of the TaskList by deadline, in ascending order (the tasks without a deadline should be listed at the end). After sorting, the method should print the content of the TaskList;
~~~vctreestatus
     ****** Tasks sorted by deadline (most recent first): ****** 
     Id: 3, Description: phone call, Urgent: true, Private: false, Deadline: March 8, 2021 4:20 PM
     Id: 2, Description: monday lab, Urgent: false, Private: false, Deadline: March 16, 2021 10:00 AM
     Id: 1, Description: laundry, Urgent: false, Private: true, Deadline: <not defined>
~~~
* _filterAndPrint_: starting from the entire list of tasks, the method should filter out the tasks that are not urgent. After filtering, the method should print the content of the filtered TaskList (without any particular order).
~~~vctreestatus
****** Tasks filtered, only (urgent == true): ****** 
Id: 3, Description: phone call, Urgent: true, Private: false, Deadline: March 8, 2021 4:20 PM
~~~

**Hints**  
_To implement the described functionality, you can manipulate the array of tasks by using the JavaScript functional programming paradigm._

## Exercise 2 - Functional Programming

Extend the program developed in Exercise 1 to use a database. Consider the database “tasks.db”, that contains a collection of tasks stored in the same format described in Exercise 1. The program should:
* load all the tasks included in the database into a TaskList and print them;
* load and print, through a parametric query, a TaskList containing only the list of tasks whose deadline is after a given date;
* load and print, through a parametric query, a TaskList containing only the list of tasks that contain a given word.

**Hints:** _The file “tasks.db” is included in the repository._  
It is possible to connect to an SQLite database with one of the following modules:
1. [sqlite3](https://www.npmjs.com/package/sqlite3) – _the basic library_
2. [sqlite](https://www.npmjs.com/package/sqlite) – _a Promise-based API to sqlite3_