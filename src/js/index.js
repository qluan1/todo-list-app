import '../style.css';
import Model from './model';
import initializePage from './initializePage';
import {showProjects, showTodosFor, appendTodoElement, replaceTodoDiv} from './showContent';
import {storageAvailable, modifyEntry, removeEntry, loadEntries} from './localStorage.js';

initializePage();
const model = Model();

let app = (function (){

    const getTodoById = (todoId) => {
        return model.outputTodoInfoById(todoId);
    };

    const addTodo = (options) => {
        // if the addTodo succesfully add an todo entry
        // message will be the id of the todo entry
        let [success, message] = model.addTodo(options);
        if (success) {
            appendTodoElement(model.outputTodoInfoById(message), app);
            let [spec, str] = model.outputTodoSepcStrById(message);
            modifyEntry(model.getCurId(), message, spec, str);
        }
        return [success, message];
    };

    const removeTodo = (todoId) => {
        let success = model.removeTodoById(todoId);
        removeEntry(model.getCurId(), todoId);
        return success;
    };

    const editTodo = (options, todoId) => {
        let [success, message] = model.editTodoById(options, todoId);
        if (success) {
            let [spec, str] = model.outputTodoSepcStrById(todoId);
            modifyEntry(model.getCurId(), todoId, spec, str);
        }
        return [success, message];
    };

    const toggleCompleteTodo = (todoId) => {
        model.toggleCompleteTodoById(todoId);
        let [spec, str] = model.outputTodoSepcStrById(todoId);
        modifyEntry(model.getCurId(), todoId, spec, str);        
    }

    const updateTodoDiv = (todoId, div) => {
        replaceTodoDiv(getTodoById(todoId), div, app);
    }
    const showTodosForProject = (projName) => {
        showTodosFor(model.outputTodoInfosFor(projName), projName, app);
    };

    const getStoredEntries = () => {
        model.initializeModel(...loadEntries());
    };

    return {
        getTodoById,
        addTodo,
        removeTodo,
        editTodo,
        toggleCompleteTodo,
        showTodosForProject,
        updateTodoDiv,
        getStoredEntries,
        test : () => {   
            if (storageAvailable('localStorage')) {
                getStoredEntries();
                showTodosForProject('');
            } else {
                showTodosForProject('');
            }
            let log = document.createElement('input');
            log.setAttribute('type', 'button');
            log.setAttribute('value', 'log');
            log.addEventListener('click', ()=> {
                let [curId, indices, specs, strs] = loadEntries();
                console.log(curId);
                console.log(indices);
                console.log(specs);
                console.log(strs);
            })
            document.body.appendChild(log);

            let clear = document.createElement('input');
            clear.setAttribute('type', 'button');
            clear.setAttribute('value', 'clear');
            clear.addEventListener('click', ()=>{
                window.localStorage.clear();
                getStoredEntries();
                showTodosForProject('');
            });
            document.body.appendChild(clear);
        },
    };
})();

app.test();

