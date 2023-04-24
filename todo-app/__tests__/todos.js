const request = require("supertest");
const app = require("../app");
const { Todo } = require("../models");

beforeAll(async () => {
  await Todo.sequelize.sync({ force: true });
});

afterAll(async () => {
  await Todo.sequelize.close();
});

describe("Todo Application", () => {
  beforeEach(async () => {
    await Todo.create({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
    });
  });

  afterEach(async () => {
    await Todo.destroy({ where: {} });
  });

  describe("POST /todos", () => {
    test("creates a new todo and responds with JSON", async () => {
      const response = await request(app)
        .post("/todos")
        .send({
          title: "Buy eggs",
          dueDate: new Date().toISOString(),
          completed: false,
        });
      expect(response.statusCode).toBe(200);
      expect(response.header["content-type"]).toBe(
        "application/json; charset=utf-8"
      );
      expect(response.body.title).toBe("Buy eggs");
      expect(response.body.completed).toBe(false);
      expect(response.body.id).toBeDefined();
    });
  });

  describe("PUT /todos/:id/markAsCompleted", () => {
    test("marks a todo with the given ID as completed", async () => {
      const todos = await Todo.findAll();
      const todo = todos[0];
      const response = await request(app)
        .put(`/todos/${todo.id}/markAsCompleted`)
        .send();
      expect(response.statusCode).toBe(200);
      expect(response.header["content-type"]).toBe(
        "application/json; charset=utf-8"
      );
      expect(response.body.completed).toBe(true);
    });
  });

  describe("GET /todos", () => {
    test("fetches all todos in the database", async () => {
      const response = await request(app).get("/todos");
      expect(response.statusCode).toBe(200);
      expect(response.header["content-type"]).toBe(
        "application/json; charset=utf-8"
      );
      expect(response.body.length).toBe(1);
      expect(response.body[0].title).toBe("Buy milk");
      expect(response.body[0].completed).toBe(false);
    });
  });

  describe("DELETE /todos/:id", () => {
    it("deletes a todo with the given ID if it exists and sends a boolean response", async () => {
      const todos = await Todo.findAll();
      const todo = todos[0];
      const response = await request(app).delete(`/todos/${todo.id}`);
      expect(response.statusCode).toBe(200);
      expect(response.header["content-type"]).toBe(
        "application/json; charset=utf-8"
      );
      expect(response.body).toBe(true);
      const deletedTodo = await Todo.findByPk(todo.id);
      expect(deletedTodo).toBeNull();
      const nonExistingTodoID = todo.id + 1;
      const response2 = await request(app).delete(
        `/todos/${nonExistingTodoID}`
      );
      expect(response2.statusCode).toBe(200);
      expect(response2.header["content-type"]).toBe(
        "application/json; charset=utf-8"
      );
      expect(response2.body).toBe(false);
    });
  });
});
