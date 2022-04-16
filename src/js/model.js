export default function Model () {
    let id = 0;
    let projects = [];
    let todos = new Map();

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

    const getCurId = ()=> {
        return id;
    }

    const getTodoById = (todoId) => {
        todoId = parseInt(todoId);
        if (todos.has(todoId)) return todos.get(todoId);
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
            todos.set(id, todo);
            id++;
            return [ans, id-1];
        }
        return [ans, message];
    }

    const removeTodoById = (todoId) => {
        todoId = parseInt(todoId);
        if (todos.has(todoId)) {
            todos.delete(todoId);
            return true;
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
        todoId = parseInt(todoId);
        let [ans, message] = canEditTodoById(options, todoId);
        if (ans) {
            let todo = getTodoById(todoId);
            todo.setName(options.name);
            todo.setDueDate(options.dueDate);
            todo.setDescription(options.description);
            todo.setPriority(options.priority);
            if (options.complete == true) {
                todo.setAsComplete();
            } else if (options.complete == false) {
                todo.setAsIncomplete();
            }
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

    const outputTodoSepcStrById = (todoId) => {
        return todoSpecStr(getTodoById(todoId));
    };

    const todoSpecStr = (todo) => {
        let spec = [];
        let items = [];
        let info = todoInfo(todo);
        let temp = [info.id, info.name, info.description, info.dueDate, info.priority, info.project, info.complete];
        for (let i = 0; i < temp.length; i++) {
            spec.push(temp[i].toString().length);
            items.push(temp[i].toString());
        }
        return [spec.join(','), items.join('')];
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
        for (let todo of todos.values()) {
            if (projName == '' || todo.getProject() == projName) {
                tds.push(todoInfo(todo));
            }
        }
        return tds;        
    }

    const initializeModel = (curId, indices, specs, strs) => {
        if (!curId || !indices || indices.length != specs.length || specs.length != strs.length) {
            todos.clear();
            id = 0;
            return;
        }
        todos.clear();
        let keys = ['id', 'name', 'description', 'dueDate', 'priority', 'project', 'complete'];
        id = parseInt(curId);
        for (let i = 0; i < indices.length; i++) {
            let index = parseInt(indices[i]);
            let spec = specs[i].split(',');
            let str = strs[i];
            let options = {};
            let startIndex = 0;
            for (let j = 0; j < spec.length; j++) {
                let len = parseInt(spec[j]);
                options[keys[j]] = str.substring(startIndex, startIndex + len);
                startIndex += len;
            }
            let todo = TodoItem(options.id, options.name, options.description, options.dueDate, options.priority, options.project);
            if (options.complete == 'true') {
                todo.setAsComplete();
            }
            todos.set(index, todo);
        }
    }

    return {
        getCurId,
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
        outputTodoSepcStrById,
        initializeModel,
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