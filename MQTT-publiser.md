# Structure MQTT

## 1. Device Types

| Device Type  | Code     | Description                  |
| ------------ | -------- | ---------------------------- |
| IoT Gateway  | ehub			| Edge device / data collector |
| Power Meter  | chint    | Chint power meter            |
| Inverter     | inverter | Solar / power inverter       |
| Other Device | xxx      | Optional                     |


## 2. Topic Naming Convention

### 2.1 General Format

```
data/<site_id>/<type_data>/<device_id>/<devices>/<sn_gateway>
```

### 2.2 Rules

* Lowercase only
* Separator menggunakan `/`
* Tidak menggunakan spasi
* `device_id` harus unik
* `site_id`harus unik
* Hindari wildcard pada publish

### 2.3 Example

```
data/mhsj3jqn0lok167x4buu/history/miwjrjpg/chint/7011957300020111017
data/mbsy8u692xdtxs3wsgo0/history/mbzxxgv1/system/7061747700060374007
data/mhsj3jqn0lok167x4buu/realtime/mhsj2kc9/inverter1/7011957300020111049
```

## 3. Device
### 3.1 Gateway
**History**
berikut contoh data history untuk device gateway
**Topik**
```
data/mhsj3jqn0lok167x4buu/history/mhsikjck/system/7011957300020111049
```
**Payload**
```json
{
  "_terminalTime": "2026-02-02 13:36:44.297",
  "_groupName": "HistoryEhub",
  "RunTime": "104:24:49",
  "RunSecond": "375889",
  "StartDateTime": "2026-01-29 05:11:55",
  "BuzzerSw": "1",
  "RestartDevice": "0",
  "CloudOnline": "1",
  "SDFreeSpace": "0",
  "UFreeSpace": "15236",
  "SysFreeSpace": "696",
  "LocalTotalSpace": "2480",
  "LocalFreeSpace": "2458"
}
```
**Realtime**
Berikut contoh data realtime untuk device gateway
**Topik**
```
data/mhsj3jqn0lok167x4buu/realtime/mhsj2kc9/ehub1/7011957300020111017
```
**Payload**
```json
{
  "_terminalTime": "2026-02-02 13:33:35.596",
  "_groupName": "RealtimeEhub1",
  "Year": "2026",
  "Month": "2",
  "Day": "2",
  "Hour": "13",
  "Minute": "33",
  "Second": "35",
  "Week": "1",
  "Date": "2026-02-02",
  "Time": "13:33:35",
  "ProjectName": "SAMACO KARSASINDO UTAMA Gedung A",
  "ProjectMemo": "V2",
  "ProjectFullName": "",
  "ProjectCompany": "",
  "ProjectAuthor": "",
  "ProjectCopyright": "",
  "ProjectLanguageId": "0",
  "ShowWindowId": "1",
  "RunTime": "105:21:52",
  "RunSecond": "379312",
  "StartDateTime": "2026-01-29 04:11:43",
  "TerminalName": "CBOX",
  "TerminalCode": "",
  "TerminalPn": "7011957300020111017",
  "SoftwareVersion1": "3",
  "SoftwareVersion2": "36",
  "SoftwareVersion3": "9",
  "SoftwareVersion4": "4",
  "BuzzerSw": "1",
  "RestartDevice": "0",
  "CloudOnline": "1",
  "UserName": "",
  "UserGroup": "",
  "LAN1IP1": "192",
  "LAN1IP2": "168",
  "LAN1IP3": "111",
  "LAN1IP4": "157",
  "LAN1mask1": "255",
  "LAN1mask2": "255",
  "LAN1mask3": "255",
  "LAN1mask4": "0",
  "LAN1Gateway1": "192",
  "LAN1Gateway2": "168",
  "LAN1Gateway3": "111",
  "LAN1Gateway4": "1",
  "DNSP1": "1",
  "DNSP2": "1",
  "DNSP3": "1",
  "DNSP4": "1",
  "LAN1MAC1": "66",
  "LAN1MAC2": "4",
  "LAN1MAC3": "52",
  "LAN1MAC4": "140",
  "LAN1MAC5": "32",
  "LAN1MAC6": "142",
  "WifiSignalStrength": "0",
  "4GSignalStrength": "0",
  "SIMCardNumber": "",
  "SDFreeSpace": "0",
  "UFreeSpace": "15239",
  "SysFreeSpace": "696",
  "LocalTotalSpace": "2480",
  "LocalFreeSpace": "2458",
  "RecipeuploadHint": "0",
  "RecipedownloadHint": "0",
  "INV_1__commStatusInverter1": "1",
  "INV_1__commOperationInverter1": "1",
  "CHINT_1__commStatus": "1",
  "CHINT_1__commOperation": "1"
}
```
### 3.2 Chint
**History**
**Topik**
```
data/mhsj3jqn0lok167x4buu/history/mhsiqfca/chint/7011957300020111017
```
**Payload**
```json
{
  "_terminalTime": "2026-02-02 13:51:35.599",
  "_groupName": "HistoryChint1",
  "CHINT_1_irAt": "202",
  "CHINT_1_urAt": "10",
  "CHINT_1_uab": "3892.00",
  "CHINT_1_ubc": "3900.00",
  "CHINT_1_uca": "3892.00",
  "CHINT_1_ua": "2243.00",
  "CHINT_1_ub": "2252.00",
  "CHINT_1_uc": "2252.00",
  "CHINT_1_ia": "632.00",
  "CHINT_1_ib": "734.00",
  "CHINT_1_ic": "654.00",
  "CHINT_1_pt": "4408.00",
  "CHINT_1_pa": "1380.00",
  "CHINT_1_pb": "1608.00",
  "CHINT_1_pc": "1419.00",
  "CHINT_1_qt": "1070.00",
  "CHINT_1_qa": "308.00",
  "CHINT_1_qb": "374.00",
  "CHINT_1_qc": "388.00",
  "CHINT_1_pft": "970.00",
  "CHINT_1_pfa": "974.00",
  "CHINT_1_pfb": "972.00",
  "CHINT_1_pfc": "963.00",
  "CHINT_1_freq": "5002.00",
  "CHINT_1_dmPt": "0.00",
  "CHINT_1_impEp": "264.96",
  "CHINT_1_expEp": "31.20",
  "CHINT_1_q1Eq": "69.30",
  "CHINT_1_q2Eq": "2.95",
  "CHINT_1_q3Eq": "10.39",
  "CHINT_1_q4Eq": "16.75"
}
```
**Realtime**
**Topik**
```
data/mhsj3jqn0lok167x4buu/history/mhsiqfca/chint/7011957300020111017
```
**Payload**
```json
{
  "_terminalTime": "2026-02-02 13:48:14.296",
  "_groupName": "RealtimeChint1",
  "CHINT_1_rev": "208",
  "CHINT_1_uCode": "701",
  "CHINT_1_clrE": "0",
  "CHINT_1_net": "0",
  "CHINT_1_irAt": "202",
  "CHINT_1_urAt": "10",
  "CHINT_1_meterType": "10",
  "CHINT_1_protocol": "3",
  "CHINT_1_addr": "3",
  "CHINT_1_bAud": "102",
  "CHINT_1_second": "10",
  "CHINT_1_minute": "9361",
  "CHINT_1_hour": "1808",
  "CHINT_1_day": "1060",
  "CHINT_1_month": "5",
  "CHINT_1_year": "65",
  "CHINT_1_uab": "4047.00",
  "CHINT_1_ubc": "4056.00",
  "CHINT_1_uca": "4042.00",
  "CHINT_1_ua": "2329.00",
  "CHINT_1_ub": "2345.00",
  "CHINT_1_uc": "2339.00",
  "CHINT_1_ia": "375.00",
  "CHINT_1_ib": "440.00",
  "CHINT_1_ic": "364.00",
  "CHINT_1_pt": "2696.00",
  "CHINT_1_pa": "861.00",
  "CHINT_1_pb": "1012.00",
  "CHINT_1_pc": "823.00",
  "CHINT_1_qt": "518.00",
  "CHINT_1_qa": "135.00",
  "CHINT_1_qb": "177.00",
  "CHINT_1_qc": "205.00",
  "CHINT_1_pft": "978.00",
  "CHINT_1_pfa": "984.00",
  "CHINT_1_pfb": "983.00",
  "CHINT_1_pfc": "967.00",
  "CHINT_1_freq": "5003.00",
  "CHINT_1_dmPt": "0.00",
  "CHINT_1_impEp": "369.77",
  "CHINT_1_expEp": "10.50",
  "CHINT_1_q1Eq": "75.09",
  "CHINT_1_q2Eq": "2.93",
  "CHINT_1_q3Eq": "0.47",
  "CHINT_1_q4Eq": "1.39"
}
```
### 3.3 Inverter
#### 1. SPI15K - SPI60K
**History**
1. Battery

