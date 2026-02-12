import prisma from '../../config/database';
import { AppError } from '../../shared/middleware/error.middleware';
import { calculatePagination, buildPaginatedResponse } from '../../shared/utils/pagination';
import { DeviceType } from '@prisma/client';

export class DataService {
  /**
   * Query gateway history data
   */
  async queryGatewayHistory(filters: {
    deviceId?: string;
    projectId?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
    userId: string;
  }) {
    const pagination = calculatePagination(filters.page, filters.limit);

    // Build where clause
    const where: any = {
      device: {
        deviceType: DeviceType.EHUB,
        project: {
          OR: [{ ownerId: filters.userId }, { projectUsers: { some: { userId: filters.userId } } }],
        },
      },
    };

    if (filters.deviceId) {
      where.device.id = filters.deviceId;
    }

    if (filters.projectId) {
      where.device.projectId = filters.projectId;
    }

    if (filters.startDate || filters.endDate) {
      where.terminalTime = {};
      if (filters.startDate) where.terminalTime.gte = filters.startDate;
      if (filters.endDate) where.terminalTime.lte = filters.endDate;
    }

    const [data, total] = await Promise.all([
      prisma.gatewayHistoryData.findMany({
        where,
        include: {
          device: {
            select: {
              id: true,
              deviceId: true,
              name: true,
              project: {
                select: {
                  id: true,
                  name: true,
                  siteId: true,
                },
              },
            },
          },
        },
        orderBy: { terminalTime: 'desc' },
        skip: pagination.skip,
        take: pagination.limit,
      }),
      prisma.gatewayHistoryData.count({ where }),
    ]);

    return buildPaginatedResponse(data, total, pagination.page, pagination.limit);
  }

  /**
   * Query chint history data
   */
  async queryChintHistory(filters: {
    deviceId?: string;
    projectId?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
    userId: string;
  }) {
    const pagination = calculatePagination(filters.page, filters.limit);

    const where: any = {
      device: {
        deviceType: DeviceType.CHINT,
        project: {
          OR: [{ ownerId: filters.userId }, { projectUsers: { some: { userId: filters.userId } } }],
        },
      },
    };

    if (filters.deviceId) where.device.id = filters.deviceId;
    if (filters.projectId) where.device.projectId = filters.projectId;

    if (filters.startDate || filters.endDate) {
      where.terminalTime = {};
      if (filters.startDate) where.terminalTime.gte = filters.startDate;
      if (filters.endDate) where.terminalTime.lte = filters.endDate;
    }

    const [data, total] = await Promise.all([
      prisma.chintHistoryData.findMany({
        where,
        include: {
          device: {
            select: {
              id: true,
              deviceId: true,
              name: true,
              project: {
                select: {
                  id: true,
                  name: true,
                  siteId: true,
                },
              },
            },
          },
        },
        orderBy: { terminalTime: 'desc' },
        skip: pagination.skip,
        take: pagination.limit,
      }),
      prisma.chintHistoryData.count({ where }),
    ]);

    return buildPaginatedResponse(data, total, pagination.page, pagination.limit);
  }

  /**
   * Query inverter battery history data
   */
  async queryInverterBatteryHistory(filters: {
    deviceId?: string;
    projectId?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
    userId: string;
  }) {
    const pagination = calculatePagination(filters.page, filters.limit);

    const where: any = {
      device: {
        deviceType: DeviceType.INVERTER,
        project: {
          OR: [{ ownerId: filters.userId }, { projectUsers: { some: { userId: filters.userId } } }],
        },
      },
    };

    if (filters.deviceId) where.device.id = filters.deviceId;
    if (filters.projectId) where.device.projectId = filters.projectId;

    if (filters.startDate || filters.endDate) {
      where.terminalTime = {};
      if (filters.startDate) where.terminalTime.gte = filters.startDate;
      if (filters.endDate) where.terminalTime.lte = filters.endDate;
    }

    const [data, total] = await Promise.all([
      prisma.inverterBatteryHistory.findMany({
        where,
        include: {
          device: {
            select: {
              id: true,
              deviceId: true,
              name: true,
              project: {
                select: {
                  id: true,
                  name: true,
                  siteId: true,
                },
              },
            },
          },
        },
        orderBy: { terminalTime: 'desc' },
        skip: pagination.skip,
        take: pagination.limit,
      }),
      prisma.inverterBatteryHistory.count({ where }),
    ]);

    return buildPaginatedResponse(data, total, pagination.page, pagination.limit);
  }

  /**
   * Get latest data for a device
   */
  async getLatestDeviceData(deviceId: string, userId: string) {
    // Check access
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

    let latestData: any = null;

    // Get latest data based on device type
    if (device.deviceType === DeviceType.EHUB) {
      latestData = await prisma.gatewayHistoryData.findFirst({
        where: { deviceId: device.id },
        orderBy: { terminalTime: 'desc' },
      });
    } else if (device.deviceType === DeviceType.CHINT) {
      latestData = await prisma.chintHistoryData.findFirst({
        where: { deviceId: device.id },
        orderBy: { terminalTime: 'desc' },
      });
    } else if (device.deviceType === DeviceType.INVERTER) {
      // Get all inverter related data
      const [battery, inverter, load, mppt, pv] = await Promise.all([
        prisma.inverterBatteryHistory.findFirst({
          where: { deviceId: device.id },
          orderBy: { terminalTime: 'desc' },
        }),
        prisma.inverterInverterHistory.findFirst({
          where: { deviceId: device.id },
          orderBy: { terminalTime: 'desc' },
        }),
        prisma.inverterLoadHistory.findFirst({
          where: { deviceId: device.id },
          orderBy: { terminalTime: 'desc' },
        }),
        prisma.inverterMpptHistory.findFirst({
          where: { deviceId: device.id },
          orderBy: { terminalTime: 'desc' },
        }),
        prisma.inverterPvHistory.findFirst({
          where: { deviceId: device.id },
          orderBy: { terminalTime: 'desc' },
        }),
      ]);

      latestData = { battery, inverter, load, mppt, pv };
    }

    return {
      device,
      latestData,
    };
  }
}
