import express from 'express';

const router = express.Router();

function index(req, res) {
  res.render('index', {
    title: 'SanityCheck.it'
  });
}

router.get('/', index);

module.exports = (app) => {
  app.use('/', router);
};