**Topik**
```
data/m4gno5cmvz3n0xtur7op/history/m4gnlyb4/battery/7061337700120175026
```
**Payload**
```json
{
  "_terminalTime": "2026-02-04 13:39:00.997",
  "_groupName": "HistoryBattery3",
  "INV_3_battStatus": "0",
  "INV_3_battVolt": "0",
  "INV_3_battCurr": "0",
  "INV_3_battPower": "0",
  "INV_3_battMaxTemp": "0",
  "INV_3_battMinTemp": "0",
  "INV_3_cellsMaxVolt": "0",
  "INV_3_cellsMinVolt": "0",
  "INV_3_battCapacity": "0",
  "INV_3_battDailyChargeCap": "0",
  "INV_3_battDailyDischargeCap": "0"
}
```
2. Inverter

**Topik**
```
data/m4gno5cmvz3n0xtur7op/history/m4gnlyb4/inverter/7061337700120175026
```
**Payload**
```json
{
  "_terminalTime": "2026-02-04 13:39:00.997",
  "_groupName": "HistoryInverter3",
  "INV_3_devStatus": "1",
  "INV_3_dailyEnergy": "481",
  "INV_3_totalEnergy1": "28",
  "INV_3_totalEnergy2": "41310",
  "INV_3_gridFreq": "5003",
  "INV_3_uPhaseUvGridVolt": "2270",
  "INV_3_vPhaseVwGridVolt": "2280",
  "INV_3_wPhaseWuGridVolt": "2276",
  "INV_3_uPhaseGridCurr": "139",
  "INV_3_vPhaseGridCurr": "135",
  "INV_3_wPhaseGridCurr": "137",
  "INV_3_gridConnTotalActivePower": "93",
  "INV_3_gridConnTotalReactivePower": "0",
  "INV_3_heatsinkTemp": "540",
  "INV_3_innerTemp": "450",
  "INV_3_gridConnTotalApparentPower": "93",
  "INV_3_igbtTemp": "620",
  "INV_3_outputPowerFactor": "100",
  "INV_3_pvInputTotalPower": "99",
  "INV_3_acLeakageCurr": "95",
  "INV_3_dailyPowerConsump": "0",
  "INV_3_totalPowerConsump1": "0",
  "INV_3_totalPowerConsump2": "0",
  "INV_3_onGridActivePower": "0",
  "INV_3_onGridApparentPower": "0",
  "INV_3_onGridReactivePower": "0",
  "INV_3_onGridPowerFactor": "0"
}
```
3. Load

**Topik**
```
data/m4gno5cmvz3n0xtur7op/history/m4gnlyb4/load/7061337700120175026
```
**Payload**
```json
{
  "_terminalTime": "2026-02-04 13:34:00.997",
  "_groupName": "HistoryLoad3",
  "INV_3_uPhaseLoadVolt": "0",
  "INV_3_vPhaseLoadVolt": "0",
  "INV_3_wPhaseLoadVolt": "0",
  "INV_3_uPhaseLoadCurr": "0",
  "INV_3_vPhaseLoadCurr": "0",
  "INV_3_wPhaseLoadCurr": "0",
  "INV_3_loadTotalActivePower": "0",
  "INV_3_loadTotalReactivePower": "0",
  "INV_3_loadTotalApparentPower": "0",
  "INV_3_uPhaseLoadActivePower": "0",
  "INV_3_vPhaseLoadActivePower": "0",
  "INV_3_wPhaseLoadActivePower": "0",
  "INV_3_uPhaseLoadReactivePower": "0",
  "INV_3_vPhaseLoadReactivePower": "0",
  "INV_3_wPhaseLoadReactivePower": "0",
  "INV_3_uPhaseLoadApparentPower": "0",
  "INV_3_vPhaseLoadApparentPower": "0",
  "INV_3_wPhaseLoadApparentPower": "0",
  "INV_3_uPhaseLoadPowerFactor": "0",
  "INV_3_vPhaseLoadPowerFactor": "0",
  "INV_3_wPhaseLoadPowerFactor": "0",
  "INV_3_loadPowerFactor": "0",
  "INV_3_dailyLoadPowerConsump": "0",
  "INV_3_totalLoadPowerConsump1": "0",
  "INV_3_totalLoadPowerConsump2": "0"
}
```
4. MPPT

**Topik**
```
data/m4gno5cmvz3n0xtur7op/history/m4gnlyb4/mppt/7061337700120175026
```
**Payload**
```json
{
  "_terminalTime": "2026-02-04 13:39:00.997",
  "_groupName": "HistoryMPPT3",
  "INV_3_dailyPvEnergy": "481",
  "INV_3_totalPvEnergy1": "28",
  "INV_3_totalPvEnergy2": "41310",
  "INV_3_totalInsulationImp": "3410",
  "INV_3_voltOfMppt1": "4984",
  "INV_3_voltOfMppt2": "4702",
  "INV_3_voltOfMppt3": "5082",
  "INV_3_voltOfMppt4": "0",
  "INV_3_voltOfMppt5": "0",
  "INV_3_voltOfMppt6": "0",
  "INV_3_voltOfMppt7": "0",
  "INV_3_voltOfMppt8": "0",
  "INV_3_currOfMppt1": "67",
  "INV_3_currOfMppt2": "63",
  "INV_3_currOfMppt3": "70",
  "INV_3_currOfMppt4": "0",
  "INV_3_currOfMppt5": "0",
  "INV_3_currOfMppt6": "0",
  "INV_3_currOfMppt7": "0",
  "INV_3_currOfMppt8": "0"
}
```
5. PV

