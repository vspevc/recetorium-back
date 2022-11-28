export interface Pagination {
  path: string;
  totalItems?: number;
  currentPage?: number;
  perPage?: number;
}

export interface PaginationDefaults {
  perPage: number;
  firstPage: number;
}
