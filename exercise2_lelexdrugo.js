'use strict';
//è come se da db leggesse i booleani 0 e 1 come undefined e di conseguenza usa i valori di default per isUrgent e isPrivate

const sqlite = require('sqlite3');
const db = new sqlite.Database('tasks.db',
        (err) => {if (err) throw err; });

const dayjs = require('dayjs');

/** 
 * Time zone extension to print as the database mention and not in local rome tz
*/
var utc = require('dayjs/plugin/utc') // dependent on utc plugin
var timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)

/**
 * 
 * @param {*} id An id. Required
 * @param {*} description A description. Required
 * @param {*} isUrgent Information about urgenty. False by default
 * @param {*} isPrivate Information about privacy. True by default
 * @param {*} deadline Optional, but I assumed it's present only if isUrgent and isPrivate are explicit assigned.
 */
function Task(id, description, isUrgent = false, isPrivate = true, deadline) {
    this.id = id ;
    this.description = description ;
    this.isUrgent = isUrgent ;
    this.isPrivate = isPrivate ;
    this.deadline = deadline ;

    this.toString = () => {
        let deadline;
        if (this.deadline === undefined  || this.deadline === null)
            deadline = "<not defined>";     //I have to check if user has inserted valid value
        else deadline = dayjs(this.deadline).utc().format('MMMM D, YYYY HH:mm A').toString();
        //else deadline = dayjs(this.deadline).utc().format('YYYY-MM-DDTHH:mm:ssZ[Z]').toString();
        console.log("Id: " + this.id + ", Description: " + this.description + ", Urgent: " + this.isUrgent + ", Private: "+ this.isPrivate + ", Deadline: " + deadline) ;
    };
}   //gestire il caso di presenza di deadline ma non di urgent or private

function TaskList() {
    this.tasks = [] ;
    /**
     * to add a new task to the array of tasks
     * @param {*} newTask 
     */
    this.add = (newTask) => {
        this.tasks.push(newTask);
    };
    /**
     * no parameter because modify on the fly the array and print to screen
     */
    this.sortAndPrint = () => {
        //array sort want a compare function that have to return >0,<0, or 0
        this.tasks.sort( (taskA, taskB) => {
            if(taskA.deadline===undefined && taskB.deadline===undefined)
                return 0;
            if(taskA.deadline===undefined)
                return 1;
            if(taskB.deadline===undefined)
                return -1;
            taskA.deadline.diff(taskB.deadline);        //dayjs method: compute the difference between two date object
        });
        console.log("****** Tasks sorted by deadline (most recent first): ******") ;
        
        this.tasks.forEach( (eachTask) => {
            let deadline;
            if (eachTask.deadline === undefined)
                deadline = "<not defined>";     //I have to check if user has inserted valid value
            else deadline =dayjs(eachTask.deadline).format('MMMM D, YYYY h:mm A').toString();
            console.log("Id: " + eachTask.id + ", Description: " + eachTask.description + ", Urgent: " + eachTask.isUrgent + ", Private: "+ eachTask.isPrivate + ", Deadline: " + deadline) ;
        }) ; 
    };
    /**
     * compute a new array res with filtered elements of tasks and print it
     */
    this.filterAndPrint = () => {
        let res = this.tasks.filter( (selectedTask) => selectedTask.isUrgent === true);

        console.log("****** Tasks filtered, only (urgent == true): ******");

        res.forEach( (eachTask) => {
            let deadline;
            if (eachTask.deadline === undefined)
                deadline = "<not defined>";     //I have to check if user has inserted valid value
            else deadline =dayjs(eachTask.deadline).format('MMMM D, YYYY h:mm A').toString();
            console.log("Id: " + eachTask.id + ", Description: " + eachTask.description + ", Urgent: " + eachTask.isUrgent + ", Private: "+ eachTask.isPrivate + ", Deadline: " + deadline) ;
        });
    };
    /**
     * print the task in the desidered format
     */
    this.print = () => {
        this.tasks.forEach( (eachTask) => {
            eachTask.toString();
        })
    };

    /**
     * load tasks from the db and put it in tasks
     */
    this.load = () => {
        return new Promise( (resolve, reject) => {
            let sql = "SELECT * FROM tasks;" ;
            db.all(sql, (err,rows)=>{
                if(err) reject(err) ;
                else{
                for (let row of rows) {
                    //row is an object with the structure of the TASK described in exercise1
                    this.tasks.push(new Task(row.id, row.description, row.isUrgent, row.isPrivate, row.deadline));
                    //console.loh(row);
                }
                //this.print();
                resolve(true);
                }
            });
        });
    }
    /**
     * load tasks with parametric query and print
     */
    this.loadPrintDeadline = (date) => {
        return new Promise( (resolve, reject) => {
            let sql = "SELECT * FROM tasks WHERE date(deadline) IS NULL OR date(deadline)>datetime(?);" ;
            db.all(sql, [date], (err,rows)=>{
                if(err) reject(err) ;
                else{
                console.log("****** Print task with deadline after: " + date + " ******");
                for (let row of rows) {
                    //row is an object with the structure of the TASK described in exercise1
                    let task = new Task(row.id, row.description, row.isUrgent, row.isPrivate, row.deadline);
                    task.toString();
                }
                resolve(true);
                }
            });
        });
    }

    this.loadPrintWord = (word) => {
        return new Promise( (resolve, reject) => {
            let sql = "SELECT * FROM tasks WHERE description LIKE ?;";
            db.all(sql,['%'+word+'%'], (err,rows)=>{
                if(err) reject(err) ;
                else{
                console.log("****** Print task containing word: " + word + " ******");
                for (let row of rows) {
                    //row is an object with the structure of the TASK described in exercise1
                    let task = new Task(row.id, row.description, row.isUrgent, row.isPrivate, row.deadline);
                    task.toString();
                }
                resolve(true);
                }
            });
        });
    }
}

const tasks = new TaskList();


/**
 * print list of tasks
 */
async function main() {
console.log("****** Print all the task in the database: ******"),
await tasks.load();
tasks.print();
await tasks.loadPrintDeadline("2021-03-09");
await tasks.loadPrintWord("mon");

db.close();
}
main();
debugger