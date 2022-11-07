import {
  unlink,
  exists,
  mkdir,
  rename,
  readdir,
  createWriteStream,
  Stats,
  stat,
  closeSync,
  openSync,
} from 'fs';
import { createReadStream } from 'fs-extra';
import * as bcrypt from 'bcrypt';
import { open } from 'fs/promises';

export function unlinkPromise(path: string) {
  return new Promise((res, rej) => {
    unlink(path, (error) => {
      if (error) {
        rej(error);
      } else {
        res(true);
      }
    });
  });
}

export function existsPromise(path: string): Promise<boolean> {
  return new Promise((res, rej) => {
    try {
      exists(path, (isExist) => {
        if (isExist) {
          res(true);
        } else {
          res(false);
        }
      });
    } catch (e) {
      console.log(e);
      rej(e);
    }
  });
}

export function createFolder(path: string) {
  return new Promise((res, rej) => {
    try {
      mkdir(path, { recursive: true }, (error) => {
        if (error) {
          rej(error);
        } else {
          res(path);
        }
      });
    } catch (e) {
      rej(e);
    }
  });
}

export function changePath(oldPath: string, newPath: string) {
  return new Promise((res, rej) => {
    try {
      rename(oldPath, newPath, (error) => {
        if (error) {
          rej(error);
        } else {
          res(newPath);
        }
      });
    } catch (e) {
      rej(e);
    }
  });
}

export function getAllFileInFolder(path: string): Promise<string[]> {
  return new Promise((res, rej) => {
    try {
      readdir(path, (err, files) => {
        if (err) {
          rej(err);
        } else {
          res(files);
        }
      });
    } catch (e) {
      rej(e);
    }
  });
}

export function pipeStream(path, writeStream) {
  return new Promise((res, rej) => {
    try {
      const readStream = createReadStream(path);
      readStream.on('end', () => {
        res(path);
      });
      readStream.pipe(writeStream);
    } catch (e) {
      rej(e);
    }
  });
}

export function fileInfo(path: string): Promise<Stats> {
  return new Promise((res, rej) => {
    try {
      stat(path, (err, stats) => {
        if (err) {
          rej(err);
        } else {
          res(stats);
        }
      });
    } catch (e) {
      rej(e);
    }
  });
}

export async function createFile(path) {
  return closeSync(openSync(path, 'w'));
}

export async function mergeFiles(paths: string[], targetPathFile: string) {
  let prevSize = 0;
  const filesInfo = await Promise.all(
    paths.map(async (path) => {
      const info = await fileInfo(path);
      const result = {
        path,
        size: info.size,
        startByte: prevSize,
      };
      prevSize += info.size;
      return result;
    }),
  );
  return await Promise.all(
    filesInfo.map(async (info) => {
      pipeStream(
        info.path,
        createWriteStream(targetPathFile, {
          start: info.startByte,
        }),
      );
    }),
  );
}

export function radomName() {
  return Date.now() + '-' + Math.round(Math.random() * 1e9);
}

export function sleep(time): Promise<boolean> {
  return new Promise((res) => {
    setTimeout(() => res(true), time);
  });
}
interface IGetTimeObject {
  y: number;
  m: number;
  d: number;
  h: number;
  mm: number;
  s: number;
  ms: number;
}
export const getTimeObject = (date: Date): IGetTimeObject => {
  const method = {
    y: 'getFullYear',
    m: 'getMonth',
    d: 'getDate',
    h: 'getHours',
    mm: 'getMinutes',
    s: 'getSeconds',
    ms: 'getMilliseconds',
  };

  const result = {
    y: 0,
    m: 0,
    d: 0,
    h: 0,
    mm: 0,
    s: 0,
    ms: 0,
  };

  for (const key in method) {
    result[key] = date[method[key]]();
  }

  return result;
};
export const getTimeMorning = () => {
  const timeOb = getTimeObject(new Date());

  return new Date(timeOb.y, timeOb.m, timeOb.d);
};

export const getTimeMidnight = () => {
  const timeOb = getTimeObject(new Date());

  return new Date(timeOb.y, timeOb.m, timeOb.d, 23, 59, 59);
};

export const hashPassword = async (password) => {
  const hash = await bcrypt.hash(password, 10);
  return hash;
};

export const uuid = (length = 8) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
