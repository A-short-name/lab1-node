'use strict' ;

const dayjs = require('dayjs');

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
    
    this.deadline = deadline;
}

function TaskList() {
    this.tasks = [];
    this.add = (task) => {this.tasks.push(task);};
    this.sortAndPrint = () => {
        let res = this.tasks.sort((task1,task2) => {
            if(task1.deadline===undefined && task2.deadline===undefined)
                return 0;
            if(task1.deadline===undefined)
                return 1;
            if(task2.deadline===undefined)
                return -1;

            //return task1.deadline.toString()-task2.deadline.toString();
            return task1.deadline.diff(task2.deadline,'unit');
        });
        console.log("****** Tasks sorted by deadline (most recent first): ******");
        res.forEach((task) => {
            let dl;
            if(task.deadline===undefined)
                dl = "<not defined>";
            else
                dl = task.deadline.format('MMMM DD, YYYY h:mm A').toString();
            console.log('Id: ' + task.id + ', Description: ' + task.description + ', Urgent: ' + task.isUrgent + ', Private: ' + task.isPrivate + ', Deadline: ' + dl);
        });
    };
    this.filterAndPrint = () => {
        let res = [];
        this.tasks.forEach((task) => {
            if(task.isUrgent===true)
                res.push(task);
        });
        console.log("****** Tasks filtered, only (urgent == true): ******");
        if(res.length>0){
            res.forEach((task) => {
                let dl;
                if(task.deadline===undefined)
                    dl = "<not defined>";
                else
                    dl = task.deadline.format('MMMM DD, YYYY h:mm A').toString();
                console.log('Id: ' + task.id + ', Description: ' + task.description + ', Urgent: ' + task.isUrgent + ', Private: ' + task.isPrivate + ', Deadline: ' + dl);
            })
        }
    }
}

let tasklist = new TaskList();

let task1 = new Task(1, "laundry");
tasklist.add(task1);
let task2 = new Task(2, "monday lab", false, false, dayjs('2021-03-16T10:00'));
tasklist.add(task2);
let task3 = new Task(3, "phone call", true, false, dayjs('2021-03-08T16:20'));
tasklist.add(task3);

//console.log(tasklist);
tasklist.sortAndPrint();
tasklist.filterAndPrint();