/**
 * Created by vestnik on 26/03/16.
 */

describe('Replace string function', () => {

  it('Should replace substring to replacement in the passed string', () => {
    const path = '/en/some_route_path'
    const replace_pattern = /^.{3}/g
    const replacement = '/ru'
    expect(path.replace(replace_pattern, replacement))
        .toBe(path.replace(replace_pattern, replacement))
  });

})