**Topik**
```
data/m4gno5cmvz3n0xtur7op/history/m4gnlyb4/pv/7061337700120175026
```
**Payload**
```json
{
  "_terminalTime": "2026-02-04 13:39:00.998",
  "_groupName": "HistoryPV3",
  "INV_3_voltageOfPv1": "4984",
  "INV_3_voltageOfPv2": "4984",
  "INV_3_voltageOfPv3": "4984",
  "INV_3_voltageOfPv4": "4702",
  "INV_3_voltageOfPv5": "4702",
  "INV_3_voltageOfPv6": "4702",
  "INV_3_voltageOfPv7": "5082",
  "INV_3_voltageOfPv8": "5082",
  "INV_3_voltageOfPv9": "5082",
  "INV_3_voltageOfPv10": "0",
  "INV_3_voltageOfPv11": "0",
  "INV_3_voltageOfPv12": "0",
  "INV_3_voltageOfPv13": "0",
  "INV_3_voltageOfPv14": "0",
  "INV_3_voltageOfPv15": "0",
  "INV_3_voltageOfPv16": "0",
  "INV_3_voltageOfPv17": "0",
  "INV_3_voltageOfPv18": "0",
  "INV_3_voltageOfPv19": "0",
  "INV_3_voltageOfPv20": "0",
  "INV_3_voltageOfPv21": "0",
  "INV_3_voltageOfPv22": "0",
  "INV_3_voltageOfPv23": "0",
  "INV_3_voltageOfPv24": "0",
  "INV_3_voltageOfPv25": "0",
  "INV_3_voltageOfPv26": "0",
  "INV_3_voltageOfPv27": "0",
  "INV_3_voltageOfPv28": "0",
  "INV_3_voltageOfPv29": "0",
  "INV_3_voltageOfPv30": "0",
  "INV_3_voltageOfPv31": "0",
  "INV_3_voltageOfPv32": "0",
  "INV_3_currentOfPv1": "32",
  "INV_3_currentOfPv2": "33",
  "INV_3_currentOfPv3": "2",
  "INV_3_currentOfPv4": "26",
  "INV_3_currentOfPv5": "34",
  "INV_3_currentOfPv6": "1",
  "INV_3_currentOfPv7": "33",
  "INV_3_currentOfPv8": "36",
  "INV_3_currentOfPv9": "1",
  "INV_3_currentOfPv10": "0",
  "INV_3_currentOfPv11": "0",
  "INV_3_currentOfPv12": "0",
  "INV_3_currentOfPv13": "0",
  "INV_3_currentOfPv14": "0",
  "INV_3_currentOfPv15": "0",
  "INV_3_currentOfPv16": "0",
  "INV_3_currentOfPv17": "0",
  "INV_3_currentOfPv18": "0",
  "INV_3_currentOfPv19": "0",
  "INV_3_currentOfPv20": "0",
  "INV_3_currentOfPv21": "0",
  "INV_3_currentOfPv22": "0",
  "INV_3_currentOfPv23": "0",
  "INV_3_currentOfPv24": "0",
  "INV_3_currentOfPv25": "0",
  "INV_3_currentOfPv26": "0",
  "INV_3_currentOfPv27": "0",
  "INV_3_currentOfPv28": "0",
  "INV_3_currentOfPv29": "0",
  "INV_3_currentOfPv30": "0",
  "INV_3_currentOfPv31": "0",
  "INV_3_currentOfPv32": "0",
  "INV_3_powerOfPv1": "16",
  "INV_3_powerOfPv2": "16",
  "INV_3_powerOfPv3": "0",
  "INV_3_powerOfPv4": "12",
  "INV_3_powerOfPv5": "16",
  "INV_3_powerOfPv6": "0",
  "INV_3_powerOfPv7": "16",
  "INV_3_powerOfPv8": "18",
  "INV_3_powerOfPv9": "0",
  "INV_3_powerOfPv10": "0",
  "INV_3_powerOfPv11": "0",
  "INV_3_powerOfPv12": "0",
  "INV_3_powerOfPv13": "0",
  "INV_3_powerOfPv14": "0",
  "INV_3_powerOfPv15": "0",
  "INV_3_powerOfPv16": "0",
  "INV_3_powerOfPv17": "0",
  "INV_3_powerOfPv18": "0",
  "INV_3_powerOfPv19": "0",
  "INV_3_powerOfPv20": "0",
  "INV_3_powerOfPv21": "0",
  "INV_3_powerOfPv22": "0",
  "INV_3_powerOfPv23": "0",
  "INV_3_powerOfPv24": "0",
  "INV_3_powerOfPv25": "0",
  "INV_3_powerOfPv26": "0",
  "INV_3_powerOfPv27": "0",
  "INV_3_powerOfPv28": "0",
  "INV_3_powerOfPv29": "0",
  "INV_3_powerOfPv30": "0",
  "INV_3_powerOfPv31": "0",
  "INV_3_powerOfPv32": "0"
}
```
---
**Realtime**

1. battery

**Topik**
```
data/m4gno5cmvz3n0xtur7op/realtime/m4gno5cm/battery1/7061337700120175068
```
**Payload**
```json
{
  "_terminalTime": "2026-02-03 10:43:11.338",
  "_groupName": "RealtimeBattery1",
  "INV_1_battStatus": "0",
  "INV_1_battVolt": "0",
  "INV_1_battCurr": "0",
  "INV_1_battPower": "0",
  "INV_1_battMaxTemp": "0",
  "INV_1_battMinTemp": "0",
  "INV_1_cellsMaxVolt": "0",
  "INV_1_cellsMinVolt": "0",
  "INV_1_battCapacity": "0",
  "INV_1_battDailyChargeCap": "0",
  "INV_1_battDailyDischargeCap": "0"
}
```
2. fault battery

**Topik**
```
data/m4gno5cmvz3n0xtur7op/realtime/m4gno5cm/faultbattery1/7061337700120175068
```
**Payload**
```json
{
  "_terminalTime": "2026-02-03 10:43:11.338",
  "_groupName": "FaultBattery1",
  "INV_1_battOverVoltAlarm": "0",
  "INV_1_battLowVoltAlarm": "0",
  "INV_1_battOverVoltProt": "0",
  "INV_1_battLowVoltProt": "0",
  "INV_1_battOverTemp": "0",
  "INV_1_battLowTemp": "0",
  "INV_1_battChargeOverCurr": "0",
  "INV_1_battDischargeOverCurr": "0",
  "INV_1_battBmsCommAbnormal": "0"
}
```
3. fault inverter

**Topik**
```
data/m4gno5cmvz3n0xtur7op/realtime/m4gno5cm/faultinverter1/7061337700120175068
```
**Payload**
```json
{
  "_terminalTime": "2026-02-03 10:43:11.338",
  "_groupName": "FaultInverter1",
  "INV_1_gridVoltAbnormal": "0",
  "INV_1_gridFreqAbnormal": "0",
  "INV_1_gridPhaseSeqAbnormal": "0",
  "INV_1_outputCurrAbnormal": "0",
  "INV_1_hardwareFault": "0",
  "INV_1_dcCompAbnormal": "0",
  "INV_1_acSpdAbnormal": "0",
  "INV_1_leakageCurrAbnormal": "0",
  "INV_1_acRelayFault": "0",
  "INV_1_reductionAlarm": "0",
  "INV_1_heatsinkOverTemp": "0",
  "INV_1_invAmpAbnormal": "0",
  "INV_1_waitForTriggerSignal": "0",
  "INV_1_insulFault": "0",
  "INV_1_pvInputOverVolt": "0",
  "INV_1_powerModOverTemp": "0",
  "INV_1_innerCommFault": "0",
  "INV_1_busOverVolt": "0",
  "INV_1_boostOverCurr": "0",
  "INV_1_tempSwitchProt": "0",
  "INV_1_fanFault": "0",
  "INV_1_initFault": "0",
  "INV_1_dcSpdAbnormal": "0",
  "INV_1_innerOverTemp": "0",
  "INV_1_tempLow": "0",
  "INV_1_extCtFault": "0",
  "INV_1_smartMeterAbnormal": "0",
  "INV_1_probExpired": "0",
  "INV_1_probApproaching": "0",
  "INV_1_hmiCommFault": "0",
  "INV_1_arcCommFault": "0",
  "INV_1_meterCommFault": "0"
}
```
4. fault load

**Topik**
```
data/m4gno5cmvz3n0xtur7op/realtime/m4gno5cm/faultload1/7061337700120175068
```
**Payload**
```json
{
  "_terminalTime": "2026-02-03 10:43:11.338",
  "_groupName": "FaultLoad1",
  "INV_1_overloadAlarm": "0",
  "INV_1_overloadProt": "0",
  "INV_1_shortCircuitProt": "0"
}
```
5. fault mqtt

