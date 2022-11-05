import { diskStorage } from 'multer';
import { extname } from 'path';
const createStorage = (path: string) =>
  diskStorage({
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const extension = extname(file.originalname);
      cb(null, uniqueSuffix + extension);
    },
    destination: function (req, file, cb) {
      cb(null, path);
    },
  });
export default createStorage;
