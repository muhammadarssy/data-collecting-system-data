import { Response } from 'express';
import { UsersService } from './users.service';
import { sendSuccess } from '../../shared/utils/response';
import { asyncHandler } from '../../shared/middleware/error.middleware';
import { AuthRequest } from '../../shared/types';

export class UsersController {
  private usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }

  /**
   * Get current user profile
   */
  getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await this.usersService.getUserById(req.user!.id);
    return sendSuccess(res, user);
  });

  /**
   * Update current user profile
   */
  updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await this.usersService.updateProfile(req.user!.id, req.body);
    return sendSuccess(res, user, 'Profile updated successfully');
  });

  /**
   * List users (for invitation)
   */
  listUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
    const searchQuery = req.query.search as string | undefined;
    const users = await this.usersService.listUsers(searchQuery);
    return sendSuccess(res, users);
  });

  /**
   * Invite user to project
   */
  inviteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await this.usersService.inviteUserToProject(req.body, req.user!.id);
    return sendSuccess(res, result, 'User invited to project successfully');
  });

  /**
   * Remove user from project
   */
  removeUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { projectId, userId } = req.params;
    const result = await this.usersService.removeUserFromProject(projectId, userId, req.user!.id);
    return sendSuccess(res, result);
  });
}
