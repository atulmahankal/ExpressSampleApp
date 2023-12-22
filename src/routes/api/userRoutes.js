const path = require('path');

const express = require('express');
const { param, body } = require('express-validator');
const router = express.Router();
const verifyToken = require(path.join(global.rootDirectory, 'src/middleware/verifyToken'));
const verifyRole = require(path.join(global.rootDirectory, 'src/middleware/verifyRole'));
const userController = require(path.join(global.rootDirectory, 'src/controllers/api/userController'));

// Middleware to check for 'superadmin' or 'admin' role
const verifySuperAdminOrAdmin = verifyRole(['superadmin', 'admin']);

router.use(verifyToken);
router.get('/', verifySuperAdminOrAdmin, userController.getAllUsers);

router.get('/:userId',
  [param('userId').isMongoId().withMessage('Invalid user ID')],
  verifySuperAdminOrAdmin,
	userController.getUserById
);

router.post('/',
  [
    body('username')
			.notEmpty().withMessage('Username is required')
			.isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
    body('password')
			.notEmpty().withMessage('Password is required')
			.isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  ],
  verifySuperAdminOrAdmin,
	userController.createUser
);

router.put('/:userId',
  [
    param('userId').isMongoId().withMessage('Invalid user ID'),
    body('username')
			.notEmpty().withMessage('Username is required')
			.isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
    body('role')
			.notEmpty().withMessage('Role is required')
			.isLength({ min: 2 }).withMessage('Role must be at least 2 characters long'),
		body('email')
			.notEmpty().withMessage('Email is required')
			.isEmail().withMessage('Invalid email format'),
  ],
  verifySuperAdminOrAdmin,
	userController.updateUser
);

router.delete('/:userId',
  [param('userId').isMongoId().withMessage('Invalid user ID')],
  verifyRole('superadmin'),
  userController.deleteUser
);

module.exports = router;
