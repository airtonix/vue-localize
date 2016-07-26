import * as types from './types';

export const setLanguage = ({state, dispatch}, lang, data) => {
	if (!Object.keys(state.locales).includes(lang)) {
		throw new Error('Async loading of languages not yet supported.');
	} else {
		dispatch(types.SET_LANGUAGE, lang);
	}
};
