const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const recortarImgAvatar = async (req, res, next) => {
  try {
    if (req.file) {
      const imagePath = req.file.path;
      const directorioPadre = path.dirname(imagePath);
      const rutaImgRecortada = path.join(
        directorioPadre,
        "recortada-" + req.file.filename
      );
      await sharp(imagePath).resize(180, 180).toFile(rutaImgRecortada);

      // Elimina el archivo original
      fs.unlinkSync(imagePath);

      //Actualiza la ruta del archivo en la solicitud con la imagen recortada
      req.file.path = rutaImgRecortada;
    }
    next();

  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

module.exports = {
  recortarImgAvatar,
};
