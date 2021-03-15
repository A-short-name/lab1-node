'use strict' ;

const dayjs = require('dayjs');
const sqlite3 = require('sqlite3');

/**
 * Open a connection to the database
 */
const db = new sqlite3.Database('tasks.db', (err)=>{
    if(err) throw err ;
});

/**
 * This function creates a Task Object as required
 * 
 * @param {A unique numerical id (required)} id 
 * @param {A textual description (required)} description 
 * @param {Whether is urgent (dafult: false)} isUrgent 
 * @param {Whether it is private (default: true)} isPrivate 
 * @param {A deadline (ie, a date with or without a time. This field is optional)} deadline 
 */
function Task(id, description, isUrgent, isPrivate, deadline){
    this.id = id;
    this.description = description;
    if(isUrgent===undefined)
        this.isUrgent = false;
    else
        this.isUrgent = isUrgent;
    
    if(isPrivate===undefined)
        this.isPrivate = true;
    else
        this.isPrivate = isPrivate;
    
    if(deadline===null)
        this.deadline = "<not defined>";
    else
        this.deadline = dayjs(deadline);

    this.toString = () => (`Id: ${this.id} Description: ${this.description}, Urgent: ${this.isUrgent}, Private: ${this.isPrivate}, Deadline: ${this.deadline}`);
}

/**
 * This function creates a Tasklist object, which is a collection (array) of tasks.
 */
function TaskList() {
    this.tasks = [];

    /**
     * This function loads all tasks from db
     */
    this.load = () => {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM tasks', (err,rows) => {
                if(err)
                    reject(err);
                else {
                    /** 
                     * For each row of the result of the query, creates an object "Task" with parameters, pushes to the vector and then print it.
                     */
                    rows.forEach((row) => {
                        let task = new Task(row.id, row.description, row.urgent, row.private, row.deadline);
                        this.tasks.push(task);
                        console.log(task.toString());
                    });
                    resolve(true);
                }
            });
        });
    };

    /**
     * Loads all the tasks from database and filter only those with a deadline after a given date.
     * @param {Date in the format of YYYY-MM-DD} date 
     * @returns 
     */
    this.loadPrintDate = (date) => {
        if(date===undefined)
            return new Error("No date selected");

        date = dayjs(date);
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM tasks', (err,rows) => {
                if(err)
                    reject(err);
                else {
                    rows.filter( (row) => (dayjs(row.deadline).isAfter(date)) ).forEach((row) => {
                        let task = new Task(row.id, row.description, row.urgent, row.private, row.deadline);
                        this.tasks.push(task);
                        console.log(task.toString());
                    });
                    resolve(true);
                }
            });
        });
    };

    /**
     * Loads all tasks from database and filter only those which contain a given word.
     * @param {A word to filter} word 
     * @returns 
     */
    this.loadPrintWord = (word) => {
        if(word===undefined)
            return new Error("No word selected");

        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM tasks', (err,rows) => {
                if(err)
                    reject(err);
                else {
                    rows.filter( (row) => row.description.includes(word) ).forEach((row) => {
                        let task = new Task(row.id, row.description, row.urgent, row.private, row.deadline);
                        this.tasks.push(task);
                        console.log(task.toString());
                    });
                    resolve(true);
                }
            });
        });
    };
};

let tasklist1 = new TaskList();
let tasklist2 = new TaskList();
let tasklist3 = new TaskList();

/**
 * Function that will execute all the queries in a synchronous way. It is not required and not necessary.
 */
async function main() {
    console.log("****** Load and print all tasks ******");
    await tasklist1.load();
    console.log("****** Load and print tasks with deadline after a given date ******");
    await tasklist2.loadPrintDate('2021-03-07');
    console.log("****** Load and print tasks that match a given word ******");
    await tasklist3.loadPrintWord('call');
}

main();