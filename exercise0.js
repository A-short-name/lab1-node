'use strict';

/**
 * Function that receives an array of strings and performs a loop.
 * Each string is substituted that string with first two and last 
 * two characters if its length is >= 2. 
 * If not true, the string is replaced with an empty string.
 * 
 * @param {*} stringarray 
 */
function preparation(stringarray) {
    stringarray = stringarray.forEach( (string,i) => {
        if(string.length<2)
            stringarray.splice(i,1,"");
        else {
            if(string.length>3)
                stringarray.splice(i,1,string.substr(0,2) + string.substr(string.length-2,2));
        }
    });
}

let vet = ["Questa", "è", "una", "prova"];
console.log(vet);
preparation(vet);
console.log(vet);