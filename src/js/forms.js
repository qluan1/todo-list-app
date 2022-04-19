import flagIcon from '../img/flag-variant.svg';
import {endOfToday, shortDateTimeLocal} from './dateTime.js';
import closeIcon from '../img/window-close.svg';

export function getAddTodoFormFor(proj, addTodo, addItem, addContainer) {

    let container = document.createElement('div');
    container.classList.add('form-container');
    
    let form = document.createElement('form');
    form.classList.add('add-todo-form');
    container.appendChild(form);

    //              Title
    let nameContainer = document.createElement('div');
    form.appendChild(nameContainer);
    nameContainer.classList.add('add-todo-form-item');

    let name = document.createElement('input');
    nameContainer.appendChild(name);
    name.setAttribute('type', 'text');
    name.setAttribute('placeholder', 'Title of your task.');
    name.classList.add('add-todo-form-name');


    //             Extra
    let extra = document.createElement('div');
    extra.classList.add('add-todo-form-item');
    extra.classList.add('des-date-priority');
    form.appendChild(extra);

    //             Extra Descritption
    let des = document.createElement('textarea');
    des.classList.add('add-todo-form-des');
    des.setAttribute('placeholder', 'Details of your task.');
    extra.appendChild(des);

    //             Extra Due Date
    let datePriority = document.createElement('div');
    extra.appendChild(datePriority);
    datePriority.classList.add('date-priority');

    let dateContainer = document.createElement('div');
    dateContainer.classList.add('date-container');
    datePriority.appendChild(dateContainer);

    let addDate = document.createElement('div');
    dateContainer.appendChild(addDate);
    addDate.classList.add('add-dueDate-prompt');
    addDate.textContent = 'Due';

    let closeDate = document.createElement('div');
    closeDate.classList.add('clear-date');
    closeDate.textContent = 'clear';

    let date = document.createElement('input');
    date.setAttribute('type', 'datetime-local');
    date.setAttribute('min', '2020-01-01T00:00');

    addDate.addEventListener('click', () => {
        dateContainer.appendChild(date);
        dateContainer.appendChild(closeDate);
        date.value = endOfToday();
        if (dateContainer.contains(addDate)) dateContainer.removeChild(addDate);
        date.focus();
    });

    closeDate.addEventListener('click', () => {
        if (dateContainer.contains(date)) {
            date.value = '';
            if (dateContainer.contains(date)) dateContainer.removeChild(date);
            if (dateContainer.contains(closeDate)) dateContainer.removeChild(closeDate);
            dateContainer.appendChild(addDate);
        }
    });

    date.addEventListener('change', ()=>{
        if (!date.value) {
            date.value = '';
            if (dateContainer.contains(date)) dateContainer.removeChild(date);
            if (dateContainer.contains(closeDate)) dateContainer.removeChild(closeDate);
            dateContainer.appendChild(addDate);        
        }
    });

    //             Extra Priority
    let prioContainer = document.createElement('div');
    prioContainer.classList.add('prioContainer');
    datePriority.appendChild(prioContainer);

    let priority = new Image();
    priority.src = flagIcon;
    priority.className = 'priority no-priority';
    priority.addEventListener('click', () => {
        switch (priority.className) {
            case ('priority no-priority'):
                priority.className = 'priority low-priority';
                break;
            case ('priority low-priority'):
                priority.className = 'priority high-priority';
                break;
            case ('priority high-priority'):
                priority.className = 'priority no-priority';
                break;
        }
    });
    prioContainer.appendChild(priority);
    

    //             Add and Cancel Button
    let buttonContainer = document.createElement('div');
    buttonContainer.classList.add('add-todo-form-item');
    buttonContainer.classList.add('button-container');
    form.appendChild(buttonContainer);

    let add = document.createElement('input');
    add.setAttribute('type', 'button');
    add.setAttribute('value', 'Add a task');
    add.classList.add('add-todo-addButton');
    buttonContainer.appendChild(add);
    add.addEventListener('click', ()=> {
        let options = {};
        options.name = name.value;
        options.description = des.value;
        options.dueDate = date.value;
        switch(priority.className) {
            case ('priority no-priority'):
                options.priority = 'no';
                break;
            case ('priority low-priority'):
                options.priority = 'low';
                break;
            case ('priority high-priority'):
                options.priority = 'high';
                break;            
        };
        options.project = proj;
        let [a, m] = addTodo(options);
        if (!a) {
            document.querySelector('.add-todo-message').textContent = m;
            return;
        }
        // initialize the form
        name.value = '';
        des.value = '';
        
        date.value = '';
        if (dateContainer.contains(date)) dateContainer.removeChild(date);
        if (dateContainer.contains(closeDate)) dateContainer.removeChild(closeDate);
        if (!dateContainer.contains(addDate)) dateContainer.appendChild(addDate);
        
        priority.className = 'priority no-priority';
        document.querySelector('.add-todo-message').textContent = '';
    })

    let close = document.createElement('input');
    close.setAttribute('type', 'button');
    close.setAttribute('value', 'Cancel');
    close.classList.add('add-todo-closeButton');
    buttonContainer.appendChild(close);
    close.addEventListener('click', ()=>{
        addItem.removeChild(container);
        addItem.appendChild(addContainer);
    })

    let message = document.createElement('div');
    form.appendChild(message);
    message.classList.add('add-todo-message');

    return container;
}


