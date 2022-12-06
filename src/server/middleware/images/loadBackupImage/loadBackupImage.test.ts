import type { Request, Response } from "express";
import loadBackupImage from "./loadBackupImage";

describe("Given a loadBackupImage middleware", () => {
  describe("When it receives a request with original url '/recipes/images/tomato-soup.webp'", () => {
    test("Then it should call response redirect to '/tomato-soup.webp'", () => {
      const originalUrl = "/recipes/images/tomato-soup.webp";
      const req: Partial<Request> = {
        originalUrl,
      };
      const res: Partial<Response> = {
        redirect: jest.fn(),
      };
      const expectedRedirect =
        "https://pzmzqeelxnciuqldqjds.supabase.co/storage/v1/object/public/recipes/tomato-soup.webp";

      loadBackupImage(req as Request, res as Response);

      expect(res.redirect).toHaveBeenCalledWith(expectedRedirect);
    });
  });
});
