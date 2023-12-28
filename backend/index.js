import express from 'express';
import mysql from 'mysql2';
import { promisify } from 'util';
import cors from 'cors'; //Cross-Origin Resource Sharing is the mechanism that allows a web page to share resources across different origins

const app = express();
const port = 3002;
app.use(cors());
app.use(express.json());  // Add this line to parse JSON requests
app.use(express.urlencoded({ extended: true }));  // Add this line to parse URL-encoded requests. It is used for processing form data submitted through HTML forms.


// Create a MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test123',
});

// Promisify MySQL queries
const queryAsync = promisify(db.query).bind(db); //To get back a promise-based version of the db.query function.

// Define a route to get all users from the database
app.get('/api/users', async (req, res) => {
  try {
    const results = await queryAsync('SELECT * FROM users');
    res.json(results);
  } catch (err) {
    console.error('Error executing query: ', err);
    res.status(500).send('Error retrieving data from the database');
  }
});


// Define a route to delete a user by ID
app.delete('/api/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id); //req.params.id will give you the value of the id parameter from the URL.

  try {
    // Example query to delete a user from the database
    await queryAsync('DELETE FROM users WHERE id = ?', [userId]);

    // Retrieve the updated list of users
    const updatedResults = await queryAsync('SELECT * FROM users');
    res.json(updatedResults);
  } catch (err) {
    console.error('Error executing delete query: ', err);
    res.status(500).send('Error deleting user from the database');
  }
});


// Define a route to add a new user
app.post('/api/users', async (req, res) => {
  const { name, email } = req.body;

  try {
    // Example query to insert a new user into the database using async/await
    const result = await queryAsync('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);

    // Assuming the user is successfully added, you can send a response
    res.status(201).json({ message: 'User added successfully', userId: result.insertId });
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send('Error adding user to the database');
  }
});

// Define a route to update a user by ID
app.put('/api/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email } = req.body;

  try {
    // Example query to update a user in the database
    await queryAsync('UPDATE users SET name = ?, email = ? WHERE id = ?', [
      name,
      email,
      userId,
    ]);

    // Retrieve the updated list of users
    const updatedResults = await queryAsync('SELECT * FROM users');
    res.json(updatedResults);
  } catch (err) {
    console.error('Error executing update query: ', err);
    res.status(500).send('Error updating user in the database');
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
