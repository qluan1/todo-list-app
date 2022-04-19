export default function initializePage() {
    let header = document.createElement('div');
    header.id = 'header';
    document.body.insertBefore(header, document.getElementById('main'));
    let title = document.createElement('h1');
    header.appendChild(title);
    title.textContent = "Todo List";

    let sidebar = document.createElement('div');
    sidebar.id = 'sidebar';
    document.body.appendChild(sidebar);

    let all = document.createElement('div');
    all.textContent = 'All Tasks';
    sidebar.appendChild(all);
    all.classList.add('sidebar-button');
    all.classList.add('all-tasks');

    let today = document.createElement('div');
    today.textContent = 'Due Today';
    sidebar.appendChild(today);
    today.classList.add('sidebar-button');
    today.classList.add('due-today');
    
    let projects = document.createElement('div');
    projects.textContent = 'Projects';
    projects.classList.add('sidebar-button');
    projects.classList.add('projects');
    projects.classList.add('folded');
    projects.style = 'margin-top:50px;';
    sidebar.appendChild(projects);

    let projectsList = document.createElement('div');
    sidebar.append(projectsList);
    projectsList.classList.add('sidebar-projects-list');
    projectsList.classList.add('hidden');


    let projectTitle = document.createElement('div');
    projectTitle.id = 'project-title';
    document.getElementById('main').appendChild(projectTitle);

    let todosList = document.createElement('div');
    todosList.id = 'todos-list';
    document.getElementById('main').appendChild(todosList);
}