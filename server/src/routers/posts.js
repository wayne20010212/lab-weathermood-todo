const express = require('express');
const bodyParser = require('body-parser');

const postModel = require('../model/posts.js');
const voteModel = require('../model/votes.js');
const todoModel = require('../model/todos.js');

const router = express.Router();

router.use(bodyParser.json());

// List
router.get('/posts', function (req, res, next) {
  postModel
    .list(req.query.searchText)
    .then((posts) => {
      res.json(posts);
    })
    .catch(next);
});



// Vote
router.post(
  '/posts/:id/:mood(clear|clouds|drizzle|rain|thunder|snow|windy)Votes',
  function (req, res, next) {
    const { id, mood } = req.params;
    if (!id || !mood) {
      const err = new Error('Post ID and mood are required');
      err.status = 400;
      throw err;
    }
    voteModel
      .create(id, mood)
      .then((post) => {
        res.json(post);
      })
      .catch(next);
  }
);

router.get('/todos', function(req, res, next){
  // const {unaccomplishedOnly, searchText} = req.query;
  todoModel
    .list(req.query.unaccomplishedOnly, req.query.searchText)
    .then((todos)=>{
      res.json(todos);
    })
    .catch(next);
});

// Create
router.post('/posts', function (req, res, next) {
  const { mood, text } = req.body;
  if (!mood || !text) {
    const err = new Error('Mood and text are required');
    err.status = 400;
    throw err;
  }
  postModel
    .create(mood, text)
    .then((post) => {
      res.json(post);
    })
    .catch(next);
});

router.post('/todos', function(req, res, next){
  console.log(`ouo`);
  const {mood, text} = req.body;
  
  if(!mood || !text){
    const err = new Error('Mood and text are required');
    err.status = 400;
    throw err;
  }
  todoModel
    .create(mood, text)
    .then((todo)=>{
      res.json(todo);
    })
    .catch(next);
});

router.post('/todos/:id', function(req, res, next){
  const {id} = req.params;
  console.log(id);
  if(!id){
    const err = new Error('Todo ID are required');
    err.status = 400;
    throw err;
  }

  todoModel
    .accomplish(id)
    .then((todo)=>{
      res.json(todo);
    })
    .catch(next);
});

module.exports = router;
