import { PaginationParams } from '../types';
import { PAGINATION } from '../constants';

/**
 * Calculate pagination parameters
 */
export function calculatePagination(page?: number, limit?: number): PaginationParams {
  const currentPage = Math.max(1, page || PAGINATION.DEFAULT_PAGE);
  const currentLimit = Math.min(
    Math.max(1, limit || PAGINATION.DEFAULT_LIMIT),
    PAGINATION.MAX_LIMIT
  );
  const skip = (currentPage - 1) * currentLimit;

  return {
    page: currentPage,
    limit: currentLimit,
    skip,
  };
}

/**
 * Calculate total pages
 */
export function calculateTotalPages(total: number, limit: number): number {
  return Math.ceil(total / limit);
}

/**
 * Build paginated response
 */
export function buildPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
) {
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: calculateTotalPages(total, limit),
    },
  };
}
