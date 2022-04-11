import '../style.css';
import Model from './model';
import initializePage from './initializePage';
import {showProjects, showTodosFor, appendTodoElement} from './showContent';

initializePage();
const model = Model();

let app = (function (){

    const getTodoById = (todoId) => {
        return model.outputTodoInfoById(todoId);
    };

    const addTodo = (options) => {
        let [ans, message] = model.addTodo(options);
        if (ans) {
            appendTodoElement(model.outputTodoInfoById(message), editTodo, removeTodo, getTodoById, toggleCompleteTodo);
        }
        return [ans, message];
    };

    const removeTodo = (todoId) => {
        return model.removeTodoById(todoId);
    };

    const editTodo = (options, todoId) => {
        return model.editTodoById(options, todoId);
    };

    const toggleCompleteTodo = (todoId) => {
        return model.toggleCompleteTodoById(todoId);
    }

    const clickProject = (projName) => {
        showTodosFor(model.outputTodoInfosFor(projName), projName, addTodo, editTodo, removeTodo, getTodoById, toggleCompleteTodo);
    };

    return {
        clickProject,
        test : () => {
            addTodo({
                name: 'Sample todo task 1',
                description: 'Description of sample todo task 1',
                dueDate: '2022-04-10T21:30',
                priority: 'high',
                project: null,
            }, null);
            addTodo({
                name: 'Sample todo task 2',
                description: 'Description of another sample todo task 1',
                dueDate: '2022-04-11T07:30',
                priority: 'low',
                project: null,
            }, null);  
            addTodo({
                name: 'Sample todo task 3',
                description: 'Description of another sample todo task 1',
                dueDate: '2022-04-22T12:30',
                priority: 'low',
                project: null,
            }, null);
            addTodo({
                name: 'Sample todo task 4',
                description: 'Description of another sample todo task 1',
                dueDate: '2022-04-10T22:30',
                priority: 'no',
                project: null,
            }, null);             
            clickProject(null);
        },
    };
})();

app.test();
