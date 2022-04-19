import { getAddTodoFormFor, getTodoDetail, getAddProjectForm, getRemoveProjectConfirmation, getRemoveTodoConfirmation } from "./forms";
import { getDueIn } from "./dateTime";
import closeIcon from '../img/close-circle.svg';
import closeIconHover from '../img/close-circle-hover.svg';

export function loadProjects(projs, app) {
    let pjl = document.querySelector('.sidebar-projects-list');
    while (pjl.firstElementChild) {
        pjl.removeChild(pjl.firstElementChild);
    }

    for (let proj of projs) {
        let projContainer = document.createElement('div');
        projContainer.textContent = proj;
        pjl.appendChild(projContainer);
        projContainer.classList.add('sidebar-projects-item');
        projContainer.addEventListener('click', () => {
            app.showTodosForProject(proj);
            let temp = document.getElementById('sidebar').querySelector('.selected');
            if (temp) temp.classList.remove('selected');
            projContainer.classList.add('selected');
        });
    }

    let addProjButton = document.createElement('div');
    pjl.appendChild(addProjButton);
    addProjButton.textContent = '+ Add a project';
    addProjButton.classList.add('sidebar-add-project');
    addProjButton.addEventListener('click', () => {
        document.body.classList.add('no-scroll');
        document.body.appendChild(getAddProjectForm(app));
    });
}

export function appendTodoElement(td, app) {
    let addTask = document.querySelector('.add-container-box');
    let container = document.getElementById('todos-list');
    container.insertBefore(getTodoDiv(td, app), addTask);
}


export function showTodosFor(tds, proj, app) {
    let projTitle = document.getElementById('project-title');
    projTitle.textContent = (proj == '')? 'ALL TASKS': proj;


    let container = document.getElementById('todos-list');
    while (container.firstElementChild) {
        container.removeChild(container.firstElementChild);
    }

    for (let i = 0; i < tds.length; i++) {
        container.appendChild(getTodoDiv(tds[i], app));
    }

    let add = document.createElement('div');
    document.getElementById('todos-list').appendChild(add);
    add.classList.add('add-container-box');

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

    if (proj != ''){
        let deleteProj = document.createElement('div');
        deleteProj.textContent = 'Delete Project';
        deleteProj.classList.add('delete-project-button');
        container.appendChild(deleteProj);
    
        deleteProj.addEventListener('click', () => {
            document.body.classList.add('no-scroll');
            document.body.appendChild(getRemoveProjectConfirmation(proj, app));
        });
    }
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

    let setDueInTime = setInterval(() => {
        if (todo.complete) {
            return;
        }
        dueIn.textContent = getDueIn(todo.dueDate);
    }, 60000);

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
        document.body.classList.add('no-scroll');
        document.body.appendChild(getRemoveTodoConfirmation(todo, div, app));
    });

    return div;
}

export function replaceTodoDiv(todo, div, app) {
    let newDiv = getTodoDiv(todo, app);
    div.parentNode.replaceChild(newDiv, div);
    document.body.appendChild(getTodoDetail(todo, newDiv, app));
}