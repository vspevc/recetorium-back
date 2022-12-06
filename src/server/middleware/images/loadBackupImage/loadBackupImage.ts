import type { Request, Response } from "express";
import bucket from "../../../../utils/supabaseConfig.js";

const loadBackupImage = (req: Request, res: Response) => {
  const { originalUrl } = req;
  const backupImage = originalUrl.substring(originalUrl.lastIndexOf("/") + 1);

  const {
    data: { publicUrl },
  } = bucket.getPublicUrl(backupImage);

  res.redirect(publicUrl);
};

export default loadBackupImage;
