import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { sendSuccess, sendCreated } from '../../shared/utils/response';
import { asyncHandler } from '../../shared/middleware/error.middleware';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Register a new user
   */
  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.authService.register(req.body);
    return sendCreated(res, result, 'User registered successfully');
  });

  /**
   * Login user
   */
  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.authService.login(req.body);
    return sendSuccess(res, result, 'Login successful');
  });

  /**
   * Refresh access token
   */
  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const result = await this.authService.refreshToken(refreshToken);
    return sendSuccess(res, result, 'Token refreshed successfully');
  });

  /**
   * Get current user profile
   */
  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    return sendSuccess(res, user, 'Profile retrieved successfully');
  });
}
