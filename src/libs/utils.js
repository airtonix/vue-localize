/**
 * Created by vestnik on 25/03/16.
 */

export function has (object, key) {
  let keys = key.split('.')
  let result = object;
  keys.forEach((k) => {
    if (result) {
      result = result[k]
    }
  })
  return typeof result !== 'undefined'
}