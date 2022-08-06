// eslint-disable-next-line @typescript-eslint/no-explicit-any
const throttle = (func: any, msec: number, context: any): any => {
  let t = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (...args: any) {
    clearTimeout(t);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    t = setTimeout(() => {
      func.apply(context, args);
    }, msec);
  };
};

export { throttle };
