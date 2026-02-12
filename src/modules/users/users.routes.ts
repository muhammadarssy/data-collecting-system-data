import { Router } from 'express';
import { UsersController } from './users.controller';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { validateBody } from '../../shared/middleware/validation.middleware';
import { updateProfileSchema, inviteUserSchema } from './users.validation';

const router = Router();
const usersController = new UsersController();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', usersController.getProfile);

/**
 * @route   PUT /api/v1/users/profile
 * @desc    Update current user profile
 * @access  Private
 */
router.put('/profile', validateBody(updateProfileSchema), usersController.updateProfile);

/**
 * @route   GET /api/v1/users
 * @desc    List users (for invitation)
 * @access  Private
 */
router.get('/', usersController.listUsers);

/**
 * @route   POST /api/v1/users/invite
 * @desc    Invite user to project
 * @access  Private
 */
router.post('/invite', validateBody(inviteUserSchema), usersController.inviteUser);

/**
 * @route   DELETE /api/v1/users/:projectId/:userId
 * @desc    Remove user from project
 * @access  Private
 */
router.delete('/:projectId/:userId', usersController.removeUser);

export default router;
