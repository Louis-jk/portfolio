export class TimeoutError extends Error {
  constructor(label: string, seconds: number) {
    super(`${label}이(가) ${seconds}초 안에 완료되지 않았습니다. 네트워크·환경 변수를 확인해 주세요.`);
    this.name = 'TimeoutError';
  }
}

export function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  label: string,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new TimeoutError(label, Math.round(ms / 1000)));
    }, ms);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}