**Topik**
```
data/m4gno5cmvz3n0xtur7op/realtime/m4gno5cm/faultmqtt1/7061337700120175068
```
**Payload**
```json
{
  "_terminalTime": "2026-02-03 10:43:11.338",
  "_groupName": "FaultMQTT1",
  "INV_1_mppt1OverVolt": "0",
  "INV_1_mppt2OverVolt": "0",
  "INV_1_mppt3OverVolt": "0",
  "INV_1_mppt4OverVolt": "0",
  "INV_1_mppt5OverVolt": "0",
  "INV_1_mppt6OverVolt": "0",
  "INV_1_mppt7OverVolt": "0",
  "INV_1_mppt8OverVolt": "0",
  "INV_1_mppt1OverCurr": "0",
  "INV_1_mppt2OverCurr": "0",
  "INV_1_mppt3OverCurr": "0",
  "INV_1_mppt4OverCurr": "0",
  "INV_1_mppt5OverCurr": "0",
  "INV_1_mppt6OverCurr": "0",
  "INV_1_mppt7OverCurr": "0",
  "INV_1_mppt8OverCurr": "0",
  "INV_1_mppt1RevConn": "0",
  "INV_1_mppt2RevConn": "0",
  "INV_1_mppt3RevConn": "0",
  "INV_1_mppt4RevConn": "0",
  "INV_1_mppt5RevConn": "0",
  "INV_1_mppt6RevConn": "0",
  "INV_1_mppt7RevConn": "0",
  "INV_1_mppt8RevConn": "0",
  "INV_1_mppt1InsulFault": "0",
  "INV_1_mppt2InsulFault": "0",
  "INV_1_mppt3InsulFault": "0",
  "INV_1_mppt4InsulFault": "0",
  "INV_1_mppt5InsulFault": "0",
  "INV_1_mppt6InsulFault": "0",
  "INV_1_mppt7InsulFault": "0",
  "INV_1_mppt8InsulFault": "0",
  "INV_1_mppt1OverTemp": "0",
  "INV_1_mppt2OverTemp": "0",
  "INV_1_mppt3OverTemp": "0",
  "INV_1_mppt4OverTemp": "0",
  "INV_1_mppt5OverTemp": "0",
  "INV_1_mppt6OverTemp": "0",
  "INV_1_mppt7OverTemp": "0",
  "INV_1_mppt8OverTemp": "0",
  "INV_1_mppt1DcArcFault": "0",
  "INV_1_mppt2DcArcFault": "0",
  "INV_1_mppt3DcArcFault": "0",
  "INV_1_mppt4DcArcFault": "0",
  "INV_1_mppt5DcArcFault": "0",
  "INV_1_mppt6DcArcFault": "0",
  "INV_1_mppt7DcArcFault": "0",
  "INV_1_mppt8DcArcFault": "0"
}
```
6. fault other

**Topik**
```
data/m4gno5cmvz3n0xtur7op/realtime/m4gno5cm/faultother1/7061337700120175068
```
**Payload**
```json
{
  "_terminalTime": "2026-02-03 10:43:11.338",
  "_groupName": "FaultOther1",
  "INV_1_devLockStatus": "0",
  "INV_1_probStatus": "0"
}
```
7. fault pv

**Topik**
```
data/m4gno5cmvz3n0xtur7op/realtime/m4gno5cm/faultpv1/7061337700120175068
```
**Payload**
```json
{
  "_terminalTime": "2026-02-03 10:43:11.338",
  "_groupName": "FaultPV1",
  "INV_1_pv1OverCurr": "0",
  "INV_1_pv2OverCurr": "0",
  "INV_1_pv3OverCurr": "0",
  "INV_1_pv4OverCurr": "0",
  "INV_1_pv5OverCurr": "0",
  "INV_1_pv6OverCurr": "0",
  "INV_1_pv7OverCurr": "0",
  "INV_1_pv8OverCurr": "0",
  "INV_1_pv9OverCurr": "0",
  "INV_1_pv10OverCurr": "0",
  "INV_1_pv11OverCurr": "0",
  "INV_1_pv12OverCurr": "0",
  "INV_1_pv13OverCurr": "0",
  "INV_1_pv14OverCurr": "0",
  "INV_1_pv15OverCurr": "0",
  "INV_1_pv16OverCurr": "0",
  "INV_1_pv17OverCurr": "0",
  "INV_1_pv18OverCurr": "0",
  "INV_1_pv19OverCurr": "0",
  "INV_1_pv20OverCurr": "0",
  "INV_1_pv21OverCurr": "0",
  "INV_1_pv22OverCurr": "0",
  "INV_1_pv23OverCurr": "0",
  "INV_1_pv24OverCurr": "0",
  "INV_1_pv25OverCurr": "0",
  "INV_1_pv26OverCurr": "0",
  "INV_1_pv27OverCurr": "0",
  "INV_1_pv28OverCurr": "0",
  "INV_1_pv29OverCurr": "0",
  "INV_1_pv30OverCurr": "0",
  "INV_1_pv31OverCurr": "0",
  "INV_1_pv32OverCurr": "0",
  "INV_1_pv1RevConn": "0",
  "INV_1_pv2RevConn": "0",
  "INV_1_pv3RevConn": "0",
  "INV_1_pv4RevConn": "0",
  "INV_1_pv5RevConn": "0",
  "INV_1_pv6RevConn": "0",
  "INV_1_pv7RevConn": "0",
  "INV_1_pv8RevConn": "0",
  "INV_1_pv9RevConn": "0",
  "INV_1_pv10RevConn": "0",
  "INV_1_pv11RevConn": "0",
  "INV_1_pv12RevConn": "0",
  "INV_1_pv13RevConn": "0",
  "INV_1_pv14RevConn": "0",
  "INV_1_pv15RevConn": "0",
  "INV_1_pv16RevConn": "0",
  "INV_1_pv17RevConn": "0",
  "INV_1_pv18RevConn": "0",
  "INV_1_pv19RevConn": "0",
  "INV_1_pv20RevConn": "0",
  "INV_1_pv21RevConn": "0",
  "INV_1_pv22RevConn": "0",
  "INV_1_pv23RevConn": "0",
  "INV_1_pv24RevConn": "0",
  "INV_1_pv25RevConn": "0",
  "INV_1_pv26RevConn": "0",
  "INV_1_pv27RevConn": "0",
  "INV_1_pv28RevConn": "0",
  "INV_1_pv29RevConn": "0",
  "INV_1_pv30RevConn": "0",
  "INV_1_pv31RevConn": "0",
  "INV_1_pv32RevConn": "0"
}
```
8. information device

**Topik**
```
data/m4gno5cmvz3n0xtur7op/realtime/m4gno5cm/informdevice1/7061337700120175068
```
**Payload**
```json
{
  "_terminalTime": "2026-02-03 10:43:11.339",
  "_groupName": "InformDevice1",
  "INV_1_modelAscii1": "21328",
  "INV_1_modelAscii2": "18741",
  "INV_1_modelAscii3": "12363",
  "INV_1_modelAscii4": "11586",
  "INV_1_modelAscii5": "0",
  "INV_1_modelAscii6": "0",
  "INV_1_modelAscii7": "0",
  "INV_1_modelAscii8": "0",
  "INV_1_modelAscii9": "0",
  "INV_1_modelAscii10": "0",
  "INV_1_hmiVersionAscii1": "22065",
  "INV_1_hmiVersionAscii2": "0",
  "INV_1_hmiVersionAscii3": "0",
  "INV_1_hmiVersionAscii4": "0",
  "INV_1_hmiVersionAscii5": "0",
  "INV_1_serialNumberAscii1": "13616",
  "INV_1_serialNumberAscii2": "12597",
  "INV_1_serialNumberAscii3": "12337",
  "INV_1_serialNumberAscii4": "12343",
  "INV_1_serialNumberAscii5": "14641",
  "INV_1_serialNumberAscii6": "13872",
  "INV_1_serialNumberAscii7": "19777",
  "INV_1_serialNumberAscii8": "12592",
  "INV_1_serialNumberAscii9": "12336",
  "INV_1_serialNumberAscii10": "12341",
  "INV_1_controlSoftware1VersionAscii1": "22065",
  "INV_1_controlSoftware1VersionAscii2": "0",
  "INV_1_controlSoftware1VersionAscii3": "0",
  "INV_1_controlSoftware1VersionAscii4": "0",
  "INV_1_controlSoftware1VersionAscii5": "0",
  "INV_1_controlSoftware2VersionAscii1": "22065",
  "INV_1_controlSoftware2VersionAscii2": "0",
  "INV_1_controlSoftware2VersionAscii3": "0",
  "INV_1_controlSoftware2VersionAscii4": "0",
  "INV_1_controlSoftware2VersionAscii5": "0",
  "INV_1_deviceType": "1",
  "INV_1_mpptQuantity": "3",
  "INV_1_protocolType": "1",
  "INV_1_protocolVersionAscii1": "22065",
  "INV_1_protocolVersionAscii2": "11824",
  "INV_1_protocolVersionAscii3": "13824",
  "INV_1_protocolVersionAscii4": "0",
  "INV_1_protocolVersionAscii5": "0",
  "INV_1_manufacturerInfoAscii1": "19301",
  "INV_1_manufacturerInfoAscii2": "26741",
  "INV_1_manufacturerInfoAscii3": "24832",
  "INV_1_manufacturerInfoAscii4": "0",
  "INV_1_manufacturerInfoAscii5": "0",
  "INV_1_manufacturerInfoAscii6": "0",
  "INV_1_manufacturerInfoAscii7": "0",
  "INV_1_manufacturerInfoAscii8": "0",
  "INV_1_manufacturerInfoAscii9": "0",
  "INV_1_manufacturerInfoAscii10": "0",
  "INV_1_manufacturerInfoAscii11": "0",
  "INV_1_manufacturerInfoAscii12": "0",
  "INV_1_manufacturerInfoAscii13": "0",
  "INV_1_manufacturerInfoAscii14": "0",
  "INV_1_manufacturerInfoAscii15": "0",
  "INV_1_pvBranchQuantity": "9",
  "INV_1_remainingProbationTime": "0",
  "INV_1_controlSoftware3VersionAscii1": "0",
  "INV_1_controlSoftware3VersionAscii2": "0",
  "INV_1_controlSoftware3VersionAscii3": "0",
  "INV_1_controlSoftware3VersionAscii4": "0",
  "INV_1_controlSoftware3VersionAscii5": "0"
}
```
9. inverter

