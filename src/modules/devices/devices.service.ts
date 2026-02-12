import prisma from '../../config/database';
import { AppError } from '../../shared/middleware/error.middleware';
import { CreateDeviceInput, UpdateDeviceInput } from './devices.validation';
import { calculatePagination, buildPaginatedResponse } from '../../shared/utils/pagination';

export class DevicesService {
  /**
   * Create new device
   */
  async createDevice(data: CreateDeviceInput, userId: string) {
    // Check if user has access to project
    const project = await prisma.project.findFirst({
      where: {
        id: data.projectId,
        OR: [{ ownerId: userId }, { projectUsers: { some: { userId } } }],
      },
    });

    if (!project) {
      throw new AppError('Project not found or access denied', 404);
    }

    // Check if device ID already exists in this project
    const existingDevice = await prisma.device.findUnique({
      where: {
        deviceId_projectId: {
          deviceId: data.deviceId,
          projectId: data.projectId,
        },
      },
    });

    if (existingDevice) {
      throw new AppError('Device ID already exists in this project', 400);
    }

    const device = await prisma.device.create({
      data,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            siteId: true,
          },
        },
      },
    });

    return device;
  }

  /**
   * Get device by ID
   */
  async getDeviceById(deviceId: string, userId: string) {
    const device = await prisma.device.findFirst({
      where: {
        id: deviceId,
        project: {
          OR: [{ ownerId: userId }, { projectUsers: { some: { userId } } }],
        },
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            siteId: true,
          },
        },
      },
    });

    if (!device) {
      throw new AppError('Device not found or access denied', 404);
    }

    return device;
  }

  /**
   * List devices by project
   */
  async listDevicesByProject(projectId: string, userId: string, page?: number, limit?: number) {
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

    const pagination = calculatePagination(page, limit);

    const [devices, total] = await Promise.all([
      prisma.device.findMany({
        where: { projectId },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              siteId: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: pagination.skip,
        take: pagination.limit,
      }),
      prisma.device.count({
        where: { projectId },
      }),
    ]);

    return buildPaginatedResponse(devices, total, pagination.page, pagination.limit);
  }

  /**
   * Update device
   */
  async updateDevice(deviceId: string, data: UpdateDeviceInput, userId: string) {
    // Check if user has access to device's project
    const device = await prisma.device.findFirst({
      where: {
        id: deviceId,
        project: {
          OR: [{ ownerId: userId }, { projectUsers: { some: { userId } } }],
        },
      },
    });

    if (!device) {
      throw new AppError('Device not found or access denied', 404);
    }

    const updatedDevice = await prisma.device.update({
      where: { id: deviceId },
      data,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            siteId: true,
          },
        },
      },
    });

    return updatedDevice;
  }

  /**
   * Delete device
   */
  async deleteDevice(deviceId: string, userId: string) {
    // Check if user is project owner
    const device = await prisma.device.findFirst({
      where: {
        id: deviceId,
        project: {
          ownerId: userId,
        },
      },
    });

    if (!device) {
      throw new AppError('Device not found or you are not the project owner', 404);
    }

    await prisma.device.delete({
      where: { id: deviceId },
    });

    return { message: 'Device deleted successfully' };
  }

  /**
   * Update device online status
   */
  async updateDeviceStatus(deviceId: string, isOnline: boolean) {
    await prisma.device.update({
      where: { id: deviceId },
      data: {
        isOnline,
        lastSeenAt: new Date(),
      },
    });
  }
}
