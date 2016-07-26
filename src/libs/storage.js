const STORAGE_KEY = 'currentLanguage'

export const Storage = {
	set (lang) {
		window.localStorage.setItem(STORAGE_KEY, lang)
	},
	get () {
		return window.localStorage.getItem(STORAGE_KEY)
	}
};