export function getTodoDetail(todo, todoDiv, app) {
    let background = document.createElement('div');
    document.body.classList.add('no-scroll');
    background.classList.add('popup-background');

    let detail = document.createElement('div');
    background.appendChild(detail);
    detail.classList.add('todo-detail');


    //            Title
    let titleContainer = document.createElement('div');
    detail.appendChild(titleContainer);
    titleContainer.classList.add('todo-detail-title-container');

    let title = document.createElement('div');
    titleContainer.append(title);
    title.classList.add('todo-detail-title');
    title.textContent = todo.name;

    //            Extra
    let desDatePrio = document.createElement('div');
    detail.append(desDatePrio);
    desDatePrio.classList.add('des-date-priority');
    desDatePrio.classList.add('detail-page');

    //            Extra Description
    let description = document.createElement('div');
    desDatePrio.appendChild(description);
    description.classList.add('todo-detail-description');
    description.textContent = todo.description;

    //            Extra Due Date
    let datePrio = document.createElement('div');
    desDatePrio.appendChild(datePrio);
    datePrio.classList.add('date-priority');

    let dateContainer = document.createElement('div');
    datePrio.appendChild(dateContainer);
    dateContainer.classList.add('date-container');

    let dueDate = document.createElement('div');
    dateContainer.appendChild(dueDate);
    dueDate.classList.add('todo-detail-dueDate-prompt');
    dueDate.textContent = shortDateTimeLocal(todo.dueDate);

    //           Extra Priority
    let prioContainer = document.createElement('div');
    datePrio.appendChild(prioContainer);
    prioContainer.classList.add('prioContainer');

    let priority = new Image();
    prioContainer.appendChild(priority);
    priority.src = flagIcon;
    priority.classList.add('priority');
    switch(todo.priority) {
        case 'no':
            priority.classList.add('no-priority');
            break;
        case 'low':
            priority.classList.add('low-priority');
            break;
        case 'high':
            priority.classList.add('high-priority');
            break;
    }


    //           Control Buttons
    let buttons = document.createElement('div');
    detail.appendChild(buttons);
    buttons.classList.add('todo-detail-buttons-container');

    let editButton = document.createElement('input');
    buttons.appendChild(editButton);
    editButton.setAttribute('type', 'button');
    editButton.setAttribute('value', 'Edit');
    editButton.classList.add('todo-detail-edit-button');

    editButton.addEventListener('click', () => {
        editButtonClicked(detail, todo, todoDiv, app);
    });


    //           Close Button
    let closeContainer = document.createElement('div');
    detail.appendChild(closeContainer);
    closeContainer.classList.add('todo-detail-close');
    let closeButton = new Image();
    closeButton.src = closeIcon;
    closeContainer.appendChild(closeButton);
    closeButton.addEventListener('click', () => {
        document.body.removeChild(background);
        document.body.classList.remove('no-scroll');
    });
    background.addEventListener('click', (e) => {
        if (e.target == background) {
            document.body.removeChild(background);
            document.body.classList.remove('no-scroll');            
        }
    })
    return background;
}


