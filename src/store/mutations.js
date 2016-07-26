import * as types from './types';
import { Storage } from '../libs/storage';

export default {
  /**
   * @state {Object}
   * @lang {String}
   */
  [types.SET_LANGUAGE] (state, lang, saveToLocalStorage = true) {
    state.currentLanguage = lang
    if (saveToLocalStorage) {
      Storage.set(lang)
    }
  },

};
