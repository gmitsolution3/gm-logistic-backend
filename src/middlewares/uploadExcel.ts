import multer from "multer";

const storage = multer.memoryStorage();

export const uploadExcel = multer({
  storage,

  fileFilter: (
    _req,
    file,
    cb,
  ) => {
    const allowedMimeTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (
      allowedMimeTypes.includes(
        file.mimetype,
      )
    ) {
      return cb(null, true);
    }

    cb(
      new Error(
        "Only Excel files are allowed",
      ),
    );
  },
});