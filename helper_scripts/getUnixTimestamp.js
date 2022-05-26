const getUnix = (dateStr) => {

    // 👇️ Formatted as MM/DD/YYYY hh:mm:ss
    // const dateStr = '09/24/2022 09:25:32';

    const [dateComponents, timeComponents] = dateStr.split(' ');
    // console.log(dateComponents); // 👉️ "09/24/2022"
    // console.log(timeComponents); // 👉️ "09:25:32"

    const [month, day, year] = dateComponents.split('/');
    const [hours, minutes, seconds] = timeComponents.split(':');

    const date = new Date(+year, month - 1, +day, +hours, +minutes, +seconds);
    // console.log(date); // 👉️ Sat Sep 24 2022 09:25:32

    // ✅ Get Unix timestamp
    const unixTimestamp = Math.floor(date.getTime() / 1000);
    // console.log(unixTimestamp); // 👉️ 1664000732

    return unixTimestamp;
};

module.exports = { getUnix };