function editButtonClicked(detail, todo, todoDiv, app) {
    
    // get existing elements
    let bg = detail.parentNode;
    let nbg = bg.cloneNode();
    nbg.addEventListener('click', (e) => {
        if (e.target == nbg) {
            discardChangeDialog();
        }
    });

    let closeButton = detail.querySelector('.todo-detail-close img');
    let nCloseButton = closeButton.cloneNode();
    nCloseButton.addEventListener('click', ()=>{
        discardChangeDialog();
    });

    let titleContainer = detail.querySelector('.todo-detail-title-container');
    let title = detail.querySelector('.todo-detail-title');

    let desContainer = detail.querySelector('.des-date-priority');
    desContainer.classList.add('in-edit');
    let des = detail.querySelector('.todo-detail-description');

    let dateContainer = detail.querySelector('.date-container');
    let date = detail.querySelector('.todo-detail-dueDate-prompt');

    let prioContainer = detail.querySelector('.prioContainer');
    let priority = detail.querySelector('.priority');

    let buttonContainer = detail.querySelector('.todo-detail-buttons-container');
    let editButton = buttonContainer.querySelector('.todo-detail-edit-button');

    // input
    let titleInput = document.createElement('input');
    titleInput.setAttribute('type', 'text');
    titleInput.setAttribute('placeholder', 'Title of your task.');
    titleInput.value = todo.name;
    titleInput.classList.add('todo-detail-title');
    titleInput.classList.add('in-edit');

    let desInput = document.createElement('textarea');
    desInput.setAttribute('placeholder', 'Details of your task.');
    desInput.value = todo.description;
    desInput.classList.add('todo-detail-description');

    let dateInput = document.createElement('input');
    dateInput.setAttribute('type', 'datetime-local');
    dateInput.value = todo.dueDate;

    let priorityInput = new Image();
    priorityInput.src = flagIcon;
    priorityInput.classList.add('priority');
    priorityInput.classList.add(todo.priority + '-' + 'priority');
    priorityInput.addEventListener('click', () => {
        switch (priorityInput.className) {
            case ('priority no-priority'):
                priorityInput.className = 'priority low-priority';
                break;
            case ('priority low-priority'):
                priorityInput.className = 'priority high-priority';
                break;
            case ('priority high-priority'):
                priorityInput.className = 'priority no-priority';
                break;
        }
    });

    let confirmEditButton = document.createElement('input');
    confirmEditButton.setAttribute('type', 'button');
    confirmEditButton.setAttribute('value', 'Confirm Edits');
    confirmEditButton.addEventListener('click', () => {
        let options = {};
        options.name = titleInput.value;
        options.description = desInput.value;
        options.dueDate = dateInput.value;
        switch(priorityInput.className) {
            case ('priority no-priority'):
                options.priority = 'no';
                break;
            case ('priority low-priority'):
                options.priority = 'low';
                break;
            case ('priority high-priority'):
                options.priority = 'high';
                break;            
        };
        options.project = todo.project;
        let [ans, m] = app.editTodo(options, todo.id);
        if (ans) {
            document.body.removeChild(detail.parentNode);
            app.updateTodoDiv(todo.id, todoDiv);
            return;
        }
        messageContainer.textContent = m;
    })

    let messageContainer = document.createElement('div');
    messageContainer.classList.add('todo-detail-edit-message');

    let cancelButton = document.createElement('input');
    cancelButton.setAttribute('type', 'button');
    cancelButton.setAttribute('value', 'Discard Edits');
    cancelButton.addEventListener('click', ()=> {
        revert();
    });

    // replacement
    titleContainer.replaceChild(titleInput, title);
    desContainer.replaceChild(desInput, des);
    dateContainer.replaceChild(dateInput, date);
    prioContainer.replaceChild(priorityInput, priority);
    buttonContainer.replaceChild(cancelButton, editButton);
    buttonContainer.insertBefore(confirmEditButton, cancelButton);
    bg.parentNode.replaceChild(nbg, bg);
    nbg.appendChild(detail);
    closeButton.parentNode.replaceChild(nCloseButton, closeButton);
    detail.appendChild(messageContainer);
    titleInput.focus();


    function revert() {
        titleContainer.insertBefore(title, titleInput);
        titleContainer.removeChild(titleInput);
        desContainer.classList.remove('in-edit');
        desContainer.insertBefore(des, desInput);
        desContainer.removeChild(desInput);
        dateContainer.insertBefore(date, dateInput);
        dateContainer.removeChild(dateInput);
        prioContainer.insertBefore(priority, priorityInput);
        prioContainer.removeChild(priorityInput);
        buttonContainer.insertBefore(editButton, cancelButton);
        buttonContainer.removeChild(cancelButton);
        buttonContainer.removeChild(confirmEditButton);
        nCloseButton.parentNode.replaceChild(closeButton, nCloseButton);
        nbg.parentNode.replaceChild(bg, nbg);  
        bg.appendChild(detail);
        detail.removeChild(messageContainer);
    }

    function discardChangeDialog() {

        let dialBackground = document.createElement('div');
        document.body.appendChild(dialBackground);
        dialBackground.classList.add('popup-background');
        dialBackground.classList.add('higherZ');
        dialBackground.addEventListener('click', (e)=> {
            if (e.target == dialBackground) {
                document.body.removeChild(dialBackground); 
            }
        })


        let confirmationPage = document.createElement('div');
        dialBackground.appendChild(confirmationPage);
        confirmationPage.classList.add('confirmation-page');
    
        let head = document.createElement('h3');
        confirmationPage.appendChild(head);
        head.innerHTML = `Discard Change?`;
    
        let buttonBox = document.createElement('div');
        confirmationPage.appendChild(buttonBox);

        let cancel = document.createElement('input');
        buttonBox.appendChild(cancel);
        cancel.setAttribute('type', 'button');
        cancel.setAttribute('value', 'cancel');
        cancel.addEventListener('click', () => {
            document.body.removeChild(dialBackground);
        });
        
        let discard = document.createElement('input');
        buttonBox.appendChild(discard);
        discard.setAttribute('type', 'button');
        discard.setAttribute('value', 'Discard');
        discard.addEventListener('click', ()=> {
            document.body.removeChild(dialBackground);
            revert();
        });
    }
}

