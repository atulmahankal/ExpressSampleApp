const path = require('path');

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const authController = require(path.join(global.rootDirectory, 'src/controllers/authController'));

router.post(
  '/register',
  [
    body('username')
			.notEmpty().withMessage('Username is required')
			.isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
		body('email')
			.notEmpty().withMessage('Email is required')
			.isEmail().withMessage('Invalid email format'),
  ],
  authController.register
);

router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  authController.login
);

module.exports = router;
