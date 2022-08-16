import { Injectable } from '@nestjs/common';
import { unlinkSync, existsSync } from 'fs';
@Injectable()
export class ImageFile {
  isExit(path: string) {
    return existsSync(path);
  }

  delete(path: string) {
    return unlinkSync(path);
  }
}
