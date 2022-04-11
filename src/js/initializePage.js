export default function initializePage() {
    let header = document.createElement('div');
    header.id = 'header';
    document.body.insertBefore(header, document.getElementById('main'));
    let title = document.createElement('h1');
    header.appendChild(title);
    title.textContent = "Todo List";

    let todosList = document.createElement('div');
    todosList.id = 'todos-list';
    document.getElementById('main').appendChild(todosList);
}