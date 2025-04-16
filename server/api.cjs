/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user.cjs");
const Assignment = require("./models/assignment.cjs");
const Homework = require("./models/homework.cjs");
const Cat = require("./models/cat.cjs");
const AssignmentComment = require("./models/assignment_comment.cjs");
const SoftwareComment = require("./models/software_comment.cjs");

// import authentication library
const auth = require("./auth.cjs");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket.cjs");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user)
    socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

router.get("/user/:userid", (req, res) => {
  User.findOne({ _id: req.params.userid }).then((user) => {
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ msg: "User not found" });
    }
  });
});

router.post("/user/:userid", (req, res) => {
  User.findOne({ _id: req.params.userid }).then((user) => {
    if (user) {
      let newUser = user;
      if (req.body.level) user.level = req.body.level;
      if (req.body.exp) user.exp = req.body.exp;
      if (req.body.name) newUser.name = req.body.name;
      user.save().then((user) => {
        res.send(user);
      });
    } else {
      res.status(404).send({ msg: "User not found" });
    }
  });
})

router.post("/assignment/claim", auth.ensureLoggedIn, (req, res) => {
  // check if homework already exists
  Homework.findOne({
    title: req.body.title,
    course: req.body.course,
    platform: req.body.platform,
  }).then((existingHomework) => {
    let newAssignment = new Assignment({})
    if (existingHomework) {
      newAssignment = Assignment({
        user_id: req.user._id,
        platform: existingHomework.platform,
        course: existingHomework.course,
        title: existingHomework.title,
        due: existingHomework.due,
        submitted: req.body.submitted,
        url: existingHomework.url,
        create: Date.now() / 1000,
        rating: -1,
        catType: req.body.catType,
        parent: existingHomework._id,
      })

      if (!existingHomework.users.includes(req.user._id)) {
        existingHomework.users.push(req.user._id);
      }
      existingHomework.save().then(() =>
        newAssignment.save().then((assignment) => {
          res.send(assignment);
        })
      );
    } else {
      newAssignment = new Assignment({
        user_id: req.user._id,
        platform: req.body.platform,
        course: req.body.course,
        title: req.body.title,
        due: req.body.due,
        submitted: req.body.submitted,
        url: req.body.url,
        create: Date.now() / 1000,
        rating: -1,
        catType: req.body.catType,
      });

      let newHomework = new Homework({
        users: [req.user._id],
        platform: req.body.platform,
        course: req.body.course,
        title: req.body.title,
        due: req.body.due,
        url: req.body.url,
        ratingSum: 0,
        ratingNumber: 0,
        catType: req.body.catType,
      });

      newHomework.save().then(() =>
        newAssignment.save().then((assignment) => {
          res.send(assignment);
        })
      );
    }
  })
});

router.post("/assignment/reject", auth.ensureLoggedIn, (req, res) => {
  // check if homework already exists
  Homework.findOne({
    title: req.body.title,
    course: req.body.course,
    platform: req.body.platform,
  }).then((existingHomework) => {
    if (existingHomework) {
      // remove user from homework
      const index = existingHomework.users.indexOf(req.user._id);
      if (index !== -1) {
        existingHomework.users.splice(index, 1);
      }
      existingHomework.save().then(() => {
        // remove assignment
        Assignment.findOneAndDelete({
          user_id: req.user._id,
          platform: req.body.platform,
          course: req.body.course,
          title: req.body.title,
        }).then((assignment) => {
          if (assignment) {
            res.send(assignment);
          } else {
            res.status(404).send({ msg: "Assignment not found" });
          }
        }
        );
      });
    } else {
      res.status(404).send({ msg: "Homework not found" });
    }
  });
});

router.get("/assignment/comment/:homeworkid", (req, res) => {
  AssignmentComment.find({ parent: req.params.homeworkid }).then((comments) => {
    res.send(comments);
  });
});

router.post("/assignment/comment", auth.ensureLoggedIn, (req, res) => {
  const newComment = new AssignmentComment({
    creator_id: req.user._id,
    creator_name: req.user.name,
    creator_badge: req.user.currentBadge,
    is_annonymous: req.body.is_annonymous,
    content: req.body.content,
    parent: req.body.parent,
    rating: req.body.rating,
    created_at: Date.now() / 1000,
  });


  if (newComment.parent === null) {
    throw new Error("Should link to a parent homework");
  }

  if (newComment.is_annonymous) {
    newComment.creator_name = "Anonymous";
    newComment.creator_badge = -1;
    newComment.creator_id = null;
  }
  newComment.save().then((comment) => {
    // update the homework rating
    Homework.findOne({ _id: comment.parent }).then((homework) => {
      homework.ratingSum += comment.rating;
      homework.ratingNumber += 1;
      homework.rating = homework.ratingSum / homework.ratingNumber;
      homework.save();
    }).finally(() => {
      res.send(comment);
    });
  });
});

router.get("/assignments", (req, res) => {
  Assignment.find({ user_id: req.user._id }).then((assignments) => {
    res.send(assignments);
  });
});

router.get("/homework/:homeworkid", (req, res) => {
  Homework.findOne({ _id: req.params.homeworkid }).then((homework) => {
    if (homework) {
      res.send(homework);
    } else {
      res.status(404).send({ msg: "Homework not found" });
    }
  });
});

router.get("/comments", (req, res) => {
  SoftwareComment.find({}).then((comments) => {
    res.send(comments);
  });
});

router.post("/comments/new", auth.ensureLoggedIn, (req, res) => {
  const newComment = new SoftwareComment({
    creator_id: req.user._id,
    creator_name: req.user.name,
    content: req.body.content,
    rating: req.body.rating,
    created_at: Date.now() / 1000,
  });

  newComment.save().then((comment) => {
    res.send(comment);
  });
}
);

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
