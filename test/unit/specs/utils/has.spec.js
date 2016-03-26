/**
 * Created by vestnik on 26/03/16.
 */

import { has } from './../../../../src/libs/utils'

describe('has.util', () => {
  it('should check if value exists by key with dot notation', () => {
    const obj1 = {
      a: {
        b: {
          c: null
        }
      }
    }
    expect(has(obj1, 'a.b.c')).toBeTruthy()

    const obj2 = {
      a2: {
        b2: {
          c2: null
        }
      }
    }
    expect(has(obj2, 'a.b.c')).toBeFalsy()

  })
})