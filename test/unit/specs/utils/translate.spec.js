/**
 * Created by vestnik on 26/03/16.
 */

import { Translator }  from './../../../../src/libs/translate'
import config from './_data/vue-localize-conf'

const languageGetterDefaultEn = () => 'en'
const languageGetterDefaultRu = () => 'ru'

describe('Translate', () => {
  it('Should translate string', () => {
    const t = new Translator(config, languageGetterDefaultEn)

    expect(t.translate('projectName', null)).toBe('VueJS SPA sample')
    expect(t.translate('projectName', null, 'en')).toBe('VueJS SPA sample')
    expect(t.translate('projectName', null, 'ru')).toBe('Шаблон VueJS SPA')

    t.languageGetter = languageGetterDefaultRu
    expect(t.translate('projectName', null)).toBe('Шаблон VueJS SPA')
    expect(t.translate('projectName', null, 'en')).toBe('VueJS SPA sample')
    expect(t.translate('projectName', null, 'ru')).toBe('Шаблон VueJS SPA')
  })
})