export default function Model () {
    let id = 0;
    let projects = [];
    let todos = [];

    let isProjNameValid = (name) => {
        if (typeof(name) != 'string') {
            return false;
        }
        let pn = name.trim();
        return pn != '';
    };

    let canAddProject = (projName) => {
        if (!isProjNameValid(projName)) {
            return [false, 'Project Name Invalid!'];
        }
        let pn = projName.trim();
        for (let i = 0; i < projects.length; i++) {
            if (pn === projects[i]) {
                return [false, 'This Project Already Exists!'];
            }
        }
        return [true, null];
    };

    let addProject = (projName) => {
        let [canAdd, message] = canAddProject(projName);
        if (!canAdd) {
            return;
        }
        projects.push(projName.trim());
    };

    let removeProject = (proj) => {
        let i = 0;
        while (i < projects.length) {
            if (projects[i] == proj){
                projects.splice(i, 1);
                return;
            }
            i++;
        }
    }

    const getTodoById = (todoId) => {
        for (let i = 0; i < todos.length; i++) {
            if (todos[i].getId() == todoId) {
                return todos[i];
            }
        }
        return null;
    }

    const canAddTodo = (options, projName) => {
        if (options.name === '') {
            return [false, 'Title can\'t be empty.'];
        }
        return [true, ''];
    }

    const addTodo = (todoOptions) => {
        let [ans, message] = canAddTodo(todoOptions, todoOptions.project);
        if (ans) {
            let todo = TodoItem(id, todoOptions.name, todoOptions.description, todoOptions.dueDate, todoOptions.priority, todoOptions.project);
            todos.push(todo);
            id++;
            return [ans, id-1];
        }
        return [ans, message];
    }

    const removeTodoById = (todoId) => {
        let i = 0;
        while (i < todos.length) {
            if (todoId == todos[i].getId()){
                todos.splice(i, 1);
                return true;
            }
            i++;
        }
        return false;
    }

    const canEditTodoById = (options, todoId) => {
        if (options.name == '') {
            return [false, 'Title can\'t be empty.'];
        }
        return [true, ''];
    }

    const editTodoById = (options, todoId) => {
        let [ans, message] = canEditTodoById(options, todoId);
        if (ans) {
            let todo = getTodoById(todoId);
            todo.setName(options.name);
            todo.setDueDate(options.dueDate);
            todo.setDescription(options.description);
            todo.setPriority(options.priority);
        }
        return [ans, message];
    }

    const todoInfo = (todo) => {
        return {
            id: todo.getId(),
            name: todo.getName(),
            description: todo.getDescription(),
            dueDate: todo.getDueDate(),
            priority: todo.getPriority(),
            project: todo.getProject(),
            complete: todo.getComplete(),
        };
    }

    const toggleCompleteTodoById = (todoId) => {
        let todo = getTodoById(todoId);
        if (todo.getComplete()) {
            todo.setAsIncomplete();
            return;
        }
        todo.setAsComplete();
    };

    const outputTodoInfoById = (todoId) => {
        return todoInfo(getTodoById(todoId));
    }

    const outputTodoInfosFor = (projName) => {
        let tds = [];
        for (let i = 0; i < todos.length; i++) {
            if (projName == null || todos[i].getProject() == projName) {
                tds.push(todoInfo(todos[i]));
            }
        }
        return tds;        
    }


    return {
        canAddProject,
        addProject,
        removeProject,
        canAddTodo,
        addTodo,
        removeTodoById,
        canEditTodoById,
        editTodoById,
        toggleCompleteTodoById,
        outputTodoInfosFor,
        outputTodoInfoById,
    };
};

function TodoItem(id, name, description, dueDate, priority, project) {
    let isComplete = false;
    const getId = () => id;
    const getName = () => name;
    const setName = (newName) => {
        if (typeof(newName) == 'string' && newName != '') {
            name = newName;
        }
    }

    const getDescription = () => description;
    const setDescription = (newDes) => {
        if (typeof(newDes) == 'string') {
            description = newDes;
        } else if (typeof(newDes) == 'null') {
            description = '';
        }
    };

    const getDueDate = () => dueDate;
    const setDueDate = (newDueDate) => {
        dueDate = newDueDate;
    };

    const getPriority = () => priority;
    const setPriority = (newPriority) => {
        priority = newPriority;
    };


    const getComplete = () => isComplete;
    const setAsComplete = () => {
        isComplete = true;
    };
    const setAsIncomplete = () => {
        isComplete = false;
    };

    const getProject = () => project;
    const setProject = (newProject) => {
        project =newProject;
    };
    return {
        getId,
        getName,
        setName,
        getDescription,
        setDescription,
        getDueDate,
        setDueDate,
        getPriority,
        setPriority,
        getComplete,
        setAsComplete,
        setAsIncomplete,
        getProject,
        setProject,
    };
}