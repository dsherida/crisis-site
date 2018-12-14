export const notEmptyOrNull = (str: string) => {
  if (!str) {
    return false;
  }

  if (str === '') {
    return false;
  }

  if (str === undefined) {
    return false;
  }

  return true;
};
