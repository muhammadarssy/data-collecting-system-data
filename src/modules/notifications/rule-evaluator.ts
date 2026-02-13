import { NotificationRule, NotificationRuleType } from '@prisma/client';
import logger from '../../config/logger';
import prisma from '../../config/database';

interface EvaluationResult {
  triggered: boolean;
  message?: string;
  actualValue?: any;
  expectedValue?: any;
}

/**
 * Rule Evaluation Engine
 * Evaluates notification rules against realtime data
 */
class RuleEvaluator {
  // Store previous values for change detection
  private previousValues: Map<string, any> = new Map();

  /**
   * Evaluate a single rule against payload data
   */
  async evaluateRule(
    rule: NotificationRule,
    payload: Record<string, any>,
    deviceStatus?: { isOnline: boolean; lastSeenAt?: Date }
  ): Promise<EvaluationResult> {
    try {
      switch (rule.ruleType) {
        case NotificationRuleType.THRESHOLD:
          return this.evaluateThreshold(rule, payload);

        case NotificationRuleType.CHANGE_DETECTION:
          return this.evaluateChangeDetection(rule, payload);

        case NotificationRuleType.DEVICE_STATUS:
          return this.evaluateDeviceStatus(rule, deviceStatus);

        case NotificationRuleType.CUSTOM_EXPRESSION:
          return this.evaluateCustomExpression(rule, payload);

        default:
          logger.warn('Unknown rule type', { ruleType: rule.ruleType, ruleId: rule.id });
          return { triggered: false };
      }
    } catch (error) {
      logger.error('Error evaluating rule', {
        ruleId: rule.id,
        ruleType: rule.ruleType,
        error: error instanceof Error ? error.message : String(error),
      });
      return { triggered: false };
    }
  }

  /**
   * Evaluate THRESHOLD rule (e.g., battVolt > 55)
   */
  private evaluateThreshold(
    rule: NotificationRule,
    payload: Record<string, any>
  ): EvaluationResult {
    const { field, operator, value } = rule;

    if (!operator || value === null || value === undefined) {
      return { triggered: false };
    }

    const actualValue = this.getNestedValue(payload, field);

    if (actualValue === undefined || actualValue === null) {
      return { triggered: false };
    }

    const numericValue = Number(actualValue);
    if (isNaN(numericValue)) {
      return { triggered: false };
    }

    let triggered = false;

    switch (operator) {
      case '>':
        triggered = numericValue > value;
        break;
      case '<':
        triggered = numericValue < value;
        break;
      case '>=':
        triggered = numericValue >= value;
        break;
      case '<=':
        triggered = numericValue <= value;
        break;
      case '==':
        triggered = numericValue === value;
        break;
      case '!=':
        triggered = numericValue !== value;
        break;
    }

    if (triggered) {
      return {
        triggered: true,
        message: `${field} is ${numericValue} (threshold: ${operator} ${value})`,
        actualValue: numericValue,
        expectedValue: value,
      };
    }

    return { triggered: false };
  }

  /**
   * Evaluate CHANGE_DETECTION rule (e.g., devStatus changed)
   */
  private evaluateChangeDetection(
    rule: NotificationRule,
    payload: Record<string, any>
  ): EvaluationResult {
    const { field, deviceId } = rule;
    const cacheKey = `${deviceId}:${field}`;

    const currentValue = this.getNestedValue(payload, field);

    if (currentValue === undefined || currentValue === null) {
      return { triggered: false };
    }

    const previousValue = this.previousValues.get(cacheKey);

    // Update cache with current value
    this.previousValues.set(cacheKey, currentValue);

    // If no previous value, don't trigger (first data point)
    if (previousValue === undefined) {
      return { triggered: false };
    }

    // Check if value changed
    const valueChanged = previousValue !== currentValue;

    if (valueChanged) {
      return {
        triggered: true,
        message: `${field} changed from ${previousValue} to ${currentValue}`,
        actualValue: currentValue,
        expectedValue: previousValue,
      };
    }

    return { triggered: false };
  }

