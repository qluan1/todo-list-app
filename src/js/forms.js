import flagIcon from '../img/flag-variant.svg';

export function getAddTodoFormFor(proj, addTodo, addItem, addContainer) {
    let container = document.createElement('div');
    container.classList.add('form-container');
    
    let form = document.createElement('form');
    form.classList.add('add-todo-form');
    container.appendChild(form);

    //              Title
    let label = document.createElement('div');
    label.classList.add('add-todo-form-item');
    let name = document.createElement('input');
    name.setAttribute('type', 'text');
    name.setAttribute('placeholder', 'Title of your task');
    name.classList.add('add-todo-form-name');
    label.appendChild(name);
    form.appendChild(label);


    //             Extra
    let extra = document.createElement('div');
    extra.classList.add('add-todo-form-item');
    extra.classList.add('des-date-priority');
    form.appendChild(extra);

    //             Extra Descritption
    let des = document.createElement('textarea');
    des.classList.add('add-todo-form-des');
    des.setAttribute('placeholder', 'Describe your task.');
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

    addDate.addEventListener('click', () => {
        dateContainer.appendChild(date);
        dateContainer.appendChild(closeDate);
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

    label = document.createElement('div');
    label.classList.add('add-todo-message');
    form.appendChild(label);

    return container;
}