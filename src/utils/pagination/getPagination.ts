import type { Pagination, PaginationDefaults } from "./types";

export const paginationDefaults: PaginationDefaults = {
  perPage: 8,
  firstPage: 1,
};

export const getPagination = ({
  path,
  totalItems,
  currentPage = paginationDefaults.firstPage,
  perPage = paginationDefaults.perPage,
}: Pagination): string[] => {
  let extraData = "";

  if (perPage !== paginationDefaults.perPage) {
    extraData = `&per-page=${perPage}`;
  }

  let previousPage: string = null;
  if (currentPage > paginationDefaults.firstPage) {
    previousPage = `${path}?page=${+currentPage - 1}${extraData}`;
  }

  let nextPage: string = null;
  if (perPage * currentPage < totalItems) {
    nextPage = `${path}?page=${+currentPage + 1}${extraData}`;
  }

  return [previousPage, nextPage];
};