**Topik**
```
data/m4gno5cmvz3n0xtur7op/realtime/m4gno5cm/inverter1/7061337700120175068
```
**Payload**
```json
{
  "_terminalTime": "2026-02-03 10:43:11.338",
  "_groupName": "RealtimeInverter1",
  "INV_1_devStatus": "1",
  "INV_1_dailyEnergy": "568",
  "INV_1_totalEnergy1": "28",
  "INV_1_totalEnergy2": "55166",
  "INV_1_gridFreq": "4997",
  "INV_1_uPhaseUvGridVolt": "2236",
  "INV_1_vPhaseVwGridVolt": "2219",
  "INV_1_wPhaseWuGridVolt": "2240",
  "INV_1_uPhaseGridCurr": "191",
  "INV_1_vPhaseGridCurr": "176",
  "INV_1_wPhaseGridCurr": "185",
  "INV_1_gridConnTotalActivePower": "122",
  "INV_1_gridConnTotalReactivePower": "0",
  "INV_1_heatsinkTemp": "570",
  "INV_1_innerTemp": "480",
  "INV_1_gridConnTotalApparentPower": "122",
  "INV_1_igbtTemp": "550",
  "INV_1_outputPowerFactor": "100",
  "INV_1_pvInputTotalPower": "128",
  "INV_1_acLeakageCurr": "85",
  "INV_1_dailyPowerConsump": "0",
  "INV_1_totalPowerConsump1": "0",
  "INV_1_totalPowerConsump2": "0",
  "INV_1_onGridActivePower": "0",
  "INV_1_onGridApparentPower": "0",
  "INV_1_onGridReactivePower": "0",
  "INV_1_onGridPowerFactor": "0"
}
```
10. load

**Topik**
```
data/m4gno5cmvz3n0xtur7op/realtime/m4gno5cm/load1/7061337700120175068
```
**Payload**
```json
{
  "_terminalTime": "2026-02-03 10:43:11.338",
  "_groupName": "RealtimeLoad1",
  "INV_1_uPhaseLoadVolt": "0",
  "INV_1_vPhaseLoadVolt": "0",
  "INV_1_wPhaseLoadVolt": "0",
  "INV_1_uPhaseLoadCurr": "0",
  "INV_1_vPhaseLoadCurr": "0",
  "INV_1_wPhaseLoadCurr": "0",
  "INV_1_loadTotalActivePower": "0",
  "INV_1_loadTotalReactivePower": "0",
  "INV_1_loadTotalApparentPower": "0",
  "INV_1_uPhaseLoadActivePower": "0",
  "INV_1_vPhaseLoadActivePower": "0",
  "INV_1_wPhaseLoadActivePower": "0",
  "INV_1_uPhaseLoadReactivePower": "0",
  "INV_1_vPhaseLoadReactivePower": "0",
  "INV_1_wPhaseLoadReactivePower": "0",
  "INV_1_uPhaseLoadApparentPower": "0",
  "INV_1_vPhaseLoadApparentPower": "0",
  "INV_1_wPhaseLoadApparentPower": "0",
  "INV_1_uPhaseLoadPowerFactor": "0",
  "INV_1_vPhaseLoadPowerFactor": "0",
  "INV_1_wPhaseLoadPowerFactor": "0",
  "INV_1_loadPowerFactor": "0",
  "INV_1_dailyLoadPowerConsump": "0",
  "INV_1_totalLoadPowerConsump1": "0",
  "INV_1_totalLoadPowerConsump2": "0"
}
```
11. mppt

**Topik**
```
data/m4gno5cmvz3n0xtur7op/realtime/m4gno5cm/mppt1/7061337700120175068
```
**Payload**
```json
{
  "_terminalTime": "2026-02-03 10:43:11.338",
  "_groupName": "RealtimeMPPT1",
  "INV_1_dailyPvEnergy": "568",
  "INV_1_totalPvEnergy1": "28",
  "INV_1_totalPvEnergy2": "55166",
  "INV_1_totalInsulationImp": "2920",
  "INV_1_voltOfMppt1": "4665",
  "INV_1_voltOfMppt2": "4559",
  "INV_1_voltOfMppt3": "4596",
  "INV_1_voltOfMppt4": "0",
  "INV_1_voltOfMppt5": "0",
  "INV_1_voltOfMppt6": "0",
  "INV_1_voltOfMppt7": "0",
  "INV_1_voltOfMppt8": "0",
  "INV_1_currOfMppt1": "100",
  "INV_1_currOfMppt2": "86",
  "INV_1_currOfMppt3": "90",
  "INV_1_currOfMppt4": "0",
  "INV_1_currOfMppt5": "0",
  "INV_1_currOfMppt6": "0",
  "INV_1_currOfMppt7": "0",
  "INV_1_currOfMppt8": "0"
}
```
12. pv

