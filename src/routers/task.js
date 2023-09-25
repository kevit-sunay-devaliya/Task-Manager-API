const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const Task = require("../models/task");

//CREATE ROUTE (TASK)............................................................................................................
router.post("/tasks", auth, async (req, res) => {
  // console.log(req.body);
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }

  // task.save().then(() => {
  //     res.status(201).send(task);
  // }).catch((e) => {
  //     res.status(400).send(e);
  // })
  // res.send("testing");
});

//READ ROUTE (TASK)........................................................................................................

// router.get("/tasks", async (req, res) => {

//     try {
//         const tasks = await Task.find();
//         res.send(tasks);

//     }
//     catch (e) {
//         res.status(500).send();
//     }

// Task.find().then((tasks) => {
//     res.send(tasks);
// }).catch((e) => {
//     res.status(500).send();
// })
// })

//UPDATED READ ROUTE FOR ALL (AUTH USER).........................................................................................................

// /tasks?completed=true ROUTE.......................................................................................
// /tasks?limit=10&skip=10 ROUTE....................................................................................
// /tasks?sortBy=createdAt:desc ROUTE................................................................................
router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const srt = {};

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    srt[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }
  try {
    // const tasks = await Task.find({
    //   owner: req.user._id,
    // });
    await req.user.populate({
      path: "tasks",
      match: match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort: srt,
      },
    });
    res.send(req.user.tasks);
    // res.send(tasks);
  } catch (e) {
    res.status(500).send();
  }

  // Task.find().then((tasks) => {
  //     res.send(tasks);
  // }).catch((e) => {
  //     res.status(500).send();
  // })
});

// router.get("/tasks/:id", async (req, res) => {
//     // console.log(req.params.id);
//     const _id = req.params.id;

//     try {
//         const task = await Task.findById(_id);
//         if (!task) {
//             return res.status(404).send("No Task found!");
//         }
//         res.send(task);
//     }
//     catch (e) {
//         res.status(500).send();
//     }

//     // Task.findById(_id).then((task) => {
//     //     if (!task) {
//     //         return res.status(404).send("No Task found!");
//     //     }
//     //     res.send(task);
//     // }).catch((e) => {
//     //     res.status(500).send();
//     // })
// })

//UPDATED READ TASK ROUTE (AUTH USER).............................................................................................
router.get("/tasks/:id", auth, async (req, res) => {
  // console.log(req.params.id);
  const _id = req.params.id;

  try {
    const task = await Task.findOne({
      _id: _id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send("No Task found!");
    }
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }

  // Task.findById(_id).then((task) => {
  //     if (!task) {
  //         return res.status(404).send("No Task found!");
  //     }
  //     res.send(task);
  // }).catch((e) => {
  //     res.status(500).send();
  // })
});

//UPDATE ROUTE (TASK)...................................................................................................................

// router.patch("/tasks/:id", async (req, res) => {
//     const updates = Object.keys(req.body);
//     const allowedUpdates = ["description", "completed"];
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

//     if (!isValidOperation) {
//         return res.status(400).send({ error: "Invalid Updates!" });
//     }

//     try {
//         // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
//         const task = await Task.findByIdAndUpdate(req.params.id);
//         updates.forEach((update) => {
//             task[update] = req.body[update];
//         })
//         await task.save();

//         if (!task) {
//             return res.status(404).send("No Task Found to Update!");
//         }
//         res.send(task);
//     }
//     catch (e) {
//         res.status(400).send(e);
//     }
// })

//UPDATED UPDATE ROUTE (AUTH USER)..........................................................................................................

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Updates!" });
  }

  try {
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).send("No Task Found to Update!");
    }
    updates.forEach((update) => {
      task[update] = req.body[update];
    });
    await task.save();

    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

//DELETE ROUTE (TASK).........................................................................................................................

// router.delete("/tasks/:id", async (req, res) => {
//     try {
//         const task = await Task.findByIdAndDelete(req.params.id);
//         if (!task) {
//             return res.status(404).send("Task Not Found for deletion!");
//         }
//         res.send(task);
//     }
//     catch (e) {
//         res.status(400).send(e);
//     }
// })

//UPDATED DELETE ROUTE (AUTH USER)..................................................................................................................

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send("Task Not Found for deletion!");
    }
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
