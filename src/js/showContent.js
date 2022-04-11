import { getAddTodoFormFor } from "./forms";
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

export function appendTodoElement(td, editTodo, removeTodo, getTodoById, toggleCompleteTodo) {
    let addTask = document.querySelector('.todo-container:last-child');
    let container = document.getElementById('todos-list');
    container.insertBefore(getTodoDiv(td, editTodo, removeTodo, getTodoById, toggleCompleteTodo), addTask);
}

export function showTodosFor(tds, proj, addTodo, editTodo, removeTodo, getTodoById, toggleCompleteTodo) {
    let container = document.getElementById('todos-list');
    while (container.firstElementChild) {
        container.removeChild(container.firstElementChild);
    }

    for (let i = 0; i < tds.length; i++) {
        container.appendChild(getTodoDiv(tds[i], editTodo, removeTodo, getTodoById, toggleCompleteTodo));
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
        add.appendChild(getAddTodoFormFor(proj, addTodo, add, addContainer));
        add.removeChild(addContainer);
    });
}


function getTodoDiv(todo, editTodo, removeTodo, getTodoById, toggleCompleteTodo) {
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
    if (todo.complete) {
        tick.className = 'completed';
        name.classList.add('strike-through');
        dueIn.classList.add('strike-through');
    }

    completeStatus.addEventListener('click', () => {
        toggleCompleteTodo(todo.id);
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



    let name = document.createElement('div');
    div.appendChild(name);
    name.classList.add('todo-name');
    name.textContent = todo.name;

    let dueIn = document.createElement('div');
    div.appendChild(dueIn);
    dueIn.classList.add('todo-dueIn');
    if (todo.complete) {
        dueIn.textContent = 'Task done!';
    } else {
        dueIn.textContent = getDueIn(todo.dueDate);
    }
    



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
        showRemoveConfirmation(todo, div, removeTodo);
    });

    return div;
}

function showEdit(todo, div, editTodo, removeTodo, getTodoById) {
    let container = document.createElement('div');
    document.body.appendChild(container);
    container.classList.add('form-container');
    
    let form = document.createElement('form');
    form.classList.add('edit-todo-form');
    container.appendChild(form);

    let head = document.createElement('h2');
    head.textContent = `Edit ${todo.name}`;
    form.appendChild(head);

    let label = document.createElement('label');
    label.classList.add('edit-todo-form-item');
    label.textContent = 'Title:';
    let name = document.createElement('input');
    name.setAttribute('type', 'text');
    name.setAttribute('value', todo.name)
    label.appendChild(name);
    form.appendChild(label);

    label = document.createElement('label');
    label.classList.add('edit-todo-form-item');
    label.textContent = 'Detail:';
    let des = document.createElement('textarea');
    des.textContent = todo.description;
    label.appendChild(des);
    form.appendChild(label);

    label = document.createElement('label');
    label.classList.add('edit-todo-form-item');
    label.textContent = 'Due Date:';
    let date = document.createElement('input');
    date.setAttribute('type', 'datetime-local');
    date.setAttribute('value', todo.dueDate);
    label.appendChild(date);
    form.appendChild(label);


    label = document.createElement('label');
    label.classList.add('edit-todo-form-item');
    label.textContent = 'Priority:';
    let priority = document.createElement('select');
    for (let p of ['low priority', 'standard', 'high priority', 'urgent']) {
        let opt = document.createElement('option');
        opt.setAttribute('value', p);
        if (todo.priority === p) {
            opt.setAttribute('selected', 'selected');
        }
        opt.textContent = p;
        priority.appendChild(opt);
    }
    label.appendChild(priority);
    form.appendChild(label);

    let edit = document.createElement('input');
    edit.setAttribute('type', 'button');
    edit.setAttribute('value', 'Edit');
    edit.classList.add('edit-todo-editButton');
    form.appendChild(edit);
    edit.addEventListener('click', ()=> {
        let options = {};
        options.name = name.value;
        options.description = des.value;
        options.dueDate = date.value;
        options.priority = priority.value;
        options.project = todo.project;
        let [a, m] = editTodo(options, todo.id);
        if (!a) {
            document.querySelector('.edit-todo-message').textContent = m;
            return;
        }
        div.parentNode.insertBefore( getTodoDiv(getTodoById(todo.id), editTodo, removeTodo, getTodoById),div);
        div.parentNode.removeChild(div);
        document.body.removeChild(container);
    })

    let close = document.createElement('input');
    close.setAttribute('type', 'button');
    close.setAttribute('value', 'Close');
    close.classList.add('edit-todo-closeButton');
    form.appendChild(close);
    close.addEventListener('click', ()=>{
        document.body.removeChild(container);
    })

    label = document.createElement('div');
    label.classList.add('edit-todo-message');
    form.appendChild(label);
}


