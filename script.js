const input = document.querySelector("input");
const addButton = document.querySelector(".add-button");
const todosHtml = document.querySelector(".todos");

/* #############################################################################*/

let todoJson = JSON.parse(localStorage.getItem("todos")) || [];

input.addEventListener("keyup", e => {
    let todo = input.value.trim();
    if (!todo || e.key !== "Enter") {
        return;
    }
    addTodo(todo);
});

addButton.addEventListener("click", () => {
    let todo = input.value.trim();
    if (!todo) {
        return;
    }
    addTodo(todo);
});

/* #############################################################################*/

function showTodos() {
    todosHtml.innerHTML = ''; 
    todoJson.forEach((todo, index) => {
        const todoItem = document.createElement('li');
        todoItem.classList.add('todo-item');

        const checkContainer = document.createElement('div');
        checkContainer.classList.add('check-container');
        checkContainer.innerHTML = `<i class="fa fa-check" style="display:none;"></i>`; 

        checkContainer.onclick = () => {
            todoJson[index].status = todoJson[index].status === "completed" ? "pending" : "completed";
            localStorage.setItem("todos", JSON.stringify(todoJson));
            showTodos();
        };

        if (todo.status === "completed") {
            checkContainer.classList.add('checked');
            checkContainer.querySelector('i').style.display = 'block'; 
            todoItem.classList.add('completed'); 
        }

        const todoText = document.createElement('span');
        todoText.innerText = todo.name;

        /* #############################################################################*/

        const addSubTodoButton = document.createElement('button');
        addSubTodoButton.classList.add('add-subtodo-btn');
        addSubTodoButton.innerHTML = 'Ajouter une sous-tâche';
        addSubTodoButton.onclick = () => addSubTodoPrompt(index);

        /* #############################################################################*/

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-btn');
        deleteButton.innerHTML = '<i class="fa fa-trash"></i>';
        deleteButton.onclick = () => {
            todoJson.splice(index, 1); 
            localStorage.setItem("todos", JSON.stringify(todoJson));
            showTodos();
        };

        /* #############################################################################*/

        const editButton = document.createElement('button');
        editButton.classList.add('edit-btn');
        editButton.innerHTML = '<i class="fa fa-edit"></i>';
        editButton.onclick = () => {
            const newTodoName = prompt('Modifier le nom de la tâche:', todo.name);
            if (newTodoName) {
                todoJson[index].name = newTodoName; 
                localStorage.setItem("todos", JSON.stringify(todoJson));
                showTodos();
            }
        };

        /* #############################################################################*/

        todoItem.appendChild(checkContainer); 
        todoItem.appendChild(todoText);
        todoItem.appendChild(addSubTodoButton);
        todoItem.appendChild(editButton); 
        todoItem.appendChild(deleteButton); 

        /* #############################################################################*/

        const subTodosContainer = document.createElement('ul');
        subTodosContainer.classList.add('sub-todos');
        todo.subTodos && todo.subTodos.forEach((subTodo, subIndex) => {
            const subTodoItem = document.createElement('li');
            subTodoItem.classList.add('sub-todo-item');
            
            /* #############################################################################*/

            if (subTodo.status === 'completed') {
                subTodoItem.classList.add('completed');
            }

            subTodoItem.innerHTML = `
                <span>${subTodo.name}</span>
                <input type="time" class="sub-todo-time" value="${subTodo.time}">
                <button class="validate-subtodo-btn">Valider</button>
            `;

            /* #############################################################################*/

            const validateButton = subTodoItem.querySelector('.validate-subtodo-btn');
            validateButton.onclick = () => {
                subTodo.status = 'completed';
                localStorage.setItem("todos", JSON.stringify(todoJson));
                showTodos();
            };

            /* #############################################################################*/

            const deleteSubTodoButton = document.createElement('button');
            deleteSubTodoButton.classList.add('delete-subtodo-btn');
            deleteSubTodoButton.innerHTML = '<i class="fa fa-trash"></i>';
            deleteSubTodoButton.onclick = () => {
                todo.subTodos.splice(subIndex, 1); 
                localStorage.setItem("todos", JSON.stringify(todoJson));
                showTodos();
            };

            /* #############################################################################*/

            const editSubTodoButton = document.createElement('button');
            editSubTodoButton.classList.add('edit-subtodo-btn');
            editSubTodoButton.innerHTML = '<i class="fa fa-edit"></i>';
            editSubTodoButton.onclick = () => {
                const newSubTodoName = prompt('Modifier le nom de la sous-tâche:', subTodo.name);
                const newSubTodoTime = prompt('Modifier l’heure de la sous-tâche (HH:MM):', subTodo.time);
                
                if (newSubTodoName) subTodo.name = newSubTodoName;
                if (newSubTodoTime) subTodo.time = newSubTodoTime;

                localStorage.setItem("todos", JSON.stringify(todoJson));
                showTodos();
            };

            /* #############################################################################*/

            subTodoItem.appendChild(editSubTodoButton); 
            subTodoItem.appendChild(deleteSubTodoButton); 
            subTodosContainer.appendChild(subTodoItem);
        });

        todoItem.appendChild(subTodosContainer);
        todosHtml.appendChild(todoItem);
    });

    if (todoJson.length === 0) {
        document.querySelector('.image-1').style.display = 'block';
    } else {
        document.querySelector('.image-1').style.display = 'none';
    }
}

/* #############################################################################*/

function addTodo(name) {
    const newTodo = {
        name: name,
        status: 'pending',
        subTodos: [] 
    };
    todoJson.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todoJson));
    showTodos();
    input.value = ''; 
}

/* #############################################################################*/

function addSubTodoPrompt(todoIndex) {
    const subTodoName = prompt('Nom de la sous-tâche:');
    if (!subTodoName) return;

    const subTodoTime = prompt('Heure de la sous-tâche (HH:MM):');
    if (!subTodoTime) return;

    const newSubTodo = {
        name: subTodoName,
        time: subTodoTime,
        status: 'pending'
    };

    todoJson[todoIndex].subTodos.push(newSubTodo);
    localStorage.setItem("todos", JSON.stringify(todoJson));
    showTodos();
}

showTodos();
