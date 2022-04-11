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
}
