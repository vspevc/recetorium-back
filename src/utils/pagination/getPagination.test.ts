import { getPagination } from "./getPagination";
import type { Pagination } from "./types";

describe("Given the getPagination function", () => {
  describe("When it's invoked with path '/recipes/search' and totalItems 16", () => {
    test("Then it should return an array with null and '/recipes/search?page=2'", () => {
      const paginationOptions: Pagination = {
        path: "/recipes/search",
        totalItems: 16,
      };
      const expectedPagination = [null, "/recipes/search?page=2"];

      const pagination = getPagination(paginationOptions);

      expect(pagination).toStrictEqual(expectedPagination);
    });
  });

  describe("When it's invoked with path '/recipes/search', totalItems 50, currentPage 5 and perPage 10", () => {
    test("Then it should return an array with '/recipes/search?page=4&per-page=10' and null", () => {
      const paginationOptions: Pagination = {
        path: "/recipes/search",
        totalItems: 50,
        currentPage: 5,
        perPage: 10,
      };
      const expectedPagination = ["/recipes/search?page=4&per-page=10", null];

      const pagination = getPagination(paginationOptions);

      expect(pagination).toStrictEqual(expectedPagination);
    });
  });
});
