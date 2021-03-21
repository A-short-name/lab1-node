'use strict' ;

const dayjs = require('dayjs');
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
}

const tasks = new TaskList();
const firstTask = new Task(3, "phone call", true, false, dayjs('2021-03-08T16:20'));
const secondTask = new Task(2, "monday lab", false, false, dayjs('2021-03-16T10:00'));
const thirdTask = new Task(1, "laundry", false, true); //deadline non specificata

tasks.add(firstTask);
tasks.add(secondTask);
tasks.add(thirdTask);

tasks.sortAndPrint();
tasks.filterAndPrint();
