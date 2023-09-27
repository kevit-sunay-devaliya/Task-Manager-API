const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { userOne, userOneId, setUpDatabase } = require("./fixtures/db");

beforeEach(setUpDatabase);

test("Should not signup with invalid name/email/password", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "sunay",
      email: "@sunay123.com",
      password: "password",
    })
    .expect(400);
});

test("Should not update user if unauthenticated", async () => {
  await request(app)
    .patch("/users/me")
    .send({
      name: "sunay",
    })
    .expect(401);
});

test("Should not update user with invalid name/email/password", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      email: "sunaygmail.com@",
    })
    .expect(400);
});

test("Should not delete user if unauthenticated", async () => {
  await request(app)
    .delete("/users/me")
    .send({
      name: "sunay",
    })
    .expect(401);
});