function showRemoveConfirmation(todo, div, removeTodo) {
    let container = document.createElement('div');
    document.body.append(container);
    container.classList.add('confirmation-container');

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
    });

    let cancel = document.createElement('input');
    buttonBox.appendChild(cancel);
    cancel.setAttribute('type', 'button');
    cancel.setAttribute('value', 'cancel');
    cancel.addEventListener('click', () => {
        document.body.removeChild(container);
    });
}


function showAddTodoFormFor(proj, addTodo) {
    let container = document.createElement('div');
    document.body.appendChild(container);
    container.classList.add('form-container');
    
    let form = document.createElement('form');
    form.classList.add('add-todo-form');
    container.appendChild(form);

    let head = document.createElement('h2');
    head.textContent = 'Add a New Todo Item';
    form.appendChild(head);

    let label = document.createElement('label');
    label.classList.add('add-todo-form-item');
    let name = document.createElement('input');
    name.setAttribute('type', 'text');
    name.setAttribute('placeholder', 'Title');
    label.appendChild(name);
    form.appendChild(label);

    label = document.createElement('label');
    label.classList.add('add-todo-form-item');
    let des = document.createElement('textarea');
    des.setAttribute('placeholder', 'Describe your todo item.');
    label.appendChild(des);
    form.appendChild(label);

    label = document.createElement('label');
    form.appendChild(label);
    label.classList.add('add-todo-form-item');
    let addDate = document.createElement('input');
    label.appendChild(addDate);
    addDate.setAttribute('type', 'button');
    addDate.setAttribute('value', 'Add a due date');
    addDate.addEventListener('click', () => {
        let date = document.createElement('input');
        date.setAttribute('type', 'date');
        addDate.parentNode.appendChild(date);
        addDate.parentNode.removeChild(addDate);
        date.addEventListener('change', ()=> {console.log(date.value)});
    });

    label = document.createElement('label');
    label.classList.add('add-todo-form-item');
    label.textContent = 'Priority:';
    let priority = document.createElement('select');
    for (let p of ['low priority', 'standard', 'high priority', 'urgent']) {
        let opt = document.createElement('option');
        opt.setAttribute('value', p);
        opt.textContent = p;
        priority.appendChild(opt);
    }
    label.appendChild(priority);
    form.appendChild(label);

    let add = document.createElement('input');
    add.setAttribute('type', 'button');
    add.setAttribute('value', 'Add');
    add.classList.add('add-todo-addButton');
    form.appendChild(add);
    add.addEventListener('click', ()=> {
        let options = {};
        options.name = name.value;
        options.description = des.value;
        options.dueDate = date.value;
        options.priority = priority.value;
        options.project = proj;
        let [a, m] = addTodo(options, proj);
        if (!a) {
            document.querySelector('.add-todo-message').textContent = m;
            return;
        }
        document.body.removeChild(container);
    })

    let close = document.createElement('input');
    close.setAttribute('type', 'button');
    close.setAttribute('value', 'Close');
    close.classList.add('add-todo-closeButton');
    form.appendChild(close);
    close.addEventListener('click', ()=>{
        document.body.removeChild(container);
    })

    label = document.createElement('div');
    label.classList.add('add-todo-message');
    form.appendChild(label);
}