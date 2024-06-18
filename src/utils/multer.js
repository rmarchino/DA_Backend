const multer = require("multer");
const path = require("path");

const types = ["image/jpeg", "image/jpg", "image/png"];

const subirAvatar = multer({
  storage: multer.diskStorage({
    destination: path.resolve("uploads"),
    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  }),
  limits: {
    fileSize: 10000000,
  },
  fileFilter: (req, file, cb) => {
    if (!types.includes(file.mimetype)) {
      return cb(null, false, {
        error: "Archivo no soportado",
        message: `El archivo debe tener una extensión válida ${types.join(
          ", "
        )}`,
      });
    }
    cb(null, true);
  },
});

const subirImagenServicio = multer({
  storage: multer.diskStorage({
    destination: path.resolve("uploads"),
    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  }),
  limits: {
    fileSize: 20000000,
  },
  fileFilter: (req, file, cb) => {
    if (!types.includes(file.mimetype)) {
      return cb(null, false, {
        error: "Archivo no soportado",
        message: `El archivo debe tener una extensión válida ${types.join(
          ", "
        )}`,
      });
    }
    cb(null, true);
  },
});

const subirImagenExperiencia = multer({
  storage: multer.diskStorage({
    destination: path.resolve("uploads"),
    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  }),
  limits: {
    fileSize: 20000000,
  },
  fileFilter: (req, file, cb) => {
    if (!types.includes(file.mimetype)) {
      return cb(null, false, {
        error: "Archivo no soportado",
        message: `El archivo debe tener una extensión válida ${types.join(
          ", "
        )}`,
      });
    }
    cb(null, true);
  },
});



module.exports = {
  subirAvatar,
  subirImagenServicio,
  subirImagenExperiencia
};
