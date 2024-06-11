function fetchAndDisplayRecipes() {
  fetch("/api/recipes")
    .then(response => response.json())
    .then(data => {
      const recipesTableBody = document.querySelector('#recipesTable tbody');
      recipesTableBody.innerHTML = '';
      data.forEach(recipe => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${recipe.title}</td>
            <td>${recipe.ingredients}</td>
            <td>${recipe.instructions}</td>
            <td>${recipe.cookingTime}</td>
            <td>
              <button onclick="editRecipe('${recipe._id}')">Edit</button>
              <button onclick="deleteRecipe('${recipe._id}')">Delete</button>
            </td>
          `;
        recipesTableBody.appendChild(row);
      });
    })
    .catch(error => {
      console.error("Error fetching recipes:", error);
    });
}

document.querySelector('#newRecipeForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const formData = new FormData(this);
  const newRecipe = {
    title: formData.get('title'),
    ingredients: formData.get('ingredients').split(','),
    instructions: formData.get('instructions'),
    cookingTime: parseInt(formData.get('cookingTime'))
  };

  fetch("/api/recipes", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newRecipe)
  })
    .then(response => response.json())
    .then(data => {
      console.log("New recipe added:", data);
      fetchAndDisplayRecipes();
      this.reset();
    })
    .catch(error => {
      console.error("Error adding recipe:", error);
    });
});

function editRecipe(id) {
  // Fetch the original recipe to edit
  fetch(`/api/recipes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(response => response.json())
    .then(recipe => {
      // Populate form fields with original recipe details
      document.querySelector('#title').value = recipe.title;
      document.querySelector('#ingredients').value = recipe.ingredients;
      document.querySelector('#instructions').value = recipe.instructions;
      document.querySelector('#cookingTime').value = recipe.cookingTime;

      // Handle form submission
      document.querySelector('#newRecipeForm').onsubmit = function (event) {
        event.preventDefault();

        // Prepare updated recipe from form data
        const formData = new FormData(this);
        const updatedRecipe = {
          title: formData.get('title'),
          ingredients: formData.get('ingredients').split(','),
          instructions: formData.get('instructions'),
          cookingTime: parseInt(formData.get('cookingTime'))
        };

        // Make PUT request to update recipe
        fetch(`/api/recipes/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedRecipe)
        })
          .then(response => response.json())
          .then(data => {
            // Recipe successfully updated
            console.log("Recipe updated:", data);

            // Delete original recipe
            deleteRecipe(id);

            // Fetch and display updated recipes
            fetchAndDisplayRecipes();

            // Reset form fields
            document.querySelector('#newRecipeForm').reset();
          })
          .catch(error => {
            console.error("Error updating recipe:", error);
          });
      };
    })
    .catch(error => {
      console.error("Error fetching recipe for editing:", error);
    });
}


function deleteRecipe(id) {
  if (confirm("Are you sure you want to delete this recipe?")) {
    fetch(`/api/recipes/${id}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        console.log("Recipe deleted:", data);
        fetchAndDisplayRecipes();
      })
      .catch(error => {
        console.error("Error deleting recipe:", error);
      });
  }
}

fetchAndDisplayRecipes();
