const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const router = new express.Router();
const auth = require("../middleware/auth");
const User = require("../models/user");
const Task = require("../models/task");
const { sendWelcomeMails, sendCancelationMails } = require("../emails/account");

//CREATE ROUTE (USER)...........................................................................................................
router.post("/users", async (req, res) => {
  // console.log(req.body);
  const user = new User(req.body);

  try {
    await user.save();
    sendWelcomeMails(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({
      user: user,
      token: token,
    });
  } catch (e) {
    res.status(400).send(e);
  }
  // user.save().then(() => {
  //     res.status(201).send(user);
  // }).catch((e) => {
  //     res.status(400).send(e);
  // })
  // res.send("testing");
});

//LOGIN ROUTE (USER)................................................................................................................

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();

    res.send({
      user: user,
      token: token,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

//LOGOUT ROUTE (USER)...................................................................................................................

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

//LOGOUT ALL ROUTE (USER)..............................................................................................................

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

//READ ROUTE (USER).....................................................................................................................

router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (e) {
    res.status(500).send();
  }
  // User.find({}).then((users) => {
  //     res.send(users);
  // }).catch((e) => {
  //     res.status(500).send();
  // })
});

//PROFILE ROUTE (USER)....................................................................................................................

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

//No Need to get User By Id because We created route for get User Profile..................................

// router.get("/users/:id", async (req, res) => {
//     console.log(req.params.id);
//     const _id = req.params.id;

//     try {
//         const user = await User.findById(_id);
//         if (!user) {
//             return res.status(404).send("No user found!");
//         }
//         res.send(user);
//     }
//     catch (e) {
//         res.status(500).send();
//     }

// User.findById(_id).then((user) => {
//     if (!user) {
//         return res.status(404).send("No user found!");
//     }
//     res.send(user);
// }).catch((e) => {
//     res.status(500).send();
// })
// })

//UPDATE ROUTE (USER)........................................................................................................................

// router.patch("/users/:id", async (req, res) => {
//     const updates = Object.keys(req.body);
//     const allowedUpdates = ["name", "password", "age", "email"];
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

//     if (!isValidOperation) {
//         return res.status(400).send({ error: "Invalid Updates" });
//     }

//     try {

//         const user = await User.findByIdAndUpdate(req.params.id);
//         updates.forEach((update) => {
//             user[update] = req.body[update];
//         })
//         await user.save();

//         // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
//         if (!user) {
//             return res.status(404).send("No User Found to Update!");

//         }
//         res.send(user);
//         // res.send("hey")

//     }
//     catch (e) {
//         res.status(400).send(e);
//     }
// })

//UPDATED UPPDATE ROUTE (USER)........................................................................................................

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "password", "age", "email"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Updates" });
  }

  try {
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

//DELETE ROUTE (USER)......................................................................................................................

// router.delete("/users/:id", async (req, res) => {
//     try {
//         const user = await User.findByIdAndDelete(req.params.id);
//         if (!user) {
//             return res.status(404).send({ error: "User Not Found for Deletion!" });
//         }
//         res.send(user);
//     }
//     catch (e) {
//         res.status(400).send(e);
//     }
// })

//DELETE ROUTE UPDATED WORKABLE...............................................................................................................
router.delete("/users/me", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    sendCancelationMails(req.user.email, req.user.name);

    // const user = await User.findOneAndDelete(req.user)
    // if (!user) {
    //     return res.status(404).send({ error: "User Not Found for Deletion!" });
    // }
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

//DELETE UPDATED ROUTE (USER) ----> Not Working...........................................................................................................

// router.delete("/users/me", auth, async (req, res) => {
//     try {

//         res.send(req.user);
//         await req.user.remove()
//     }
//     catch (e) {
//         res.status(500).send();
//     }
// })

const upload = multer({
  // dest: "avatars", //Need to comment out this bcz if not than we don't get data in our ROUTE.......................................
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image"));
    }
    cb(undefined, true);
  },
});

//ROUTE for the upload image in user collection avatar field (AUTH)......................................................................
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({
        width: 250,
        height: 250,
      })
      .png()
      .toBuffer();
    req.user.avatar = buffer; //Method of file which stores image binary data
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

//RPUTE for the delete image in user collection avatar field-undefined (AUTH)..............................................................
router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});
module.exports = router;

//ROUTE for the view image in browser using URL.......................................................................................
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set("Content-Type", "image/jpg"); //Setting up the Header with content-type
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});