**Topik**
```
data/m4gno5cmvz3n0xtur7op/realtime/m4gno5cm/pv1/7061337700120175068
```
**Payload**
```json
{
  "_terminalTime": "2026-02-03 10:43:11.338",
  "_groupName": "RealtimePV1",
  "INV_1_voltageOfPv1": "4665",
  "INV_1_voltageOfPv2": "4665",
  "INV_1_voltageOfPv3": "4665",
  "INV_1_voltageOfPv4": "4559",
  "INV_1_voltageOfPv5": "4559",
  "INV_1_voltageOfPv6": "4559",
  "INV_1_voltageOfPv7": "4596",
  "INV_1_voltageOfPv8": "4596",
  "INV_1_voltageOfPv9": "4596",
  "INV_1_voltageOfPv10": "0",
  "INV_1_voltageOfPv11": "0",
  "INV_1_voltageOfPv12": "0",
  "INV_1_voltageOfPv13": "0",
  "INV_1_voltageOfPv14": "0",
  "INV_1_voltageOfPv15": "0",
  "INV_1_voltageOfPv16": "0",
  "INV_1_voltageOfPv17": "0",
  "INV_1_voltageOfPv18": "0",
  "INV_1_voltageOfPv19": "0",
  "INV_1_voltageOfPv20": "0",
  "INV_1_voltageOfPv21": "0",
  "INV_1_voltageOfPv22": "0",
  "INV_1_voltageOfPv23": "0",
  "INV_1_voltageOfPv24": "0",
  "INV_1_voltageOfPv25": "0",
  "INV_1_voltageOfPv26": "0",
  "INV_1_voltageOfPv27": "0",
  "INV_1_voltageOfPv28": "0",
  "INV_1_voltageOfPv29": "0",
  "INV_1_voltageOfPv30": "0",
  "INV_1_voltageOfPv31": "0",
  "INV_1_voltageOfPv32": "0",
  "INV_1_currentOfPv1": "49",
  "INV_1_currentOfPv2": "49",
  "INV_1_currentOfPv3": "1",
  "INV_1_currentOfPv4": "38",
  "INV_1_currentOfPv5": "46",
  "INV_1_currentOfPv6": "1",
  "INV_1_currentOfPv7": "46",
  "INV_1_currentOfPv8": "42",
  "INV_1_currentOfPv9": "1",
  "INV_1_currentOfPv10": "0",
  "INV_1_currentOfPv11": "0",
  "INV_1_currentOfPv12": "0",
  "INV_1_currentOfPv13": "0",
  "INV_1_currentOfPv14": "0",
  "INV_1_currentOfPv15": "0",
  "INV_1_currentOfPv16": "0",
  "INV_1_currentOfPv17": "0",
  "INV_1_currentOfPv18": "0",
  "INV_1_currentOfPv19": "0",
  "INV_1_currentOfPv20": "0",
  "INV_1_currentOfPv21": "0",
  "INV_1_currentOfPv22": "0",
  "INV_1_currentOfPv23": "0",
  "INV_1_currentOfPv24": "0",
  "INV_1_currentOfPv25": "0",
  "INV_1_currentOfPv26": "0",
  "INV_1_currentOfPv27": "0",
  "INV_1_currentOfPv28": "0",
  "INV_1_currentOfPv29": "0",
  "INV_1_currentOfPv30": "0",
  "INV_1_currentOfPv31": "0",
  "INV_1_currentOfPv32": "0",
  "INV_1_powerOfPv1": "22",
  "INV_1_powerOfPv2": "22",
  "INV_1_powerOfPv3": "0",
  "INV_1_powerOfPv4": "17",
  "INV_1_powerOfPv5": "21",
  "INV_1_powerOfPv6": "0",
  "INV_1_powerOfPv7": "21",
  "INV_1_powerOfPv8": "19",
  "INV_1_powerOfPv9": "0",
  "INV_1_powerOfPv10": "0",
  "INV_1_powerOfPv11": "0",
  "INV_1_powerOfPv12": "0",
  "INV_1_powerOfPv13": "0",
  "INV_1_powerOfPv14": "0",
  "INV_1_powerOfPv15": "0",
  "INV_1_powerOfPv16": "0",
  "INV_1_powerOfPv17": "0",
  "INV_1_powerOfPv18": "0",
  "INV_1_powerOfPv19": "0",
  "INV_1_powerOfPv20": "0",
  "INV_1_powerOfPv21": "0",
  "INV_1_powerOfPv22": "0",
  "INV_1_powerOfPv23": "0",
  "INV_1_powerOfPv24": "0",
  "INV_1_powerOfPv25": "0",
  "INV_1_powerOfPv26": "0",
  "INV_1_powerOfPv27": "0",
  "INV_1_powerOfPv28": "0",
  "INV_1_powerOfPv29": "0",
  "INV_1_powerOfPv30": "0",
  "INV_1_powerOfPv31": "0",
  "INV_1_powerOfPv32": "0"
}
```
13. setting analog

**Topik**
```
data/m4gno5cmvz3n0xtur7op/realtime/m4gno5cm/settinganalog1/7061337700120175068
```
**Payload**
```json
{
  "_terminalTime": "2026-02-03 10:43:11.339",
  "_groupName": "SettingAnalog1",
  "INV_1_onOffSettingSingleRegister": "500",
  "INV_1_powerFactor": "1",
  "INV_1_reactivePower": "100",
  "INV_1_gridControlPower": "0",
  "INV_1_batteryChargeDischargePower": "0",
  "INV_1_systemTimeSettingYear": "26",
  "INV_1_systemTimeSettingMonth": "2",
  "INV_1_systemTimeSettingDay": "3",
  "INV_1_systemTimeSettingHour": "11",
  "INV_1_systemTimeSettingMinute": "25",
  "INV_1_systemTimeSettingSecond": "52"
}
```
14. setting switch

**Topik**
```
data/m4gno5cmvz3n0xtur7op/realtime/m4gno5cm/settingswitch1/7061337700120175068
```
**Payload**
```json
{
  "_terminalTime": "2026-02-03 10:43:11.339",
  "_groupName": "SettingSwitch1",
  "INV_1_onOffSetting": "1",
  "INV_1_powerControlStrategy": "0",
  "INV_1_externalControlModeEnable": "0",
  "INV_1_activeIslandingEnable": "1",
  "INV_1_plantMode": "0",
  "INV_1_antiPidFunction": "0",
  "INV_1_reset": "0",
  "INV_1_selfStartAfterPoweringOn": "1",
  "INV_1_clearArcingFault": "0",
  "INV_1_recoverEnableGridConnected": "1"
}
```
--- 
#### 2. SPI100K - SPI125K
**History**
1. Inverter

**Topik**
```
data/mhsj3jqn0lok167x4buu/history/mhsitz7c/inverter/7011957300020111017
```
**Payload**
```json
{
  "_terminalTime": "2026-02-03 09:11:31.928",
  "_groupName": "HistoryInverter1",
  "INV_1_operatingStatus": "256",
  "INV_1_dailyEnergy": "1380",
  "INV_1_totalEnergy1": "3",
  "INV_1_totalEnergy2": "1142",
  "INV_1_gridFrequency": "4999",
  "INV_1_inspectingPower1": "1",
  "INV_1_inspectingPower2": "21992",
  "INV_1_activePower1": "1",
  "INV_1_activePower2": "21993",
  "INV_1_reactivePower1": "0",
  "INV_1_reactivePower2": "17",
  "INV_1_totalPowerFactor": "1000",
  "INV_1_powerGridUVoltage": "3986",
  "INV_1_powerGridVVoltage": "4011",
  "INV_1_powerGridWVoltage": "3995",
  "INV_1_powerGridUCurrent": "1266",
  "INV_1_powerGridVCurrent": "1262",
  "INV_1_powerGridWCurrent": "1270",
  "INV_1_acLeakageCurrent": "231",
  "INV_1_radiatorTemperatureBoost": "549",
  "INV_1_radiatorTemperatureInverter": "586",
  "INV_1_igbtTemperatureBoost": "730",
  "INV_1_igbtTemperatureInverter": "694",
  "INV_1_internalTemperature": "554",
  "INV_1_busVoltageInverter": "6404",
  "INV_1_insulationResistance": "10585",
  "INV_1_pvTotalPower": "882",
  "INV_1_busCapacitanceValue": "2255",
  "INV_1_defendPidOperatingStatus": "0",
  "INV_1_repairVoltage": "0"
}
```
2. MPPT

**Topik**
```
data/mhsj3jqn0lok167x4buu/history/mhsitz7c/mppt/7011957300020111017
```
**Payload**
```json
{
  "_terminalTime": "2026-02-03 09:11:31.928",
  "_groupName": "HistoryMPPT1",
  "INV_1_mppt1Voltage": "5873",
  "INV_1_mppt2Voltage": "5784",
  "INV_1_mppt3Voltage": "5896",
  "INV_1_mppt4Voltage": "5194",
  "INV_1_mppt5Voltage": "4581",
  "INV_1_mppt6Voltage": "4639",
  "INV_1_mppt7Voltage": "4638",
  "INV_1_mppt8Voltage": "4240",
  "INV_1_mppt9Voltage": "2276",
  "INV_1_mppt10Voltage": "0",
  "INV_1_mppt11Voltage": "0",
  "INV_1_mppt12Voltage": "0",
  "INV_1_mppt13Voltage": "0",
  "INV_1_mppt14Voltage": "0",
  "INV_1_mppt15Voltage": "0",
  "INV_1_mppt16Voltage": "0",
  "INV_1_mppt1Current": "204",
  "INV_1_mppt2Current": "208",
  "INV_1_mppt3Current": "208",
  "INV_1_mppt4Current": "203",
  "INV_1_mppt5Current": "224",
  "INV_1_mppt6Current": "223",
  "INV_1_mppt7Current": "226",
  "INV_1_mppt8Current": "208",
  "INV_1_mppt9Current": "4",
  "INV_1_mppt10Current": "0",
  "INV_1_mppt11Current": "0",
  "INV_1_mppt12Current": "0",
  "INV_1_mppt13Current": "0",
  "INV_1_mppt14Current": "0",
  "INV_1_mppt15Current": "0",
  "INV_1_mppt16Current": "0"
}
```
3. PV

