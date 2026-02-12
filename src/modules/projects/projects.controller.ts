import { Response } from 'express';
import { ProjectsService } from './projects.service';
import { sendSuccess, sendCreated } from '../../shared/utils/response';
import { asyncHandler } from '../../shared/middleware/error.middleware';
import { AuthRequest } from '../../shared/types';

export class ProjectsController {
  private projectsService: ProjectsService;

  constructor() {
    this.projectsService = new ProjectsService();
  }

  /**
   * Create new project
   */
  createProject = asyncHandler(async (req: AuthRequest, res: Response) => {
    const project = await this.projectsService.createProject(req.body, req.user!.id);
    return sendCreated(res, project, 'Project created successfully');
  });

  /**
   * Get project by ID
   */
  getProject = asyncHandler(async (req: AuthRequest, res: Response) => {
    const project = await this.projectsService.getProjectById(req.params.id, req.user!.id);
    return sendSuccess(res, project);
  });

  /**
   * List user's projects
   */
  listProjects = asyncHandler(async (req: AuthRequest, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const projects = await this.projectsService.listUserProjects(req.user!.id, page, limit);
    return sendSuccess(res, projects);
  });

  /**
   * Update project
   */
  updateProject = asyncHandler(async (req: AuthRequest, res: Response) => {
    const project = await this.projectsService.updateProject(
      req.params.id,
      req.body,
      req.user!.id
    );
    return sendSuccess(res, project, 'Project updated successfully');
  });

  /**
   * Delete project
   */
  deleteProject = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await this.projectsService.deleteProject(req.params.id, req.user!.id);
    return sendSuccess(res, result);
  });

  /**
   * Get project users
   */
  getProjectUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
    const users = await this.projectsService.getProjectUsers(req.params.id, req.user!.id);
    return sendSuccess(res, users);
  });
}
