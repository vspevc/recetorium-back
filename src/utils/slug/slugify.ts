const slugify = (toSlug: string): string =>
  toSlug
    .toLowerCase()
    .trim()
    .replace(/[áäâàãåÆæ]/g, "a")
    .replace(/[þÞß]/g, "b")
    .replace(/[čçć]/g, "c")
    .replace(/[ďĐđ]/g, "d")
    .replace(/[éěëèêẽĕȇ]/g, "e")
    .replace(/[íìîï]/g, "i")
    .replace(/[ňñ]/g, "n")
    .replace(/[óöòôõøð]/g, "o")
    .replace(/[řŕ]/g, "r")
    .replace(/š/g, "s")
    .replace(/ť/g, "t")
    .replace(/[úůüùû]/g, "u")
    .replace(/[ýÿ]/g, "y")
    .replace(/ž/g, "z")
    .replace(/[·/_,:;]/g, "-")
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export default slugify;
