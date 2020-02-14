const express = require("express");

const db = require("../data/helpers/projectModel");

const router = express.Router();

//GET all projects
router.get("/", (req, res) => {
  const { id } = req.params;
  db.get(id)
    .then(projects => {
      res.status(200).json(projects);
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Unable to retrieve actions" });
    });
});

//POST a project
router.post("/", validatePost, (req, res) => {
  db.insert(req.body)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Couldn't post project." });
    });
});

//UPDATE a project
router.put("/:id", validatePost, (req, res) => {
  const { id } = req.params;
  db.update(id, req.body)
    .then(update => {
      res.status(200).json(req.body);
    })
    .catch(err => {
      res
        .status(500)
        .json({ errorMessage: "Project info couldn't be updated." });
    });
});

//DELETE a project
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(data => {
      res.status(200).json(data); // returns # of deleted projects
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Couldn't delete project." });
    });
});

router.get("/:id/actions", (req, res) => {
  const { id } = req.params;
  db.getProjectActions(id)
    .then(actions => {
      res.status(200).json(actions);
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Couldn't load project's actions" });
    });
});

//custom middleware
function validatePost(req, res, next) {
  const newPost = req.body;
  if (!newPost.name || !newPost.description) {
    res.status(400).json({ errorMessage: "Missing name or description." });
  }
  next();
}

module.exports = router;
