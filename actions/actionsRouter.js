const express = require("express");

const db = require("../data/helpers/actionModel");

const postDb = require("../data/helpers/projectModel");

const router = express.Router();

//GET all actions
router.get("/", (req, res) => {
  const { id } = req.params;
  db.get(id)
    .then(actions => {
      res.status(200).json(actions);
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Unable to retrieve actions" });
    });
});

//POST an action
router.post("/postId=:id", validateAction, (req, res) => {
  const newAction = req.body;
  const { id } = req.params;
  console.log(id);
  console.log(newAction);
  postDb
    .get(id)
    .then(post => {
      if (id === newAction.project_id.toString()) {
        db.insert(newAction)
          .then(action => {
            res.status(200).json(action);
          })
          .catch(err => {
            res.status(500).json({ errorMessage: "Couldn't post action" });
          });
      } else {
        res.status(400).json({ errorMessage: "No post found." });
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Unable to post action. " });
    });
});

//UPDATE an action
router.put("/:id", validateAction, validateActionId, (req, res) => {
  const { id } = req.params;
  db.update(id, req.body)
    .then(update => {
      res.status(200).json(req.body);
    })
    .catch(err => {
      res
        .status(500)
        .json({ errorMessage: "Action info couldn't be updated." });
    });
});

//DELETE an action
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(data => {
      res.status(200).json(data); // returns # of deleted actions
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Couldn't delete action." });
    });
});

//custom middleware
function validateActionId(req, res, next) {
  const { id } = req.params;
  db.get(id).then(action => {
    if (!action) {
      res.status(400).send(null);
    } else {
      next();
    }
  });
}

function validateAction(req, res, next) {
  const newAction = req.body;
  if (!newAction.project_id || !newAction.notes || !newAction.description) {
    res
      .status(400)
      .json({ errorMessage: "Missing project ID, notes, or description." });
  } else if (newAction.description.length > 128) {
    res
      .status(400)
      .json({ errorMessage: "Description: Max characters exceeded." });
  } else {
    next();
  }
}
module.exports = router;
