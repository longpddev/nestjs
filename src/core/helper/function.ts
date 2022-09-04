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
