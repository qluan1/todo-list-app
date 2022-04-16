import { getAddTodoFormFor, getTodoDetail } from "./forms";
import { getDueIn } from "./dateTime";
import closeIcon from '../img/close-circle.svg';
import closeIconHover from '../img/close-circle-hover.svg';

export function showProjects(pjs) {
    const list = document.getElementById('projects-list');
    for (let i = 0; i < pjs.length; i++) {
        list.appendChild(getProjectDiv(pjs[i]));
    }
}

function getProjectDiv(proj) {
    let div = document.createElement('div');
    div.className = 'project';
    div.textContent = proj;
    return div;
}

export function appendTodoElement(td, app) {
    let addTask = document.querySelector('.todo-container:last-child');
    let container = document.getElementById('todos-list');
    container.insertBefore(getTodoDiv(td, app), addTask);
}


export function showTodosFor(tds, proj, app) {
    let container = document.getElementById('todos-list');
    while (container.firstElementChild) {
        container.removeChild(container.firstElementChild);
    }

    for (let i = 0; i < tds.length; i++) {
        container.appendChild(getTodoDiv(tds[i], app));
    }

    let add = document.createElement('div');
    document.getElementById('todos-list').appendChild(add);
    add.classList.add('todo-container');

    let addContainer = document.createElement('div');
    addContainer.classList.add('add-container');
    add.appendChild(addContainer);
    let addIcon = document.createElement('div');
    addContainer.appendChild(addIcon);
    addIcon.classList.add('add-icon');
    let addIconPlus = document.createElement('div');
    addIconPlus.textContent = '+';
    addIcon.appendChild(addIconPlus);

    let addText = document.createElement('div');
    addText.classList.add('add-text');
    addText.textContent = 'Add a task.';
    addContainer.appendChild(addIcon);
    addContainer.appendChild(addText);

    addContainer.addEventListener('click', ()=>{
        add.appendChild(getAddTodoFormFor(proj, app.addTodo, add, addContainer));
        add.removeChild(addContainer);
    });
}


function getTodoDiv(todo, app) {
    let div = document.createElement('div');
    div.className = 'todo-container';
    div.setAttribute('todoId', todo.id);
    
    let completeStatus = document.createElement('div');
    div.appendChild(completeStatus);
    completeStatus.classList.add('todo-complete');
    switch(todo.priority) {
        case 'no':
            completeStatus.classList.add('no-priority');
            break;
        case 'low':
            completeStatus.classList.add('low-priority');
            break;
        case 'high':
            completeStatus.classList.add('high-priority');
    }

    let tick = document.createElement('div');
    tick.innerHTML = '&check;';
    completeStatus.appendChild(tick);

    let name = document.createElement('div');
    div.appendChild(name);
    name.classList.add('todo-name');
    name.textContent = todo.name;
    name.addEventListener('click', () => {
        let de = getTodoDetail(todo, div, app);
        document.body.appendChild(de);
    })

    let dueIn = document.createElement('div');
    div.appendChild(dueIn);
    dueIn.classList.add('todo-dueIn');
    if (todo.complete) {
        dueIn.textContent = 'Task done!';
    } else {
        dueIn.textContent = getDueIn(todo.dueDate);
    }

    if (todo.complete) {
        tick.className = 'completed';
        name.classList.add('strike-through');
        dueIn.classList.add('strike-through');
    }

    completeStatus.addEventListener('click', () => {
        app.toggleCompleteTodo(todo.id);
        if (todo.complete) {
            todo.complete = false;
            tick.className = '';
            name.classList.remove('strike-through');
            dueIn.textContent = getDueIn(todo.dueDate);
            dueIn.classList.remove('strike-through');
            return;
        }
        todo.complete = true;
        tick.className = 'completed';
        name.classList.add('strike-through');
        dueIn.textContent = 'Task done!';
        dueIn.classList.add('strike-through');
    });

    let remove = new Image();
    remove.src = closeIcon;
    remove.addEventListener('mouseenter', ()=>{
        remove.src = closeIconHover;
    });
    remove.addEventListener('mouseout', ()=>{
        remove.src = closeIcon;
    });

    div.appendChild(remove);
    remove.classList.add('todo-remove');
    remove.addEventListener('click', ()=> {
        showRemoveConfirmation(todo, div, app.removeTodo);
    });

    return div;
}

export function replaceTodoDiv(todo, div, app) {
    let newDiv = getTodoDiv(todo, app);
    div.parentNode.replaceChild(newDiv, div);
    document.body.appendChild(getTodoDetail(todo, newDiv, app));
}

function showRemoveConfirmation(todo, div, removeTodo) {
    let container = document.createElement('div');
    document.body.append(container);
    document.body.classList.add('no-scroll');
    container.classList.add('popup-background');

    let confirmationPage = document.createElement('div');
    container.appendChild(confirmationPage);
    confirmationPage.classList.add('confirmation-page');

    let head = document.createElement('h3');
    confirmationPage.appendChild(head);
    head.innerHTML = `Remove <span>${todo.name}</span>?`;

    let buttonBox = document.createElement('div');
    confirmationPage.appendChild(buttonBox);
    
    let confirm = document.createElement('input');
    buttonBox.appendChild(confirm);
    confirm.setAttribute('type', 'button');
    confirm.setAttribute('value', 'confirm');
    confirm.addEventListener('click', () => {
        let a = removeTodo(todo.id);
        if (!a) {
            console.log('This item is not found.');
        }
        div.parentNode.removeChild(div);
        document.body.removeChild(container);
        document.body.classList.remove('no-scroll');
    });

    let cancel = document.createElement('input');
    buttonBox.appendChild(cancel);
    cancel.setAttribute('type', 'button');
    cancel.setAttribute('value', 'cancel');
    cancel.addEventListener('click', () => {
        document.body.removeChild(container);
        document.body.classList.remove('no-scroll');
    });
}