**Topik**
```
data/mhsj3jqn0lok167x4buu/history/mhsitz7c/pv/7011957300020111017
```
**Payload**
```json
{
  "_terminalTime": "2026-02-03 09:11:31.928",
  "_groupName": "HistoryPV1",
  "INV_1_pv1Voltage": "5873",
  "INV_1_pv2Voltage": "5873",
  "INV_1_pv3Voltage": "5784",
  "INV_1_pv4Voltage": "5784",
  "INV_1_pv5Voltage": "5896",
  "INV_1_pv6Voltage": "5896",
  "INV_1_pv7Voltage": "5194",
  "INV_1_pv8Voltage": "5194",
  "INV_1_pv9Voltage": "4580",
  "INV_1_pv10Voltage": "4580",
  "INV_1_pv11Voltage": "4637",
  "INV_1_pv12Voltage": "4637",
  "INV_1_pv13Voltage": "4636",
  "INV_1_pv14Voltage": "4636",
  "INV_1_pv15Voltage": "4240",
  "INV_1_pv16Voltage": "4240",
  "INV_1_pv17Voltage": "2282",
  "INV_1_pv18Voltage": "2282",
  "INV_1_pv19Voltage": "0",
  "INV_1_pv20Voltage": "0",
  "INV_1_pv21Voltage": "0",
  "INV_1_pv22Voltage": "0",
  "INV_1_pv23Voltage": "0",
  "INV_1_pv24Voltage": "0",
  "INV_1_pv25Voltage": "0",
  "INV_1_pv26Voltage": "0",
  "INV_1_pv27Voltage": "0",
  "INV_1_pv28Voltage": "0",
  "INV_1_pv29Voltage": "0",
  "INV_1_pv30Voltage": "0",
  "INV_1_pv31Voltage": "0",
  "INV_1_pv32Voltage": "0",
  "INV_1_pv1Current": "103",
  "INV_1_pv2Current": "99",
  "INV_1_pv3Current": "106",
  "INV_1_pv4Current": "101",
  "INV_1_pv5Current": "100",
  "INV_1_pv6Current": "108",
  "INV_1_pv7Current": "97",
  "INV_1_pv8Current": "106",
  "INV_1_pv9Current": "119",
  "INV_1_pv10Current": "104",
  "INV_1_pv11Current": "105",
  "INV_1_pv12Current": "118",
  "INV_1_pv13Current": "114",
  "INV_1_pv14Current": "112",
  "INV_1_pv15Current": "109",
  "INV_1_pv16Current": "99",
  "INV_1_pv17Current": "2",
  "INV_1_pv18Current": "1",
  "INV_1_pv19Current": "0",
  "INV_1_pv20Current": "0",
  "INV_1_pv21Current": "0",
  "INV_1_pv22Current": "0",
  "INV_1_pv23Current": "0",
  "INV_1_pv24Current": "0",
  "INV_1_pv25Current": "0",
  "INV_1_pv26Current": "0",
  "INV_1_pv27Current": "0",
  "INV_1_pv28Current": "0",
  "INV_1_pv29Current": "0",
  "INV_1_pv30Current": "0",
  "INV_1_pv31Current": "0",
  "INV_1_pv32Current": "0",
  "INV_1_pv1Power": "60",
  "INV_1_pv2Power": "58",
  "INV_1_pv3Power": "61",
  "INV_1_pv4Power": "58",
  "INV_1_pv5Power": "59",
  "INV_1_pv6Power": "63",
  "INV_1_pv7Power": "50",
  "INV_1_pv8Power": "55",
  "INV_1_pv9Power": "54",
  "INV_1_pv10Power": "47",
  "INV_1_pv11Power": "48",
  "INV_1_pv12Power": "54",
  "INV_1_pv13Power": "52",
  "INV_1_pv14Power": "52",
  "INV_1_pv15Power": "46",
  "INV_1_pv16Power": "42",
  "INV_1_pv17Power": "0",
  "INV_1_pv18Power": "0",
  "INV_1_pv19Power": "0",
  "INV_1_pv20Power": "0",
  "INV_1_pv21Power": "0",
  "INV_1_pv22Power": "0",
  "INV_1_pv23Power": "0",
  "INV_1_pv24Power": "0",
  "INV_1_pv25Power": "0",
  "INV_1_pv26Power": "0",
  "INV_1_pv27Power": "0",
  "INV_1_pv28Power": "0",
  "INV_1_pv29Power": "0",
  "INV_1_pv30Power": "0",
  "INV_1_pv31Power": "0",
  "INV_1_pv32Power": "0"
}
```
---
**Realtime**
4. Information

**Topik**
```
data/mhsj3jqn0lok167x4buu/realtime/mhsj2kc9/information1/7011957300020111017
```
**Payload**
```json
{
  "_terminalTime": "2026-02-02 14:15:11.929",
  "_groupName": "RealtimeInformation1",
  "INV_1_pvNumberOfBranches": "18",
  "INV_1_mpptQuality": "9",
  "INV_1_remainingTimeOfTrialPeriod": "0",
  "INV_1_ratedPower": "1250",
  "INV_1_maximumApparentPower": "1250",
  "INV_1_maximumActivePower": "1250",
  "INV_1_maximumReactivePower": "750",
  "INV_1_minimumPowerFactor": "800"
}
```
5. Inverter

**Topik**
```
data/mhsj3jqn0lok167x4buu/realtime/mhsj2kc9/inverter2/7011957300020111049
```
**Payload**
```json
{
  "_terminalTime": "2026-02-02 14:27:54.297",
  "_groupName": "RealtimeInverter1",
  "INV_1_operatingStatus": "256",
  "INV_1_dailyEnergy": "4440",
  "INV_1_totalEnergy1": "3",
  "INV_1_totalEnergy2": "48362",
  "INV_1_gridFrequency": "4996",
  "INV_1_inspectingPower1": "0",
  "INV_1_inspectingPower2": "41345",
  "INV_1_activePower1": "0",
  "INV_1_activePower2": "41345",
  "INV_1_reactivePower1": "0",
  "INV_1_reactivePower2": "1",
  "INV_1_totalPowerFactor": "1000",
  "INV_1_powerGridUVoltage": "4073",
  "INV_1_powerGridVVoltage": "4084",
  "INV_1_powerGridWVoltage": "4074",
  "INV_1_powerGridUCurrent": "586",
  "INV_1_powerGridVCurrent": "586",
  "INV_1_powerGridWCurrent": "588",
  "INV_1_acLeakageCurrent": "216",
  "INV_1_radiatorTemperatureBoost": "482",
  "INV_1_radiatorTemperatureInverter": "510",
  "INV_1_igbtTemperatureBoost": "556",
  "INV_1_igbtTemperatureInverter": "571",
  "INV_1_internalTemperature": "491",
  "INV_1_busVoltageInverter": "6855",
  "INV_1_insulationResistance": "9852",
  "INV_1_pvTotalPower": "416",
  "INV_1_busCapacitanceValue": "2255",
  "INV_1_defendPidOperatingStatus": "0",
  "INV_1_repairVoltage": "0"
}
```
6. PV

