// Device Types
export const DEVICE_TYPES = {
  EHUB: 'EHUB',
  CHINT: 'CHINT',
  INVERTER: 'INVERTER',
} as const;

// MQTT Topics
export const MQTT_TOPICS = {
  HISTORY_ALL: 'data/+/history/#',
  REALTIME_ALL: 'data/+/realtime/#',
} as const;

// Topic Data Types
export const TOPIC_DATA_TYPES = {
  HISTORY: 'history',
  REALTIME: 'realtime',
} as const;

// Inverter Sub-types (from MQTT topics)
export const INVERTER_SUBTYPES = {
  BATTERY: 'battery',
  INVERTER: 'inverter',
  LOAD: 'load',
  MPPT: 'mppt',
  PV: 'pv',
  FAULT_BATTERY: 'faultbattery',
  FAULT_INVERTER: 'faultinverter',
  FAULT_LOAD: 'faultload',
} as const;

// Device Type Mapping from MQTT topic
export const TOPIC_DEVICE_TYPE_MAP: Record<string, string> = {
  ehub: DEVICE_TYPES.EHUB,
  system: DEVICE_TYPES.EHUB,
  chint: DEVICE_TYPES.CHINT,
  battery: DEVICE_TYPES.INVERTER,
  battery1: DEVICE_TYPES.INVERTER,
  battery2: DEVICE_TYPES.INVERTER,
  battery3: DEVICE_TYPES.INVERTER,
  inverter: DEVICE_TYPES.INVERTER,
  inverter1: DEVICE_TYPES.INVERTER,
  inverter2: DEVICE_TYPES.INVERTER,
  inverter3: DEVICE_TYPES.INVERTER,
  load: DEVICE_TYPES.INVERTER,
  load1: DEVICE_TYPES.INVERTER,
  load2: DEVICE_TYPES.INVERTER,
  load3: DEVICE_TYPES.INVERTER,
  mppt: DEVICE_TYPES.INVERTER,
  mppt1: DEVICE_TYPES.INVERTER,
  mppt2: DEVICE_TYPES.INVERTER,
  mppt3: DEVICE_TYPES.INVERTER,
  pv: DEVICE_TYPES.INVERTER,
  pv1: DEVICE_TYPES.INVERTER,
  pv2: DEVICE_TYPES.INVERTER,
  pv3: DEVICE_TYPES.INVERTER,
  faultbattery1: DEVICE_TYPES.INVERTER,
  faultbattery2: DEVICE_TYPES.INVERTER,
  faultbattery3: DEVICE_TYPES.INVERTER,
  faultinverter1: DEVICE_TYPES.INVERTER,
  faultinverter2: DEVICE_TYPES.INVERTER,
  faultinverter3: DEVICE_TYPES.INVERTER,
  faultload1: DEVICE_TYPES.INVERTER,
  faultload2: DEVICE_TYPES.INVERTER,
  faultload3: DEVICE_TYPES.INVERTER,
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

// Notification Rule Types
export const NOTIFICATION_RULE_TYPES = {
  THRESHOLD: 'THRESHOLD',
  CHANGE_DETECTION: 'CHANGE_DETECTION',
  DEVICE_STATUS: 'DEVICE_STATUS',
  CUSTOM_EXPRESSION: 'CUSTOM_EXPRESSION',
} as const;

// Notification Status
export const NOTIFICATION_STATUS = {
  UNREAD: 'UNREAD',
  READ: 'READ',
} as const;

// Operators for Threshold Rules
export const THRESHOLD_OPERATORS = {
  GREATER_THAN: '>',
  LESS_THAN: '<',
  GREATER_THAN_OR_EQUAL: '>=',
  LESS_THAN_OR_EQUAL: '<=',
  EQUAL: '==',
  NOT_EQUAL: '!=',
} as const;

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 1000,
} as const;

// Queue Job Delays
export const QUEUE_DELAYS = {
  RETRY_DELAY: 5000, // 5 seconds
  FAILED_DELAY: 60000, // 1 minute
} as const;
