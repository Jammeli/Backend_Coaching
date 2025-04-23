import { Request, Response, Router } from "express";
import multer from "multer";
import fs from "fs";
import { parseCV } from "../services/cvParser";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/parse-cv",
  upload.single("file"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, error: "Aucun fichier reçu" });
        return;
      }

      const filePath = req.file.path;
      const result = await parseCV(filePath);
      fs.unlinkSync(filePath); 

      res.json({ success: true, data: result });
    } catch (error) {
      console.error("Erreur backend CV parsing:", error);
      res
        .status(500)
        .json({ success: false, error: "Erreur lors de l'analyse du CV" });
    }
  }
);

export default router;
