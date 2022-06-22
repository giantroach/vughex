interface Counter {
  // associate counter with existing target dom element
  create: (target) => void;
  // return current value
  getValue: () => number;
  // increment value by "by" and animate from previous value
  incValue: (by) => void;
  // set value, no animation
  setValue: (value) => void;
  // set value with animation
  toValue: (value) => void;
  // display - instead. Note it just changes display value once, it does not actually disables it,
  // i.e. if you set it again, it will be shown again
  disable: () => void;
}

export { Counter };
