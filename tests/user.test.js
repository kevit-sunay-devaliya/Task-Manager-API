const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { userOneId, userOne, setUpDatabase } = require("./fixtures/db");

beforeEach(setUpDatabase);

//SIGNUP ROUTE FOR TESTING.....................................................................................................
test("should signup new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "shivam",
      email: "shivam.devaliya@kevit.io",
      password: "shivam12345",
    })
    .expect(201);

  //Assert that the database changed correctly........
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  //Assertions about the response..........

  //   expect(response.body.user.name).toBe("shivam"); for single-single property
  expect(response.body).toMatchObject({
    user: {
      name: "shivam",
      email: "shivam.devaliya@kevit.io",
    },
    token: user.tokens[0].token,
  });

  expect(response.body.password).not.toBe("shivam12345");
});

//LOGIN ROUTE FOR TESTING.....................................................................................................
test("should user login", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(response.body.token).toBe(user.tokens[1].token);
});

//USER NOT LOGIN ROUTE FOR TESTING.....................................................................................................
test("should not login non existing user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: "incorrectPassword",
    })
    .expect(400);
});

//READ PROFILE (AUTH) ROUTE FOR TESTING.....................................................................................................
test("should get profile for user using auth", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

// READ PROFILE BUT NOT GET (AUTH) ROUTE FOR TESTING.....................................................................................................
test("should not get profile for unauthenticated user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

//DELETE (AUTH) ROUTE FOR TESTING.....................................................................................................
test("should delete profile for user using auth", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

// DELETE PROFILE BUT NOT GET (AUTH) ROUTE FOR TESTING.....................................................................................................
test("should not delete profile for unauthenticated user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

//UPLOAD PROFILE PICTURE (AUTH) ROUTE FOR TESTING.............................................................................................
test("should upload profile picture", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer)); //check avatar contains as a Buffer or not -->>true
});

//UPDATE USER (AUTH) ROUTE FOR TESTING.............................................................................................................
test("should update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "SD",
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toEqual("SD");
  //   expect(user.name).toBe("SD");
});

//toBe -->  1 === 1 , {} === {} -->false
//toEqual --> {} equal {}

//UPDATE NOT EXISTING FIELD (AUTH) ROUTE FOR TESTING.........................................................................................
test("should not update Invalid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: "Surat",
    })
    .expect(400);
});
