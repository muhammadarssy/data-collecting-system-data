import prisma from '../../config/database';
import { AppError } from '../../shared/middleware/error.middleware';
import { CreateProjectInput, UpdateProjectInput } from './projects.validation';
import { calculatePagination, buildPaginatedResponse } from '../../shared/utils/pagination';

export class ProjectsService {
  /**
   * Create new project
   */
  async createProject(data: CreateProjectInput, ownerId: string) {
    // Check if site ID already exists
    const existingProject = await prisma.project.findUnique({
      where: { siteId: data.siteId },
    });

    if (existingProject) {
      throw new AppError('Site ID already exists', 400);
    }

    const project = await prisma.project.create({
      data: {
        name: data.name,
        siteId: data.siteId,
        description: data.description,
        ownerId,
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return project;
  }

  /**
   * Get project by ID
   */
  async getProjectById(projectId: string, userId: string) {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [{ ownerId: userId }, { projectUsers: { some: { userId } } }],
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        projectUsers: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                role: true,
              },
            },
          },
        },
        devices: {
          select: {
            id: true,
            deviceId: true,
            deviceType: true,
            name: true,
            isOnline: true,
            lastSeenAt: true,
          },
        },
        _count: {
          select: {
            devices: true,
            projectUsers: true,
          },
        },
      },
    });

    if (!project) {
      throw new AppError('Project not found or access denied', 404);
    }

    return project;
  }

  /**
   * List user's projects
   */
  async listUserProjects(userId: string, page?: number, limit?: number) {
    const pagination = calculatePagination(page, limit);

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where: {
          OR: [{ ownerId: userId }, { projectUsers: { some: { userId } } }],
        },
        include: {
          owner: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
          _count: {
            select: {
              devices: true,
              projectUsers: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: pagination.skip,
        take: pagination.limit,
      }),
      prisma.project.count({
        where: {
          OR: [{ ownerId: userId }, { projectUsers: { some: { userId } } }],
        },
      }),
    ]);

    return buildPaginatedResponse(projects, total, pagination.page, pagination.limit);
  }

  /**
   * Update project
   */
  async updateProject(projectId: string, data: UpdateProjectInput, userId: string) {
    // Check if user is owner
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: userId,
      },
    });

    if (!project) {
      throw new AppError('Project not found or you are not the owner', 404);
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data,
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return updatedProject;
  }

  /**
   * Delete project
   */
  async deleteProject(projectId: string, userId: string) {
    // Check if user is owner
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: userId,
      },
    });

    if (!project) {
      throw new AppError('Project not found or you are not the owner', 404);
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    return { message: 'Project deleted successfully' };
  }

  /**
   * Get project users
   */
  async getProjectUsers(projectId: string, userId: string) {
    // Check if user has access to project
    const hasAccess = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [{ ownerId: userId }, { projectUsers: { some: { userId } } }],
      },
    });

    if (!hasAccess) {
      throw new AppError('Project not found or access denied', 404);
    }

    const users = await prisma.projectUser.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { assignedAt: 'desc' },
    });

    return users;
  }
}
