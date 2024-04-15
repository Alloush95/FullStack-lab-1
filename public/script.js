// Define fetchRecipes globally
function fetchRecipes(){
    fetch("/api/recipes")
    .then(response => response.json())
    .then(recipes => {
        const recipeTableBody = document.getElementById("recipe-table-body");
        recipeTableBody.innerHTML = recipes.map(recipe => `
            <tr data-id="${recipe._id}">
                <td>${recipe.title}</td>
                <td>${recipe.ingredients}</td>
                <td>${recipe.instructions}</td>
                <td>${recipe.cookingTime}</td>

                <td>
                    <button onclick="updateRecipe('${recipe._id}')">Update</button>
                    <button onclick="deleteRecipe('${recipe._id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    })
    .catch(error => console.error("Error fetching recipes:", error));
}

// Event listener
document.addEventListener("DOMContentLoaded", () => {
    const addRecipeForm = document.getElementById("add-recipe-form");

    addRecipeForm.addEventListener("submit", event => {
        event.preventDefault();
        const formData = new FormData(addRecipeForm);
        const newRecipe = Object.fromEntries(formData);

        fetch('/api/recipes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRecipe)
        })
        .then(response => response.ok ? fetchRecipes() : Promise.reject('Failed to add recipe'))// If the response is OK, fetch the recipes
        .then(() => addRecipeForm.reset())
        .catch(error => console.error('Error adding recipe:', error));
    });

    // Initial fetch of recipes
    fetchRecipes();
});

function updateRecipe(id) {
    const row = document.querySelector(`#recipe-table-body tr[data-id="${id}"]`);// Get the row with the recipe ID
    row.querySelectorAll('td').forEach((td) => {
        const textarea = document.createElement('textarea');
        textarea.value = td.textContent.trim();
        td.textContent = '';
        td.appendChild(textarea);
    });

    const saveButton = createButton('Save', () => saveRecipe(id), 'saveButtonId');
    const cancelButton = createButton('Cancel', () => cancelUpdate(), 'cancelButtonId');

    row.querySelector('td:last-child').innerHTML = ''; // Clear the last cell
    row.querySelector('td:last-child').append(saveButton, cancelButton);
}

function cancelUpdate() {
    fetchRecipes();
}

function saveRecipe(id) {
    const row = document.querySelector(`#recipe-table-body tr[data-id="${id}"]`);
    const inputs = row.querySelectorAll('textarea');
    const updatedRecipe = {
        title: inputs[0].value,
        ingredients: inputs[1].value.split('\n'),
        instructions: inputs[2].value,
        cookingTime: inputs[3] ? inputs[3].value : "" // Ensure cookingTime is set, even if not provided in the textarea
    };
    fetch(`/api/recipes/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        
        body: JSON.stringify(updatedRecipe)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update recipe');
        }
        return response.json();
    })
    .then(confirm('are you sure you want to update this recipe?'))
    .then(() => fetchRecipes())
    .catch(error => console.error('Error updating recipe:', error));
}

function deleteRecipe(id) {
    console.log(id);
    if (confirm("Are you sure you want to delete this recipe?")) {
        fetch(`/api/recipes/${id}`, {
            method: "DELETE"
        })
        
        
    }
    location.reload();// Refresh the page
}

function createButton(text, onClick, id) {
    const button = document.createElement('button');
    button.innerText = text;
    button.onclick = onClick;
    button.id = id; // Set the ID
    return button;
}
