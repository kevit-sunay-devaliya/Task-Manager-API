// test("Hello", () => {});

// test("failing test!", () => {
//   throw new Error("Fail");
// });

const {
  newTip,
  fahrenheitToCelsius,
  celsiusToFahrenheit,
  add,
} = require("../src/math");

test("Tip is calculated correct or not", () => {
  const result = newTip(10, 0.5);
  expect(result).toBe(15);

  // if (result !== 15) {
  //   throw new Error(`Tip must be 15 But we get ${result}`);
  // }
});

test("Tip is calculated correct or not for default tip", () => {
  const result = newTip(10);
  expect(result).toBe(12.5);
});

test("check for getting correct celsius value", () => {
  const result = fahrenheitToCelsius(32);
  expect(result).toBe(0);
});

test("check for getting correct fahrenheit value", () => {
  expect(celsiusToFahrenheit(0)).toBe(32);
});

// test("Async code demo", (done) => {
//   setTimeout(() => {
//     expect(1).toBe(2);
//     done();
//   }, 2000);
// });

test("Should add two numbers", (done) => {
  add(2, 3).then((sum) => {
    expect(sum).toBe(5);
    done();
  });
});

test("Should add two numbers async/await", async () => {
  const sum = await add(4, 5);
  expect(sum).toBe(9);
});
