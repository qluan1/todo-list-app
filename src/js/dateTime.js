export function getDueIn(due) {
    if (!due) {
        return 'No Due Date.';
    }
    let dateTime = due.split('T');
    let [year, month, day] = dateTime[0].split('-');
    let [hour, minute] = dateTime[1].split(':');

    let dueDate = new Date();
    dueDate.setFullYear(year);
    dueDate.setMonth(month-1);
    dueDate.setDate(day);
    dueDate.setHours(hour);
    dueDate.setMinutes(minute);

    let now = new Date();
    
    let MinDiff = (dueDate.getTime() - now.getTime())/1000/60;
    if (MinDiff < 0) {
        return 'Passed Due!';
    }
    if (MinDiff < 60) {
        return `Due in ${Math.floor(MinDiff)}+ minutes.`;
    } 
    if (MinDiff < 60 * 24) {
        return `Due in ${Math.floor(MinDiff/60)}+ hours.`;
    }
    return `Due in ${Math.floor(MinDiff/60/24)}+ days.`;
};

export function endOfToday() {
    let today = new Date();
    let year = today.getFullYear();
    let month = (today.getMonth() + 1).toString();
    if (month.length < 2) {
        month = '0' + month;
    }
    let day = today.getDate();
    if (day.length < 2) {
        day = '0' + day;
    }
    return year + '-' + month + '-' + day + 'T23:59';
};


export function shortDateTimeLocal(due) {
    if (!due) {
        return 'No Due Date.';
    }
    let dateTime = due.split('T');
    let [year, month, day] = dateTime[0].split('-');
    let [hour, minute] = dateTime[1].split(':');
    let apm = 'AM';
    if (parseInt(hour) > 12) {
        hour = (parseInt(hour)-12).toString();
        if (hour.length == 1) {
            hour = '0' + hour;
        }
        apm = 'PM';
    }
    // let mon = [
    //     'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    // ];

    return month + '/' + day + '/' + year + ' ' + hour + ':' + minute + ' ' + apm;
}