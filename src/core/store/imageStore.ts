import { diskStorage } from 'multer';
const createStorage = (path: string) =>
  diskStorage({
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + file.originalname.replace(/\s/g, ''));
    },
    destination: function (req, file, cb) {
      cb(null, path);
    },
  });
export default createStorage;