export function getAddProjectForm(app) {
    let background = document.createElement('div');
    background.classList.add('popup-background');

    let form = document.createElement('div');
    background.appendChild(form);
    form.classList.add('add-project-form');

    let projNameContainer = document.createElement('div');
    form.appendChild(projNameContainer);

    let projNameInput = document.createElement('input');
    projNameContainer.appendChild(projNameInput);
    projNameInput.setAttribute('type', 'text');

    let buttonContainer = document.createElement('div');
    form.appendChild(buttonContainer);
    buttonContainer.classList.add('add-project-buttons');

    let addButton = document.createElement('input');
    buttonContainer.appendChild(addButton);
    addButton.setAttribute('type', 'button');
    addButton.setAttribute('value', 'Add Project');

    let cancelButton = document.createElement('input');
    buttonContainer.appendChild(cancelButton);
    cancelButton.setAttribute('type', 'button');
    cancelButton.setAttribute('value', 'Cancel');

    let message = document.createElement('div');
    form.appendChild(message);
    message.classList.add('add-project-message');

    addButton.addEventListener('click', () => {
        let [success, m] = app.addProject(projNameInput.value);
        if (success) {
            document.body.classList.remove('no-scroll');
            document.body.removeChild(background);
            return;
        }
        message.textContent = errorMessage;
    });

    cancelButton.addEventListener('click', () => {
        document.body.classList.remove('no-scroll');
        document.body.removeChild(background);
    });

    background.addEventListener('click', (e) => {
        if (e.target == background) {
            document.body.classList.remove('no-scroll');
            document.body.removeChild(background);           
        }
    });

    return background;
}

export function getRemoveProjectConfirmation(proj, app) {
    let background = document.createElement('div');
    background.classList.add('popup-background');

    let confirmationPage = document.createElement('div');
    background.appendChild(confirmationPage);
    confirmationPage.classList.add('confirmation-page');

    let head = document.createElement('h3');
    confirmationPage.appendChild(head);
    head.innerHTML = `Remove project <br> <div class = "confirmation-page-header-innertext">${proj}</div> and tasks belong to it?`;

    let buttonBox = document.createElement('div');
    confirmationPage.appendChild(buttonBox);
    buttonBox.classList.add('confirmation-page-button-box');
    
    let confirm = document.createElement('input');
    buttonBox.appendChild(confirm);
    confirm.setAttribute('type', 'button');
    confirm.setAttribute('value', 'confirm');
    confirm.addEventListener('click', () => {
        app.removeProject(proj);
        document.body.removeChild(background);
        document.body.classList.remove('no-scroll');
    });

    let cancel = document.createElement('input');
    buttonBox.appendChild(cancel);
    cancel.setAttribute('type', 'button');
    cancel.setAttribute('value', 'cancel');
    cancel.addEventListener('click', () => {
        document.body.removeChild(background);
        document.body.classList.remove('no-scroll');
    });

    background.addEventListener('click', (e) => {
        if (e.target == background) {
            document.body.classList.remove('no-scroll');
            document.body.removeChild(background);           
        }
    });

    return background;
}

export function getRemoveTodoConfirmation(todo, div, app) {
    let container = document.createElement('div');
    container.classList.add('popup-background');

    let confirmationPage = document.createElement('div');
    container.appendChild(confirmationPage);
    confirmationPage.classList.add('confirmation-page');

    let head = document.createElement('h3');
    confirmationPage.appendChild(head);
    head.innerHTML = `Remove <span>${todo.name}</span>?`;

    let buttonBox = document.createElement('div');
    confirmationPage.appendChild(buttonBox);
    buttonBox.classList.add('confirmation-page-button-box');
    
    let confirm = document.createElement('input');
    buttonBox.appendChild(confirm);
    confirm.setAttribute('type', 'button');
    confirm.setAttribute('value', 'confirm');
    confirm.addEventListener('click', () => {
        let a = app.removeTodo(todo.id);
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

    container.addEventListener('click', (e) => {
        if (e.target == container) {
            document.body.removeChild(container);
            document.body.classList.remove('no-scroll');
        }
    })

    return container;
}
