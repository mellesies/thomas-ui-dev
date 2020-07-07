

const arrayToDict = (array, key) =>
  array.reduce((obj, item) => ({ ...obj, [item[key]]: item }), {})
;

export { arrayToDict };