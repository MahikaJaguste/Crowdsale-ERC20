const {getUnix} = require('./getUnixTimestamp');
const  {getDateTime} = require('./getCurrentDateTime');

var d = new Date();
console.log(d)
const curr = getUnix(getDateTime(d));
console.log(curr);

d.setMinutes(d.getMinutes() + 10);
console.log(d);
const new_curr = getUnix(getDateTime(d));
console.log(new_curr);
