import path from "path";
import express from "express";
import multer from "multer";
import { promises as fsPromises } from 'fs';
const router = express.Router();
import { uploadFile, deleteFile } from "../s3.js";

const directory = 'C:/Users/Administrator/Desktop/config/uploads'

const storage = multer.diskStorage({
  destination(req, res, cb) {
    cb(null, "uploads");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|mp4/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("images only");
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});


router.post("/", upload.array("file", 4), async (req, res) => {
  try {
    const allInOne = req.files;
    const result = await uploadFile(req.body.productName, allInOne);

//  await fsPromises.rmdir(directory, {
 //   recursive: true
 // })

//await fsPromises.mkdir(directory, {
//  recursive: true
//})


    res.json({ result, success: true });
  } catch (error) {
    res.json({ error: result, success: false });
  }
});

router.post("/delete", async (req, res) => {
  try {
    console.log(req.body.files);
    await deleteFile(req.body.files);

    res.json({ deleted: true });
  } catch (error) {
    res.json({ deleted: false });
  }
});

export default router;
