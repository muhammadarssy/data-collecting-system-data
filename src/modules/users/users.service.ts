import bcrypt from 'bcryptjs';
import prisma from '../../config/database';
import { AppError } from '../../shared/middleware/error.middleware';
import { UpdateProfileInput, InviteUserInput } from './users.validation';

export class UsersService {
  /**
   * Get user by ID
   */
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: UpdateProfileInput) {
    const updateData: any = {};

    if (data.email) {
      // Check if email already exists
      const existingUser = await prisma.user.findFirst({
        where: { email: data.email, NOT: { id: userId } },
      });

      if (existingUser) {
        throw new AppError('Email already exists', 400);
      }

      updateData.email = data.email;
    }

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    return user;
  }

  /**
   * List all users (for admin or project invitation)
   */
  async listUsers(searchQuery?: string) {
    const users = await prisma.user.findMany({
      where: searchQuery
        ? {
            OR: [
              { username: { contains: searchQuery, mode: 'insensitive' } },
              { email: { contains: searchQuery, mode: 'insensitive' } },
            ],
          }
        : undefined,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return users;
  }

  /**
   * Invite user to project
   */
  async inviteUserToProject(data: InviteUserInput, inviterId: string) {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { username: data.username },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // Check if inviter has access to project
    const hasAccess = await prisma.project.findFirst({
      where: {
        id: data.projectId,
        OR: [
          { ownerId: inviterId },
          { projectUsers: { some: { userId: inviterId } } },
        ],
      },
    });

    if (!hasAccess) {
      throw new AppError('You do not have permission to invite users to this project', 403);
    }

    // Check if user is already in project
    const existingAssignment = await prisma.projectUser.findUnique({
      where: {
        projectId_userId: {
          projectId: data.projectId,
          userId: user.id,
        },
      },
    });

    if (existingAssignment) {
      throw new AppError('User is already assigned to this project', 400);
    }

    // Create project assignment
    const assignment = await prisma.projectUser.create({
      data: {
        projectId: data.projectId,
        userId: user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            siteId: true,
          },
        },
      },
    });

    return assignment;
  }

  /**
   * Remove user from project
   */
  async removeUserFromProject(projectId: string, userId: string, requesterId: string) {
    // Check if project exists and requester has permission
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // Only project owner can remove users
    if (project.ownerId !== requesterId) {
      throw new AppError('Only project owner can remove users', 403);
    }

    // Cannot remove project owner
    if (userId === project.ownerId) {
      throw new AppError('Cannot remove project owner', 400);
    }

    // Remove assignment
    await prisma.projectUser.delete({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    return { message: 'User removed from project successfully' };
  }
}