  /**
   * Evaluate DEVICE_STATUS rule (e.g., device went offline)
   */
  private evaluateDeviceStatus(
    rule: NotificationRule,
    deviceStatus?: { isOnline: boolean; lastSeenAt?: Date }
  ): EvaluationResult {
    if (!deviceStatus) {
      return { triggered: false };
    }

    const { deviceId } = rule;
    const cacheKey = `${deviceId}:status`;

    const currentStatus = deviceStatus.isOnline;
    const previousStatus = this.previousValues.get(cacheKey);

    // Update cache
    this.previousValues.set(cacheKey, currentStatus);

    // If no previous status, don't trigger
    if (previousStatus === undefined) {
      return { triggered: false };
    }

    // Trigger if device went offline
    if (previousStatus === true && currentStatus === false) {
      return {
        triggered: true,
        message: 'Device went offline',
        actualValue: 'offline',
        expectedValue: 'online',
      };
    }

    // Trigger if device came back online
    if (previousStatus === false && currentStatus === true) {
      return {
        triggered: true,
        message: 'Device is back online',
        actualValue: 'online',
        expectedValue: 'offline',
      };
    }

    return { triggered: false };
  }

  /**
   * Evaluate CUSTOM_EXPRESSION rule
   * Simple expression evaluator (basic support)
   */
  private evaluateCustomExpression(
    rule: NotificationRule,
    payload: Record<string, any>
  ): EvaluationResult {
    const { expression } = rule;

    if (!expression) {
      return { triggered: false };
    }

    try {
      // Simple expression parser for basic conditions
      // Example: "battVolt > 55 && battCurr < 10"
      // WARNING: This is a simplified implementation
      // For production, consider using a proper expression parser like mathjs

      // Replace field names with actual values
      let evaluableExpression = expression;

      // Extract all field names (alphanumeric + underscore)
      const fieldMatches = expression.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];

      for (const fieldName of fieldMatches) {
        // Skip JavaScript keywords
        if (['true', 'false', 'null', 'undefined', 'NaN'].includes(fieldName)) {
          continue;
        }

        const value = this.getNestedValue(payload, fieldName);
        if (value !== undefined && value !== null) {
          // Replace field name with its value
          const regex = new RegExp(`\\b${fieldName}\\b`, 'g');
          evaluableExpression = evaluableExpression.replace(regex, String(value));
        }
      }

      // Evaluate the expression safely (limited to comparison operators)
      // eslint-disable-next-line no-eval
      const result = eval(evaluableExpression);

      if (result === true) {
        return {
          triggered: true,
          message: `Custom condition met: ${expression}`,
        };
      }

      return { triggered: false };
    } catch (error) {
      logger.error('Error evaluating custom expression', {
        ruleId: rule.id,
        expression,
        error: error instanceof Error ? error.message : String(error),
      });
      return { triggered: false };
    }
  }

  /**
   * Get nested value from object using dot notation
   * Example: getNestedValue({battery: {volt: 55}}, "battery.volt") => 55
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Evaluate all active rules for a device
   */
  async evaluateRulesForDevice(
    deviceId: string,
    payload: Record<string, any>,
    deviceStatus?: { isOnline: boolean; lastSeenAt?: Date }
  ): Promise<Array<{ rule: NotificationRule; result: EvaluationResult }>> {
    const rules = await prisma.notificationRule.findMany({
      where: {
        deviceId,
        isActive: true,
      },
    });

    const evaluations = [];

    for (const rule of rules) {
      const result = await this.evaluateRule(rule, payload, deviceStatus);
      if (result.triggered) {
        evaluations.push({ rule, result });
      }
    }

    return evaluations;
  }

  /**
   * Clear cached values for a device (useful for testing or reset)
   */
  clearCache(deviceId?: string) {
    if (deviceId) {
      // Clear only for specific device
      for (const key of this.previousValues.keys()) {
        if (key.startsWith(`${deviceId}:`)) {
          this.previousValues.delete(key);
        }
      }
    } else {
      // Clear all
      this.previousValues.clear();
    }
  }
}

export default new RuleEvaluator();
