export function radomName() {
  return Date.now() + '-' + Math.round(Math.random() * 1e9);
}

export function sleep(time): Promise<boolean> {
  return new Promise((res) => {
    setTimeout(() => res(true), time);
  });
}
