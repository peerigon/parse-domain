export type Await<T> = T extends {
  then: (onFulfilled?: (value: infer U) => unknown) => unknown;
}
  ? U
  : T;
