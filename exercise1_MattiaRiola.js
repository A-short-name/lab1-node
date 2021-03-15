'use strict';

const dayjs = require('dayjs');

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
            (task) => console.log(`${task.id} |${task.is_pvt}\t|${task.is_urgent}\t|${task.deadline.format('YYYY-MM-DD HH:mm:ss')}|${task.description}`)
            );
        console.log("---------------------------------------------------------------\n");
        
    }
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

//TODO: Exercise 2 - Database interaction

console.log("byebye");


