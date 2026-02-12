import { Job } from 'bull';
import prisma from '../../config/database';
import logger from '../../config/logger';
import { HistoryQueueData } from '../../shared/types';

/**
 * Process history data jobs
 */
export async function processHistoryData(job: Job<HistoryQueueData>) {
  const { parsedTopic, payload } = job.data;

  try {
    logger.debug('Processing MQTT history message', {
      deviceId: parsedTopic.deviceId,
      siteId: parsedTopic.siteId,
      deviceType: parsedTopic.deviceType,
      groupName: payload._groupName,
      terminalTime: payload._terminalTime,
    });

    const deviceType = parsedTopic.deviceType.toLowerCase();
    let saved = false;

    // Determine which table to save to based on device type
    if (deviceType === 'system' || deviceType === 'ehub') {
      saved = await saveGatewayHistory(parsedTopic, payload);
    } else if (deviceType === 'chint') {
      saved = await saveChintHistory(parsedTopic, payload);
    } else if (deviceType.includes('battery')) {
      saved = await saveInverterBatteryHistory(parsedTopic, payload);
    } else if (deviceType.includes('inverter')) {
      saved = await saveInverterInverterHistory(parsedTopic, payload);
    } else if (deviceType.includes('load')) {
      saved = await saveInverterLoadHistory(parsedTopic, payload);
    } else if (deviceType.includes('mppt')) {
      saved = await saveInverterMpptHistory(parsedTopic, payload);
    } else if (deviceType.includes('pv')) {
      saved = await saveInverterPvHistory(parsedTopic, payload);
    } else {
      logger.warn('Unknown device type received', {
        deviceId: parsedTopic.deviceId,
        deviceType: parsedTopic.deviceType,
        siteId: parsedTopic.siteId,
      });
    }

    if (saved) {
      logger.info('History data saved successfully', {
        deviceId: parsedTopic.deviceId,
        siteId: parsedTopic.siteId,
        deviceType: parsedTopic.deviceType,
        dataType: deviceType,
        terminalTime: payload._terminalTime,
      });
    }
  } catch (error) {
    logger.error('Error processing history data', {
      deviceId: parsedTopic.deviceId,
      siteId: parsedTopic.siteId,
      deviceType: parsedTopic.deviceType,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error; // Will trigger retry
  }
}

async function saveGatewayHistory(parsedTopic: any, payload: any): Promise<boolean> {
  // Find device by deviceId
  const device = await prisma.device.findFirst({
    where: { deviceId: parsedTopic.deviceId },
  });

  if (!device) {
    logger.warn('Device not found in database', {
      deviceId: parsedTopic.deviceId,
      siteId: parsedTopic.siteId,
      deviceType: parsedTopic.deviceType,
      dataType: 'gateway',
      action: 'data_skipped',
    });
    return false;
  }

  await prisma.gatewayHistoryData.create({
    data: {
      deviceId: device.id,
      terminalTime: new Date(payload._terminalTime),
      groupName: payload._groupName || '',
      runTime: payload.RunTime,
      runSecond: payload.RunSecond,
      startDateTime: payload.StartDateTime,
      buzzerSw: payload.BuzzerSw,
      restartDevice: payload.RestartDevice,
      cloudOnline: payload.CloudOnline,
      sdFreeSpace: payload.SDFreeSpace,
      uFreeSpace: payload.UFreeSpace,
      sysFreeSpace: payload.SysFreeSpace,
      localTotalSpace: payload.LocalTotalSpace,
      localFreeSpace: payload.LocalFreeSpace,
    },
  });

  return true;
}

async function saveChintHistory(parsedTopic: any, payload: any): Promise<boolean> {
  const device = await prisma.device.findFirst({
    where: { deviceId: parsedTopic.deviceId },
  });

  if (!device) {
    logger.warn('Device not found in database', {
      deviceId: parsedTopic.deviceId,
      siteId: parsedTopic.siteId,
      deviceType: parsedTopic.deviceType,
      dataType: 'chint',
      action: 'data_skipped',
    });
    return false;
  }

  // Extract CHINT data (remove prefix if exists)
  const chintData: any = {};
  for (const [key, value] of Object.entries(payload)) {
    const cleanKey = key.replace(/^CHINT_\d+_/, '');
    chintData[cleanKey] = value;
  }

  await prisma.chintHistoryData.create({
    data: {
      deviceId: device.id,
      terminalTime: new Date(payload._terminalTime),
      groupName: payload._groupName || '',
      irAt: chintData.irAt,
      urAt: chintData.urAt,
      uab: chintData.uab ? parseFloat(chintData.uab) : null,
      ubc: chintData.ubc ? parseFloat(chintData.ubc) : null,
      uca: chintData.uca ? parseFloat(chintData.uca) : null,
      ua: chintData.ua ? parseFloat(chintData.ua) : null,
      ub: chintData.ub ? parseFloat(chintData.ub) : null,
      uc: chintData.uc ? parseFloat(chintData.uc) : null,
      ia: chintData.ia ? parseFloat(chintData.ia) : null,
      ib: chintData.ib ? parseFloat(chintData.ib) : null,
      ic: chintData.ic ? parseFloat(chintData.ic) : null,
      pt: chintData.pt ? parseFloat(chintData.pt) : null,
      pa: chintData.pa ? parseFloat(chintData.pa) : null,
      pb: chintData.pb ? parseFloat(chintData.pb) : null,
      pc: chintData.pc ? parseFloat(chintData.pc) : null,
      qt: chintData.qt ? parseFloat(chintData.qt) : null,
      qa: chintData.qa ? parseFloat(chintData.qa) : null,
      qb: chintData.qb ? parseFloat(chintData.qb) : null,
      qc: chintData.qc ? parseFloat(chintData.qc) : null,
      pft: chintData.pft ? parseFloat(chintData.pft) : null,
      pfa: chintData.pfa ? parseFloat(chintData.pfa) : null,
      pfb: chintData.pfb ? parseFloat(chintData.pfb) : null,
      pfc: chintData.pfc ? parseFloat(chintData.pfc) : null,
      freq: chintData.freq ? parseFloat(chintData.freq) : null,
      dmPt: chintData.dmPt ? parseFloat(chintData.dmPt) : null,
      impEp: chintData.impEp ? parseFloat(chintData.impEp) : null,
      expEp: chintData.expEp ? parseFloat(chintData.expEp) : null,
      q1Eq: chintData.q1Eq ? parseFloat(chintData.q1Eq) : null,
      q2Eq: chintData.q2Eq ? parseFloat(chintData.q2Eq) : null,
      q3Eq: chintData.q3Eq ? parseFloat(chintData.q3Eq) : null,
      q4Eq: chintData.q4Eq ? parseFloat(chintData.q4Eq) : null,
    },
  });

  return true;
}

async function saveInverterBatteryHistory(parsedTopic: any, payload: any): Promise<boolean> {
  const device = await prisma.device.findFirst({
    where: { deviceId: parsedTopic.deviceId },
  });

  if (!device) {
    logger.warn('Device not found in database', {
      deviceId: parsedTopic.deviceId,
      siteId: parsedTopic.siteId,
      deviceType: parsedTopic.deviceType,
      dataType: 'inverter_battery',
      action: 'data_skipped',
    });
    return false;
  }

  // Extract INV data (remove prefix)
  const invData: any = {};
  for (const [key, value] of Object.entries(payload)) {
    const cleanKey = key.replace(/^INV_\d+_/, '');
    invData[cleanKey] = value;
  }

  await prisma.inverterBatteryHistory.create({
    data: {
      deviceId: device.id,
      terminalTime: new Date(payload._terminalTime),
      groupName: payload._groupName || '',
      battStatus: invData.battStatus ? parseInt(invData.battStatus) : null,
      battVolt: invData.battVolt ? parseInt(invData.battVolt) : null,
      battCurr: invData.battCurr ? parseInt(invData.battCurr) : null,
      battPower: invData.battPower ? parseInt(invData.battPower) : null,
      battMaxTemp: invData.battMaxTemp ? parseInt(invData.battMaxTemp) : null,
      battMinTemp: invData.battMinTemp ? parseInt(invData.battMinTemp) : null,
      cellsMaxVolt: invData.cellsMaxVolt ? parseInt(invData.cellsMaxVolt) : null,
      cellsMinVolt: invData.cellsMinVolt ? parseInt(invData.cellsMinVolt) : null,
      battCapacity: invData.battCapacity ? parseInt(invData.battCapacity) : null,
      battDailyChargeCap: invData.battDailyChargeCap ? parseInt(invData.battDailyChargeCap) : null,
      battDailyDischargeCap: invData.battDailyDischargeCap ? parseInt(invData.battDailyDischargeCap) : null,
    },
  });

  return true;
}

async function saveInverterInverterHistory(parsedTopic: any, payload: any): Promise<boolean> {
  const device = await prisma.device.findFirst({
    where: { deviceId: parsedTopic.deviceId },
  });

  if (!device) {
    logger.warn('Device not found in database', {
      deviceId: parsedTopic.deviceId,
      siteId: parsedTopic.siteId,
      deviceType: parsedTopic.deviceType,
      dataType: 'inverter_inverter',
      action: 'data_skipped',
    });
    return false;
  }

  const invData: any = {};
  for (const [key, value] of Object.entries(payload)) {
    const cleanKey = key.replace(/^INV_\d+_/, '');
    invData[cleanKey] = value;
  }

  await prisma.inverterInverterHistory.create({
    data: {
      deviceId: device.id,
      terminalTime: new Date(payload._terminalTime),
      groupName: payload._groupName || '',
      devStatus: invData.devStatus ? parseInt(invData.devStatus) : null,
      dailyEnergy: invData.dailyEnergy ? parseInt(invData.dailyEnergy) : null,
      totalEnergy1: invData.totalEnergy1 ? parseInt(invData.totalEnergy1) : null,
      totalEnergy2: invData.totalEnergy2 ? parseInt(invData.totalEnergy2) : null,
      gridFreq: invData.gridFreq ? parseInt(invData.gridFreq) : null,
      uPhaseUvGridVolt: invData.uPhaseUvGridVolt ? parseInt(invData.uPhaseUvGridVolt) : null,
      vPhaseVwGridVolt: invData.vPhaseVwGridVolt ? parseInt(invData.vPhaseVwGridVolt) : null,
      wPhaseWuGridVolt: invData.wPhaseWuGridVolt ? parseInt(invData.wPhaseWuGridVolt) : null,
      uPhaseGridCurr: invData.uPhaseGridCurr ? parseInt(invData.uPhaseGridCurr) : null,
      vPhaseGridCurr: invData.vPhaseGridCurr ? parseInt(invData.vPhaseGridCurr) : null,
      wPhaseGridCurr: invData.wPhaseGridCurr ? parseInt(invData.wPhaseGridCurr) : null,
      gridConnTotalActivePower: invData.gridConnTotalActivePower ? parseInt(invData.gridConnTotalActivePower) : null,
      gridConnTotalReactivePower: invData.gridConnTotalReactivePower ? parseInt(invData.gridConnTotalReactivePower) : null,
      heatsinkTemp: invData.heatsinkTemp ? parseInt(invData.heatsinkTemp) : null,
      innerTemp: invData.innerTemp ? parseInt(invData.innerTemp) : null,
      gridConnTotalApparentPower: invData.gridConnTotalApparentPower ? parseInt(invData.gridConnTotalApparentPower) : null,
      igbtTemp: invData.igbtTemp ? parseInt(invData.igbtTemp) : null,
      outputPowerFactor: invData.outputPowerFactor ? parseInt(invData.outputPowerFactor) : null,
      pvInputTotalPower: invData.pvInputTotalPower ? parseInt(invData.pvInputTotalPower) : null,
      acLeakageCurr: invData.acLeakageCurr ? parseInt(invData.acLeakageCurr) : null,
      dailyPowerConsump: invData.dailyPowerConsump ? parseInt(invData.dailyPowerConsump) : null,
      totalPowerConsump1: invData.totalPowerConsump1 ? parseInt(invData.totalPowerConsump1) : null,
      totalPowerConsump2: invData.totalPowerConsump2 ? parseInt(invData.totalPowerConsump2) : null,
      onGridActivePower: invData.onGridActivePower ? parseInt(invData.onGridActivePower) : null,
      onGridApparentPower: invData.onGridApparentPower ? parseInt(invData.onGridApparentPower) : null,
      onGridReactivePower: invData.onGridReactivePower ? parseInt(invData.onGridReactivePower) : null,
      onGridPowerFactor: invData.onGridPowerFactor ? parseInt(invData.onGridPowerFactor) : null,
    },
  });

  return true;
}

async function saveInverterLoadHistory(parsedTopic: any, payload: any): Promise<boolean> {
  const device = await prisma.device.findFirst({
    where: { deviceId: parsedTopic.deviceId },
  });

  if (!device) {
    logger.warn('Device not found in database', {
      deviceId: parsedTopic.deviceId,
      siteId: parsedTopic.siteId,
      deviceType: parsedTopic.deviceType,
      dataType: 'inverter_load',
      action: 'data_skipped',
    });
    return false;
  }

  const invData: any = {};
  for (const [key, value] of Object.entries(payload)) {
    const cleanKey = key.replace(/^INV_\d+_/, '');
    invData[cleanKey] = value;
  }

  await prisma.inverterLoadHistory.create({
    data: {
      deviceId: device.id,
      terminalTime: new Date(payload._terminalTime),
      groupName: payload._groupName || '',
      uPhaseLoadVolt: invData.uPhaseLoadVolt ? parseInt(invData.uPhaseLoadVolt) : null,
      vPhaseLoadVolt: invData.vPhaseLoadVolt ? parseInt(invData.vPhaseLoadVolt) : null,
      wPhaseLoadVolt: invData.wPhaseLoadVolt ? parseInt(invData.wPhaseLoadVolt) : null,
      uPhaseLoadCurr: invData.uPhaseLoadCurr ? parseInt(invData.uPhaseLoadCurr) : null,
      vPhaseLoadCurr: invData.vPhaseLoadCurr ? parseInt(invData.vPhaseLoadCurr) : null,
      wPhaseLoadCurr: invData.wPhaseLoadCurr ? parseInt(invData.wPhaseLoadCurr) : null,
      loadTotalActivePower: invData.loadTotalActivePower ? parseInt(invData.loadTotalActivePower) : null,
      loadTotalReactivePower: invData.loadTotalReactivePower ? parseInt(invData.loadTotalReactivePower) : null,
      loadTotalApparentPower: invData.loadTotalApparentPower ? parseInt(invData.loadTotalApparentPower) : null,
      uPhaseLoadActivePower: invData.uPhaseLoadActivePower ? parseInt(invData.uPhaseLoadActivePower) : null,
      vPhaseLoadActivePower: invData.vPhaseLoadActivePower ? parseInt(invData.vPhaseLoadActivePower) : null,
      wPhaseLoadActivePower: invData.wPhaseLoadActivePower ? parseInt(invData.wPhaseLoadActivePower) : null,
      uPhaseLoadReactivePower: invData.uPhaseLoadReactivePower ? parseInt(invData.uPhaseLoadReactivePower) : null,
      vPhaseLoadReactivePower: invData.vPhaseLoadReactivePower ? parseInt(invData.vPhaseLoadReactivePower) : null,
      wPhaseLoadReactivePower: invData.wPhaseLoadReactivePower ? parseInt(invData.wPhaseLoadReactivePower) : null,
      uPhaseLoadApparentPower: invData.uPhaseLoadApparentPower ? parseInt(invData.uPhaseLoadApparentPower) : null,
      vPhaseLoadApparentPower: invData.vPhaseLoadApparentPower ? parseInt(invData.vPhaseLoadApparentPower) : null,
      wPhaseLoadApparentPower: invData.wPhaseLoadApparentPower ? parseInt(invData.wPhaseLoadApparentPower) : null,
      uPhaseLoadPowerFactor: invData.uPhaseLoadPowerFactor ? parseInt(invData.uPhaseLoadPowerFactor) : null,
      vPhaseLoadPowerFactor: invData.vPhaseLoadPowerFactor ? parseInt(invData.vPhaseLoadPowerFactor) : null,
      wPhaseLoadPowerFactor: invData.wPhaseLoadPowerFactor ? parseInt(invData.wPhaseLoadPowerFactor) : null,
      loadPowerFactor: invData.loadPowerFactor ? parseInt(invData.loadPowerFactor) : null,
      dailyLoadPowerConsump: invData.dailyLoadPowerConsump ? parseInt(invData.dailyLoadPowerConsump) : null,
      totalLoadPowerConsump1: invData.totalLoadPowerConsump1 ? parseInt(invData.totalLoadPowerConsump1) : null,
      totalLoadPowerConsump2: invData.totalLoadPowerConsump2 ? parseInt(invData.totalLoadPowerConsump2) : null,
    },
  });

  return true;
}

async function saveInverterMpptHistory(parsedTopic: any, payload: any): Promise<boolean> {
  const device = await prisma.device.findFirst({
    where: { deviceId: parsedTopic.deviceId },
  });

  if (!device) {
    logger.warn('Device not found in database', {
      deviceId: parsedTopic.deviceId,
      siteId: parsedTopic.siteId,
      deviceType: parsedTopic.deviceType,
      dataType: 'inverter_mppt',
      action: 'data_skipped',
    });
    return false;
  }

  const invData: any = {};
  for (const [key, value] of Object.entries(payload)) {
    const cleanKey = key.replace(/^INV_\d+_/, '');
    invData[cleanKey] = value;
  }

  await prisma.inverterMpptHistory.create({
    data: {
      deviceId: device.id,
      terminalTime: new Date(payload._terminalTime),
      groupName: payload._groupName || '',
      dailyPvEnergy: invData.dailyPvEnergy ? parseInt(invData.dailyPvEnergy) : null,
      totalPvEnergy1: invData.totalPvEnergy1 ? parseInt(invData.totalPvEnergy1) : null,
      totalPvEnergy2: invData.totalPvEnergy2 ? parseInt(invData.totalPvEnergy2) : null,
      totalInsulationImp: invData.totalInsulationImp ? parseInt(invData.totalInsulationImp) : null,
      voltOfMppt1: invData.voltOfMppt1 ? parseInt(invData.voltOfMppt1) : null,
      voltOfMppt2: invData.voltOfMppt2 ? parseInt(invData.voltOfMppt2) : null,
      voltOfMppt3: invData.voltOfMppt3 ? parseInt(invData.voltOfMppt3) : null,
      voltOfMppt4: invData.voltOfMppt4 ? parseInt(invData.voltOfMppt4) : null,
      voltOfMppt5: invData.voltOfMppt5 ? parseInt(invData.voltOfMppt5) : null,
      voltOfMppt6: invData.voltOfMppt6 ? parseInt(invData.voltOfMppt6) : null,
      voltOfMppt7: invData.voltOfMppt7 ? parseInt(invData.voltOfMppt7) : null,
      voltOfMppt8: invData.voltOfMppt8 ? parseInt(invData.voltOfMppt8) : null,
      currOfMppt1: invData.currOfMppt1 ? parseInt(invData.currOfMppt1) : null,
      currOfMppt2: invData.currOfMppt2 ? parseInt(invData.currOfMppt2) : null,
      currOfMppt3: invData.currOfMppt3 ? parseInt(invData.currOfMppt3) : null,
      currOfMppt4: invData.currOfMppt4 ? parseInt(invData.currOfMppt4) : null,
      currOfMppt5: invData.currOfMppt5 ? parseInt(invData.currOfMppt5) : null,
      currOfMppt6: invData.currOfMppt6 ? parseInt(invData.currOfMppt6) : null,
      currOfMppt7: invData.currOfMppt7 ? parseInt(invData.currOfMppt7) : null,
      currOfMppt8: invData.currOfMppt8 ? parseInt(invData.currOfMppt8) : null,
    },
  });

  return true;
}

async function saveInverterPvHistory(parsedTopic: any, payload: any): Promise<boolean> {
  const device = await prisma.device.findFirst({
    where: { deviceId: parsedTopic.deviceId },
  });

  if (!device) {
    logger.warn('Device not found in database', {
      deviceId: parsedTopic.deviceId,
      siteId: parsedTopic.siteId,
      deviceType: parsedTopic.deviceType,
      dataType: 'inverter_pv',
      action: 'data_skipped',
    });
    return false;
  }

  const invData: any = {};
  for (const [key, value] of Object.entries(payload)) {
    const cleanKey = key.replace(/^INV_\d+_/, '');
    invData[cleanKey] = value;
  }

  // Build data object with all 32 PV strings (voltage, current, power)
  const pvData: any = {
    deviceId: device.id,
    terminalTime: new Date(payload._terminalTime),
    groupName: payload._groupName || '',
  };

  // Add voltage, current, and power for all 32 PV strings
  for (let i = 1; i <= 32; i++) {
    pvData[`voltageOfPv${i}`] = invData[`voltageOfPv${i}`] ? parseInt(invData[`voltageOfPv${i}`]) : null;
    pvData[`currentOfPv${i}`] = invData[`currentOfPv${i}`] ? parseInt(invData[`currentOfPv${i}`]) : null;
    pvData[`powerOfPv${i}`] = invData[`powerOfPv${i}`] ? parseInt(invData[`powerOfPv${i}`]) : null;
  }

  await prisma.inverterPvHistory.create({
    data: pvData,
  });

  return true;
}
