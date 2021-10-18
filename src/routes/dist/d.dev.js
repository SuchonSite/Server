"use strict";

// let a = new Date()
// console.log(a)
// let b = "8-10-2001"
// dateParts = b.split('-')
// let dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]); 
// console.log(dateObject)
// let c = a - dateObject
// var diffDays = a.getDate() - dateObject.getDate(); 
// let cD, cM, cY = b.split('-')
// let aD, aM, aY = a.getDate(), a.getMonth(), a.getFullYear();
// console.log(diffDays)
function _calculateAge(date) {
  // birthday is a date
  var birthday = date.split();
  var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
  var ageDifMs = Date.now() - dateObject.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch

  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

var b = "8-10-2001";

var c = _calculateAge(b);

console.log(c);