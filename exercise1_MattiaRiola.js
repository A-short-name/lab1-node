'use strict';

const dayjs = require('dayjs');
const sqlite = require('sqlite3');
/**
 * 
 * @param {*} id univoc index
 * @param {*} description 
 * @param {*} deadline is optional
 * @param {*} is_urgent default is false
 * @param {*} is_pvt default is true
 */
function Task(id, description,  deadline, is_urgent=false, is_pvt=true,){
    this.id = id;
    this.description = description;
    this.is_urgent = is_urgent;
    this.is_pvt = is_pvt;
    this.deadline = deadline;
}

function TaskList(){
    this.tasks = [];
    /**
     * pushing parameters 
     * @param {*} task the tasks to push
     */
    this.add = (task) => {this.tasks.push(task);};
    /**
     * it sorts the tasks list in place
     * and print it using the prettyPrint function
     * @returns a copy of the sorted taskList
     */
    this.sortAndPrint = () => {
        const result = this.tasks.sort((task1,task2) => {
            if(task2.deadline == undefined && task1.deadline == undefined)
                return 0;
            if(task2.deadline == undefined)
                return 1;
            if(task1.deadline == undefined)
                return -1;
                return task1.deadline.diff(task2.deadline,'unit');
            } );
            
        this.prettyPrint(result);
        return result;
    };
    /**
     * this function filters the tasks that are not urgent
     * The filter is not in place so the tasks array wont be changed
     * @returns 
     */
    this.filterAndPrint = () => {
        const result = this.tasks.filter((task) => task.is_urgent);
        this.prettyPrint(result);
        return result;
    };
    /**
     * print a label with all the info about tasks
     * @param {*} tasks this must be an array of tasks 
     */
    this.prettyPrint = (tasks) => {
        console.log("id |pvt\t|urgent\t|deadline\t\t|desc");
        console.log("---------------------------------------------------------------");
        tasks.forEach(
            (task) => console.log(`${task.id} |${task.is_pvt}\t|${task.is_urgent}\t|${(task.deadline == undefined) ? '<not Defined>\t\t' : task.deadline.format('YYYY-MM-DD HH:mm:ss\t')}|${task.description}`)
            );
            console.log("---------------------------------------------------------------\n");
            
    };
    /**
     * function used to load the query result into the tasks array of this object
     * example: db.all(query,myTasks.loadingFromDb);
     * @param {*} err 
     * @param {*} rows 
     */
    this.loadingFromDb = (err,rows) => {
        if(err)
            console.log(err);
        else{
            for(let row of rows){
    
    
                const task_tmp = new Task(
                    row.id,row.description,
                    (row.deadline == undefined) ? undefined : dayjs(row.deadline),
                    (row.urgent) ? false : true ,
                    (row.private) ? false : true,
                    //BUG: it doesn't parse 0/1 into false/true value
                    );
                this.add(task_tmp);
            }
        }
    };
}


const myTasks1 = new TaskList();
const task1 = new Task(1,'bho1',dayjs('2000-01-01T00:01'),true,true);
const task2 = new Task(2,'bho2',dayjs('2021-03-20T04:20'));
const task3 = new Task(3,'bho3',dayjs('1945-11-24T23:59'));
const task4 = new Task(4,'bho4',dayjs('2030-12-24T23:59'));
myTasks1.add(task1);
myTasks1.add(task2);
myTasks1.add(task3);
myTasks1.add(task4);
console.log("--- Starting point ---");
console.log("myTasks1:")

console.log("#### Testing sort ####");
myTasks1.prettyPrint(myTasks1.tasks);
console.log(" - sorting and printing myTask1:")
myTasks1.sortAndPrint();
// console.log("myTasks1"); // My tasks are sorted in place
// myTasks1.prettyPrint(myTasks1.tasks);

console.log("#### Testing filter ####");
myTasks1.filterAndPrint(); // it returns a new array of filtered tasks
myTasks1.prettyPrint(myTasks1.tasks);



console.log("#### Database interaction SQLite3 ####");



const myTasks2 = new TaskList();
const myFutureTasks = new TaskList();
const myTasksAfterDate1 = new TaskList();
const myTasksAfterDate2 = new TaskList();
const myTasksWithWord = new TaskList();

const date1 = '2021-03-05';
const date2 = '2021-03-10';
const word = 'lab';

const query1_allTasks = "SELECT * FROM tasks";
const query2_futureDeadline = "SELECT * FROM tasks WHERE date('now') < date(deadline) OR date(deadline) IS NULL;"
const query3_tasksAfterDate1 = `SELECT * FROM tasks WHERE date('${date1}') < date(deadline) OR date(deadline) IS NULL;`;
const query4_tasksAfterDate2 = `SELECT * FROM tasks WHERE date('${date2}') < date(deadline) OR date(deadline) IS NULL;`;
const query5_tasksWithWord = `SELECT * FROM tasks WHERE description like '%${word}%';`;

const db = new sqlite.Database('tasks.db',(err) => {
    if(err)
     throw err;
});



db.all(query1_allTasks,myTasks2.loadingFromDb);
db.all(query2_futureDeadline,myFutureTasks.loadingFromDb);
db.all(query3_tasksAfterDate1,myTasksAfterDate1.loadingFromDb);
db.all(query4_tasksAfterDate2,myTasksAfterDate2.loadingFromDb);
db.all(query5_tasksWithWord,myTasksWithWord.loadingFromDb);

setTimeout(() => {console.log("my all tasks:"); myTasks2.prettyPrint(myTasks2.tasks)},500);
setTimeout(() => {console.log("my future tasks:"); myFutureTasks.prettyPrint(myFutureTasks.tasks)},500);
setTimeout(() => {console.log(`my tasks after ${date1} :`); myTasksAfterDate1.prettyPrint(myTasksAfterDate1.tasks)},500);
setTimeout(() => {console.log(`my tasks after ${date2} :`); myTasksAfterDate2.prettyPrint(myTasksAfterDate2.tasks)},500);
setTimeout(() => {console.log(`my tasks with word ${word} :`); myTasksWithWord.prettyPrint(myTasksWithWord.tasks)},500);

//UPDATE: Improve the log of the results with promises




console.log("byebye");

debugger;

