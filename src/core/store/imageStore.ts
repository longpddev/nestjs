import { diskStorage } from 'multer';
const storage = diskStorage({
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + file.originalname);
  },
  destination: function (req, file, cb) {
    cb(null, 'public/upload/image');
  },
});
export default storage;
