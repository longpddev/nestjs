import { Injectable, Logger } from '@nestjs/common';
import { get as httpGet } from 'http';
import { get as httpsGet } from 'https';
import { createWriteStream, unlink, existsSync, unlinkSync } from 'fs';
import { Cron } from '@nestjs/schedule';
import { extname } from 'path';
import { radomName } from 'src/core/helper/function';

import downloadImage from 'image-downloader';

type itemInListFile = {
  path: string;
  url: string;
  time: number;
};
@Injectable()
export class FileTempService {
  private list_file: itemInListFile[] = [];
  private lifeTimeOfFile = 300000;
  private readonly logger = new Logger(FileTempService.name);

  download(
    url: string,
    path = 'public/upload/temp/',
  ): Promise<{ path: string; timeDelete: string }> {
    const findInCache = this.getInCache(url);

    if (findInCache.length > 0)
      return Promise.resolve({
        path: findInCache[0].path,
        timeDelete: (() => {
          const timeDelete = new Date(findInCache[0].time);
          timeDelete.setMilliseconds(this.lifeTimeOfFile);
          return timeDelete.toISOString();
        })(),
      });

    const urlOb = new URL(url);
    const fileName = radomName() + extname(urlOb.pathname);
    this.logger.debug(fileName);
    const pathToFile = path + fileName;
    const file = createWriteStream(pathToFile);
    return new Promise((res, rej) => {
      this.httpOrHttps(url)(url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          this.list_file.push({
            path: pathToFile,
            url: url,
            time: new Date().getTime(),
          });

          const timeDelete = new Date();
          timeDelete.setMilliseconds(this.lifeTimeOfFile);
          res({
            path: pathToFile,
            timeDelete: timeDelete.toISOString(),
          });
        });
      }).on('error', (err) => {
        unlink(pathToFile, () => {
          console.log('cant unlink file: ' + pathToFile);
        });
        rej(err.message);
        this.logger.debug(err.message);
      });
    });
  }

  isHttp(url: string) {
    return new RegExp('^http?://').test(url);
  }
  isHttps(url: string) {
    return new RegExp('^https?://').test(url);
  }

  isValidUrl(url: string) {
    return this.isHttp(url) || this.isHttps(url);
  }

  httpOrHttps(url: string) {
    return this.isHttp(url) ? httpGet : httpsGet;
  }

  getInCache(url: string) {
    return this.list_file.filter((item) => item.url === url);
  }

  @Cron('30 * * * * *')
  removeFileOld() {
    this.logger.debug('task run');
    this.list_file = this.list_file.filter((file) => {
      const currentTime = new Date().getTime();
      if (currentTime < file.time + this.lifeTimeOfFile) return true;

      if (!existsSync(file.path)) {
        this.logger.debug("file does't exits:" + file.path);
        return false;
      }

      unlinkSync(file.path);
      return false;
    });
  }
}
