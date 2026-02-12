import { Router } from 'express';
import { ProjectsController } from './projects.controller';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { validateBody } from '../../shared/middleware/validation.middleware';
import { createProjectSchema, updateProjectSchema } from './projects.validation';

const router = Router();
const projectsController = new ProjectsController();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/projects
 * @desc    Create new project
 * @access  Private
 */
router.post('/', validateBody(createProjectSchema), projectsController.createProject);

/**
 * @route   GET /api/v1/projects
 * @desc    List user's projects
 * @access  Private
 */
router.get('/', projectsController.listProjects);

/**
 * @route   GET /api/v1/projects/:id
 * @desc    Get project by ID
 * @access  Private
 */
router.get('/:id', projectsController.getProject);

/**
 * @route   PUT /api/v1/projects/:id
 * @desc    Update project
 * @access  Private
 */
router.put('/:id', validateBody(updateProjectSchema), projectsController.updateProject);

/**
 * @route   DELETE /api/v1/projects/:id
 * @desc    Delete project
 * @access  Private
 */
router.delete('/:id', projectsController.deleteProject);

/**
 * @route   GET /api/v1/projects/:id/users
 * @desc    Get project users
 * @access  Private
 */
router.get('/:id/users', projectsController.getProjectUsers);

export default router;
