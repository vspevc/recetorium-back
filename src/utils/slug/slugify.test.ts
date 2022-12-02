import slugify from "./slugify";

describe("Given a slugify function", () => {
  describe("When it's invoked with ' lasaña de calabacín y jamón '", () => {
    test("Then it should return ''", () => {
      const stringToSlug = " Lasaña de calabacín y jamón ";
      const expectedSlug = "lasana-de-calabacin-y-jamon";

      const e = slugify(stringToSlug);

      expect(e).toBe(expectedSlug);
    });
  });
});
