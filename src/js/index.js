import '../style.css';
import Model from './model';
import initializePage from './initializePage';
import {showTodosFor, appendTodoElement, replaceTodoDiv, loadProjects} from './showContent';
import {storageAvailable, modifyEntry, removeEntry, loadEntries, saveProjects, integrityTest, storageRemoveProject} from './localStorage.js';

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

    const addProject = (projName) => {
        let [success, message] = model.addProject(projName);
        if (success) {
            saveProjects(...model.outputProjectSpecStr());
            updateProjects();
            showTodosForProject(message);
        }
        return [success, message];
    };

    const toggleCompleteTodo = (todoId) => {
        model.toggleCompleteTodoById(todoId);
        let [spec, str] = model.outputTodoSepcStrById(todoId);
        modifyEntry(model.getCurId(), todoId, spec, str);        
    };

    const updateProjects = () => {
        loadProjects(model.getProjectsList(), app);
    };

    const updateTodoDiv = (todoId, div) => {
        replaceTodoDiv(getTodoById(todoId), div, app);
    }
    const showTodosForProject = (projName) => {
        showTodosFor(model.outputTodoInfosFor(projName), projName, app);
    };

    const removeProject = (projName) => {
        let removedTodoId = model.removeProject(projName);
        for (let todoId of removedTodoId) {
            removeEntry(model.getCurId(), todoId);
        }
        storageRemoveProject(projName);
        updateProjects();
        let allTask = document.querySelector('.all-tasks');
        showTodosForProject('');
        let temp = document.getElementById('sidebar').querySelector('.selected');
        if (temp) temp.classList.remove('selected');
        allTask.classList.add('selected');
    };

    const getStoredEntries = () => {
        model.initializeModel(...loadEntries());
    };

    return {
        getTodoById,
        addTodo,
        removeTodo,
        editTodo,
        addProject,
        removeProject,
        toggleCompleteTodo,
        showTodosForProject,
        updateTodoDiv,
        getStoredEntries,
        test : () => {   
            initializePage();
            let projButton = document.querySelector('.projects');
            projButton.addEventListener('click', ()=>{
                let projsList = document.querySelector('.sidebar-projects-list');
                projsList.classList.toggle('hidden');
                projButton.classList.toggle('folded');
            });

            let allTask = document.querySelector('.all-tasks');
            allTask.addEventListener('click', ()=>{
                showTodosForProject('');
                let temp = document.getElementById('sidebar').querySelector('.selected');
                if (temp) temp.classList.remove('selected');
                allTask.classList.add('selected');
            });

            if (storageAvailable('localStorage')) {
                console.log(integrityTest());
                getStoredEntries();
                showTodosForProject('');
                updateProjects();
            } else {
                showTodosForProject('');
                updateProjects();
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
            //document.body.appendChild(log);

            let clear = document.createElement('input');
            clear.setAttribute('type', 'button');
            clear.setAttribute('value', 'clear');
            clear.addEventListener('click', ()=>{
                window.localStorage.clear();
                getStoredEntries();
                showTodosForProject('');
            });
            //document.body.appendChild(clear);
        },
    };
})();

app.test();