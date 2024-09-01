// Clean way to use setTimeout with async/await
// https://stackoverflow.com/a/44476626
export const timer = (ms: number) => new Promise((res) => setTimeout(res, ms));