**Topik**
```
data/mhsj3jqn0lok167x4buu/realtime/mhsj2kc9/pv2/7011957300020111049
```
**Payload**
```json
{
  "_terminalTime": "2026-02-02 14:28:54.297",
  "_groupName": "RealtimePV1",
  "INV_1_pv1Voltage": "6361",
  "INV_1_pv2Voltage": "6361",
  "INV_1_pv3Voltage": "6315",
  "INV_1_pv4Voltage": "6315",
  "INV_1_pv5Voltage": "6336",
  "INV_1_pv6Voltage": "6336",
  "INV_1_pv7Voltage": "5488",
  "INV_1_pv8Voltage": "5488",
  "INV_1_pv9Voltage": "6124",
  "INV_1_pv10Voltage": "6124",
  "INV_1_pv11Voltage": "6273",
  "INV_1_pv12Voltage": "6273",
  "INV_1_pv13Voltage": "6194",
  "INV_1_pv14Voltage": "6194",
  "INV_1_pv15Voltage": "5410",
  "INV_1_pv16Voltage": "5410",
  "INV_1_pv17Voltage": "2499",
  "INV_1_pv18Voltage": "2499",
  "INV_1_pv19Voltage": "0",
  "INV_1_pv20Voltage": "0",
  "INV_1_pv21Voltage": "0",
  "INV_1_pv22Voltage": "0",
  "INV_1_pv23Voltage": "0",
  "INV_1_pv24Voltage": "0",
  "INV_1_pv25Voltage": "0",
  "INV_1_pv26Voltage": "0",
  "INV_1_pv27Voltage": "0",
  "INV_1_pv28Voltage": "0",
  "INV_1_pv29Voltage": "0",
  "INV_1_pv30Voltage": "0",
  "INV_1_pv31Voltage": "0",
  "INV_1_pv32Voltage": "0",
  "INV_1_pv1Current": "41",
  "INV_1_pv2Current": "41",
  "INV_1_pv3Current": "40",
  "INV_1_pv4Current": "44",
  "INV_1_pv5Current": "40",
  "INV_1_pv6Current": "44",
  "INV_1_pv7Current": "40",
  "INV_1_pv8Current": "42",
  "INV_1_pv9Current": "40",
  "INV_1_pv10Current": "39",
  "INV_1_pv11Current": "39",
  "INV_1_pv12Current": "42",
  "INV_1_pv13Current": "43",
  "INV_1_pv14Current": "37",
  "INV_1_pv15Current": "43",
  "INV_1_pv16Current": "37",
  "INV_1_pv17Current": "1",
  "INV_1_pv18Current": "65535",
  "INV_1_pv19Current": "0",
  "INV_1_pv20Current": "0",
  "INV_1_pv21Current": "0",
  "INV_1_pv22Current": "0",
  "INV_1_pv23Current": "0",
  "INV_1_pv24Current": "0",
  "INV_1_pv25Current": "0",
  "INV_1_pv26Current": "0",
  "INV_1_pv27Current": "0",
  "INV_1_pv28Current": "0",
  "INV_1_pv29Current": "0",
  "INV_1_pv30Current": "0",
  "INV_1_pv31Current": "0",
  "INV_1_pv32Current": "0",
  "INV_1_pv1Power": "26",
  "INV_1_pv2Power": "26",
  "INV_1_pv3Power": "25",
  "INV_1_pv4Power": "27",
  "INV_1_pv5Power": "25",
  "INV_1_pv6Power": "27",
  "INV_1_pv7Power": "22",
  "INV_1_pv8Power": "23",
  "INV_1_pv9Power": "24",
  "INV_1_pv10Power": "23",
  "INV_1_pv11Power": "24",
  "INV_1_pv12Power": "26",
  "INV_1_pv13Power": "26",
  "INV_1_pv14Power": "23",
  "INV_1_pv15Power": "23",
  "INV_1_pv16Power": "20",
  "INV_1_pv17Power": "0",
  "INV_1_pv18Power": "0",
  "INV_1_pv19Power": "0",
  "INV_1_pv20Power": "0",
  "INV_1_pv21Power": "0",
  "INV_1_pv22Power": "0",
  "INV_1_pv23Power": "0",
  "INV_1_pv24Power": "0",
  "INV_1_pv25Power": "0",
  "INV_1_pv26Power": "0",
  "INV_1_pv27Power": "0",
  "INV_1_pv28Power": "0",
  "INV_1_pv29Power": "0",
  "INV_1_pv30Power": "0",
  "INV_1_pv31Power": "0",
  "INV_1_pv32Power": "0"
}
```
7. MPPT

**Topik**
```
data/mhsj3jqn0lok167x4buu/realtime/mhsj2kc9/mppt2/7011957300020111049
```
**Payload**
```json
{
  "_terminalTime": "2026-02-02 14:38:14.297",
  "_groupName": "RealtimeMPPT1",
  "INV_1_mppt1Voltage": "6272",
  "INV_1_mppt2Voltage": "6238",
  "INV_1_mppt3Voltage": "6238",
  "INV_1_mppt4Voltage": "5483",
  "INV_1_mppt5Voltage": "6085",
  "INV_1_mppt6Voltage": "6145",
  "INV_1_mppt7Voltage": "6078",
  "INV_1_mppt8Voltage": "5377",
  "INV_1_mppt9Voltage": "2461",
  "INV_1_mppt10Voltage": "0",
  "INV_1_mppt11Voltage": "0",
  "INV_1_mppt12Voltage": "0",
  "INV_1_mppt13Voltage": "0",
  "INV_1_mppt14Voltage": "0",
  "INV_1_mppt15Voltage": "0",
  "INV_1_mppt16Voltage": "0",
  "INV_1_mppt1Current": "95",
  "INV_1_mppt2Current": "96",
  "INV_1_mppt3Current": "96",
  "INV_1_mppt4Current": "94",
  "INV_1_mppt5Current": "90",
  "INV_1_mppt6Current": "94",
  "INV_1_mppt7Current": "92",
  "INV_1_mppt8Current": "91",
  "INV_1_mppt9Current": "0",
  "INV_1_mppt10Current": "0",
  "INV_1_mppt11Current": "0",
  "INV_1_mppt12Current": "0",
  "INV_1_mppt13Current": "0",
  "INV_1_mppt14Current": "0",
  "INV_1_mppt15Current": "0",
  "INV_1_mppt16Current": "0"
}
```
8. Setting

**Topik**
```
data/mhsj3jqn0lok167x4buu/realtime/mhsj2kc9/setting2/7011957300020111049 
```
**Payload**
```json
{
  "_terminalTime": "2026-02-02 14:39:04.297",
  "_groupName": "RealtimeSetting1",
  "INV_1_turnOnOff": "1",
  "INV_1_autoStartPowerOn": "1",
  "INV_1_restoreGridConn": "0",
  "INV_1_gridAbnormalRecover": "1",
  "INV_1_hlvrt": "1",
  "INV_1_activeIsland": "1",
  "INV_1_insulationResistDetect": "1",
  "INV_1_phaseSeqAdaptive": "1",
  "INV_1_atNightSvg": "0",
  "INV_1_reactivePowerPrior": "0",
  "INV_1_gridRatedFreq": "0",
  "INV_1_lightningProtAbnorm": "1",
  "INV_1_defendPidRepairFunc": "0",
  "INV_1_dcArcDetect": "0",
  "INV_1_clearDcArcAlarm": "0",
  "INV_1_restoreFactorySet": "0",
  "INV_1_activePowerCtrlMode": "1",
  "INV_1_activePowerUnit": "1250",
  "INV_1_activePowerStdUnit": "1000",
  "INV_1_reactivePowerCtrlMode": "1",
  "INV_1_reactivePowerUnit": "0",
  "INV_1_reactivePowerStdUnit": "0",
  "INV_1_powerFactor": "1000",
  "INV_1_gridRecoverTime": "20",
  "INV_1_powerSoftStartRate": "10000",
  "INV_1_softStartPowerOnOff": "10000",
  "INV_1_standardType": "0",
  "INV_1_pvBranchCircuitAlrm1": "63",
  "INV_1_pvBranchCircuitAlrm2": "4095",
  "INV_1_antiBackflowFunc": "0",
  "INV_1_antiBackflowCtrlPower": "0",
  "INV_1_antiBackflowProtPower": "0",
  "INV_1_antiBackflowProtTime": "0",
  "INV_1_antiBackflowRecoverTime": "0",
  "INV_1_componentType": "0",
  "INV_1_repairVolt2": "0",
  "INV_1_repairTime": "0",
  "INV_1_busCapValueDetect": "0",
  "INV_1_remoteCommAbnormProtect": "0",
  "INV_1_remoteCommExceptionTime": "0",
  "INV_1_drmEnable": "0",
  "INV_1_gridSideMeter": "0",
  "INV_1_dcFastShutdown": "0",
  "INV_1_parallelOffGridDetectEnable": "0",
  "INV_1_parallelOffGridSwitchEnable": "0",
  "INV_1_totalPowerGenCalib1": "3",
  "INV_1_totalPowerGenCalib2": "48452",
  "INV_1_systemTimeYear": "2026",
  "INV_1_systemTimeMonth": "2",
  "INV_1_systemTimeDay": "2",
  "INV_1_systemTimeHour": "16",
  "INV_1_systemTimeMin": "59",
  "INV_1_systemTime": "42"
}
```