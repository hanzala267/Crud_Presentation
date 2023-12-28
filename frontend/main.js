// Import the CSS file to apply styles to the HTML elements
import './style.css';

// Wait for the DOM content to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', async () => {
  // Get references to the HTML elements
  const tableBody = document.querySelector('#tableBody'); // Table body where user data will be displayed
  const userForm = document.getElementById('userForm'); // Form for adding new users

  // Function to fetch user data from the server
  async function fetchUsers() {
    try {
      const response = await fetch('http://localhost:3002/api/users');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  // Function to render the user data in the HTML table
  async function renderUsers() {
    const users = await fetchUsers();
    tableBody.innerHTML = ''; // Clear the existing table content

    // Loop through each user and create a table row for them
    users.forEach((user) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="py-4 px-2 text-black">${user.id}</td>
        <td class="py-4 px-6 text-black">${user.name}</td>
        <td class="py-4 px-6 text-black">${user.email}</td>
        <td class="py-4 px-2 text-black">
          <button data-id="${user.id}" class="edit-btn text-white bg-red-700 py-2 px-4 rounded-lg">Edit</button>
        </td>
        <td class="py-4 px-2">
          <button data-id="${user.id}" class="delete-btn text-white bg-green-700 py-2 px-4 rounded-lg">Delete</button>
        </td>
      `;

      tableBody.appendChild(row);
    });

    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach((btn) => {
      btn.addEventListener('click', handleEdit);
    });

    document.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', handleDelete);
    });
  }

  // Function to handle the deletion of a user
  async function handleDelete(event) {
    const userId = event.target.getAttribute('data-id');

    try {
      // Send a DELETE request to the server to delete the user
      await fetch(`http://localhost:3002/api/users/${userId}`, {
        method: 'DELETE',
      });
      renderUsers(); // Refresh the user list after deletion
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  // Function to handle the editing of a user
  async function handleEdit(event) {
    const userId = event.target.getAttribute('data-id');
    const newName = prompt('Enter new name:');
    const newEmail = prompt('Enter new email:');

    try {
      // Send a PUT request to the server to update the user information
      await fetch(`http://localhost:3002/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName, email: newEmail }),
      });
      renderUsers(); // Refresh the user list after editing
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }

  // Function to handle the form submission for adding a new user
  async function handleSubmitForm(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the user input from the form
    const name = document.getElementById('nameInput').value;
    const email = document.getElementById('emailInput').value;

    try {
      // Send a POST request to the server to add a new user
      const response = await fetch('http://localhost:3002/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      // Check if the request was successful
      if (response.ok) {
        renderUsers(); // Refresh the user list after adding a new user
      } else {
        console.error('Error submitting form:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }

  // Add a form submission event listener
  userForm.addEventListener('submit', handleSubmitForm);

  // Initial render of user data when the page loads
  renderUsers();
});
