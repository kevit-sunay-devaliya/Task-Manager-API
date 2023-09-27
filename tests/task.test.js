const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/models/task");

const {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  setUpDatabase,
} = require("./fixtures/db");

beforeEach(setUpDatabase);

//CREATE TASK USING (AUTH) FOR TESTING.........................................................................................................
test("should create task for user", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "For Testing",
    })
    .expect(201);

  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
});

//READ TASKS OF PERTICULAR USER USING (AUTH) FOR TESTING.........................................................................................................
test("should fetch user tasks", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  //   console.log(response.body);
  expect(response.body.length).toEqual(2);
});

//TRY TO DELETE TASK WHICH IS NOT YOURS (AUTH) FOR TESTING..................................................................................................
test("should not delete other users tasks", async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);

  //   console.log(response.body);
  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});
