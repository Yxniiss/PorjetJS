// Sélectionne les éléments HTML pour l'input, le bouton "Ajouter" et des tâches
const input = document.querySelector("input");
const addButton = document.querySelector(".add-button");
const todosHtml = document.querySelector(".todos");

/* #################### VARIABLES GLOBALES #################### */

// Récupère les tâches enregistrées dans le localStorage ou initialise une liste vide si aucune tâche n'existe
let todoJson = JSON.parse(localStorage.getItem("todos")) || [];

/* #################### GESTION DES ÉVÉNEMENTS #################### */

// Détecte la touche "Entrée" pour ajouter une tâche principale
input.addEventListener("keyup", e => {
    let todo = input.value.trim();
    if (!todo || e.key !== "Enter") {
        return;
    }
    addTodo(todo);
});

// Ajoute une tâche principale lorsque l'utilisateur clique sur le bouton "Ajouter"
addButton.addEventListener("click", () => {
    let todo = input.value.trim();
    if (!todo) {
        return;
    }
    addTodo(todo);
});

/* #################### AFFICHAGE DES TÂCHES #################### */

// Affiche toutes les tâches principales et leurs sous-tâches dans la liste
function showTodos() {
    todosHtml.innerHTML = ''; // Vide le conteneur pour actualiser l'affichage

    todoJson.forEach((todo, index) => {
        // Filtre les tâches en fonction du filtre actif
        if (currentFilter === "completed" && todo.status !== "completed") return;
        if (currentFilter === "pending" && todo.status !== "pending") return;

        // Crée un élément pour chaque tâche principale
        const todoItem = document.createElement('li');
        todoItem.classList.add('todo-item');

        /* #################### ÉLÉMENTS DE LA TÂCHE PRINCIPALE #################### */

        // Crée une icône pour marquer la tâche comme "faite" ou "à faire"
        const checkContainer = document.createElement('div');
        checkContainer.classList.add('check-container');
        checkContainer.innerHTML = `<i class="fa fa-check" style="display:none;"></i>`;

        checkContainer.onclick = () => {
            todoJson[index].status = todoJson[index].status === "completed" ? "pending" : "completed";
            localStorage.setItem("todos", JSON.stringify(todoJson));
            showTodos();
        };

        // Applique le style de la tâche si elle est marquée comme "faite"
        if (todo.status === "completed") {
            checkContainer.classList.add('checked');
            checkContainer.querySelector('i').style.display = 'block';
            todoItem.classList.add('completed');
        }

        // Affiche le texte de la tâche principale
        const todoText = document.createElement('span');
        todoText.innerText = todo.name;

        /* #################### BOUTONS D'ACTION POUR LA TÂCHE #################### */

        // Bouton pour ajouter une sous-tâche
        const addSubTodoButton = document.createElement('button');
        addSubTodoButton.classList.add('add-subtodo-btn');
        addSubTodoButton.innerHTML = 'Ajouter une sous-tâche';
        addSubTodoButton.onclick = () => addSubTodoPrompt(index);

        // Bouton pour supprimer la tâche
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-btn');
        deleteButton.innerHTML = '<i class="fa fa-trash"></i>';
        deleteButton.onclick = () => {
            todoJson.splice(index, 1);
            localStorage.setItem("todos", JSON.stringify(todoJson));
            showTodos();
        };

        // Bouton pour éditer la tâche principale
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

        // Ajoute les éléments de la tâche principale dans l'élément HTML
        todoItem.appendChild(checkContainer);
        todoItem.appendChild(todoText);
        todoItem.appendChild(addSubTodoButton);
        todoItem.appendChild(editButton);
        todoItem.appendChild(deleteButton);

        /* #################### GESTION DES SOUS-TÂCHES #################### */

        // Crée un conteneur pour les sous-tâches
        const subTodosContainer = document.createElement('ul');
        subTodosContainer.classList.add('sub-todos');

        // Affiche chaque sous-tâche de la tâche principale
        todo.subTodos && todo.subTodos.forEach((subTodo, subIndex) => {
            const subTodoItem = document.createElement('li');
            subTodoItem.classList.add('sub-todo-item');

            // Applique le style de la sous-tâche si elle est marquée comme validée
            if (subTodo.status === 'completed') {
                subTodoItem.classList.add('completed');
            }

            subTodoItem.innerHTML = `
                <span>${subTodo.name}</span>
                <input type="time" class="sub-todo-time" value="${subTodo.time}">
                <button class="validate-subtodo-btn">Valider</button>
            `;

            // Bouton pour marquer la sous-tâche comme validée
            const validateButton = subTodoItem.querySelector('.validate-subtodo-btn');
            validateButton.onclick = () => {
                subTodo.status = 'completed';
                localStorage.setItem("todos", JSON.stringify(todoJson));
                showTodos();
            };

            // Bouton pour supprimer la sous-tâche
            const deleteSubTodoButton = document.createElement('button');
            deleteSubTodoButton.classList.add('delete-subtodo-btn');
            deleteSubTodoButton.innerHTML = '<i class="fa fa-trash"></i>';
            deleteSubTodoButton.onclick = () => {
                todo.subTodos.splice(subIndex, 1);
                localStorage.setItem("todos", JSON.stringify(todoJson));
                showTodos();
            };

            // Bouton pour éditer la sous-tâche
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

            // Ajoute les boutons de sous-tâche à l'élément de sous-tâche
            subTodoItem.appendChild(editSubTodoButton);
            subTodoItem.appendChild(deleteSubTodoButton);
            subTodosContainer.appendChild(subTodoItem);
        });

        // Ajoute le conteneur de sous-tâches à la tâche principale
        todoItem.appendChild(subTodosContainer);
        todosHtml.appendChild(todoItem);
    });

    //enlève l'image quand il y a une tache et la remet quand il n'y en a pas
    document.querySelector('.image-1').style.display = todoJson.length === 0 ? 'block' : 'none';
}

/* #################### FONCTIONS D'AJOUT #################### */

// Fonction pour ajouter une nouvelle tâche principale
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

// Fonction pour demander l'ajout d'une sous-tâche
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

/* #################### FILTRES #################### */

// Variable pour gérer le filtre des tâches : toutes, complétées ou en attente
let currentFilter = "all";

// Gère les filtres pour afficher uniquement les tâches en attente, complétées ou toutes
document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", (e) => {
        document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
        e.target.classList.add("active");
        currentFilter = e.target.dataset.filter;
        showTodos();
    });
});

// Affiche les tâches au chargement de la page
showTodos();
