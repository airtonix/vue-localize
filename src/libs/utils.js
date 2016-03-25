/**
 * Created by vestnik on 25/03/16.
 */
import { each, has } from 'lodash'
/**
 * Recursive action call
 */
export function _recursively (object, action, field, isRoot = true) {
  each(object, function (value, key) {
    if (isRoot === true && !has(value, 'localized')) {
      return
    }
    action(key, value)
    if (has(value, field)) {
      _recursively(value[field], action, field, false)
    }
  })
}