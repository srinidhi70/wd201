const express = require("express");
const bodyParser = require("body-parser");
const { Todo } = require("./models");

const app = express();

// Middleware to parse request bodies as JSON
app.use(bodyParser.json());

// Route to handle root path
app.get("/", function (req, res) {
  res.send("Hello World");
});

// Route to fetch all todos
app.get("/todos", async function (req, res) {
  try {
    const todos = await Todo.findAll();
    res.send(todos);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// Route to fetch a specific todo by ID
app.get("/todos/:id", async function (req, res) {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (!todo) {
      return res.status(404).send();
    }
    res.json(todo);
  } catch (error) {
    console.log(error);
    res.status(422).json(error);
  }
});

// Route to create a new todo
app.post("/todos", async function (req, res) {
  try {
    const todo = await Todo.create(req.body);
    res.json(todo);
  } catch (error) {
    console.log(error);
    res.status(422).json(error);
  }
});

// Route to mark a todo as completed
app.put("/todos/:id/markAsCompleted", async function (req, res) {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (!todo) {
      return res.status(404).send();
    }
    const updatedTodo = await todo.update({ completed: true });
    res.json(updatedTodo);
  } catch (error) {
    console.log(error);
    res.status(422).json(error);
  }
});

// Route to delete a todo by ID
app.delete("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    if (todo) {
      await todo.destroy();
      response.send(true);
    } else {
      response.send(false);
    }
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
});

module.exports = app;
