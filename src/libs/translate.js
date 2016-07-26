import { has, get } from './utils'


export class Translator {
	/**
	 *
	 * @param config
	 */
	constructor (config, languageGetter) {
		this.config = config
		this.languageGetter = languageGetter
	}

	getCurrentOrDefault () {
		return this.languageGetter() || this.config.defaultLanguage;
	}

	/**
	 * Logs warnings into console if the translation contains some unreplaced variable
	 * @return {void}
	 */
	_logUnreplacedVars (vars, path) {
		if (!this.config.supressWarnings) {
			console.warn('VueLocalize. Unreplaced: ' + vars.join(', ') + ' in "' + path + '"')
		}
	}

	/**
	 * Injects variables values into already translated string by
	 * replcaing their string keys with their real values
	 *
	 * @return {String}
	 */
	_processVariables (translation, vars, path) {
		const VARIABLES_REGEXP = /%[a-z]*%/g;
		const arrVars = translation.match(VARIABLES_REGEXP);

		let output = translation;

		if (!arrVars) {
			return output;
		}

		if (!vars) {
			this._logUnreplacedVars(arrVars, path);
			return output;
		}

		output = Object.keys(vars)
			.reduce( (result, key) => {
				return result.replace(key, vars[key]);
		}, translation);

		const unreplacedVars = output.match(VARIABLES_REGEXP)

		if (unreplacedVars) {
			this._logUnreplacedVars(unreplacedVars, path)
		}

		return translation
	}

	/**
	 * Translate message
	 *
	 * @param message
	 * @param params
	 * @param lang
	 * @returns {String}
	 */
	translate (message, params = null, lang = null) {

		if (!lang){
			lang = this.getCurrentOrDefault();
		}

		let phrasePathParts = message.split('.'),
			isGlobal = phrasePathParts.length === 1,
			exactPath = isGlobal ? this.config.defaultContextName + '.' + message : message;

		if (!has(this.config.translations, exactPath)) {
			if (!this.config.supressWarnings) {
				console.warn('[VueLocalize]. Undefined path: "' + exactPath + '"')
			}
			return exactPath
		}

		const translationPath = exactPath + '.' + lang

		const isTranslationExists = has(this.config.translations, translationPath)
		if (isTranslationExists) {
			const translationExpected = get(this.config.translations, translationPath)
			return this._processVariables(translationExpected, params, translationPath)
		}

		if (!this.config.fallbackOnNoTranslation) {
			if (!this.config.supressWarnings) {
				console.warn('[VueLocalize]. Undefined translation: "' + translationPath + '"')
			}
			return exactPath
		}

		const fallbackTranslationPath = exactPath + '.' + this.config.fallbackLanguage
		const isFallbackTranslationExists = has(this.config.translations, fallbackTranslationPath)

		if (lang === this.config.fallbackLanguage || !isFallbackTranslationExists) {
			if (!this.config.supressWarnings) {
				console.warn('[VueLocalize]. Undefined FALLBACK translation: "' + fallbackTranslationPath + '"')
			}
			return exactPath
		}

		const translationFallback = get(this.config.translations, fallbackTranslationPath)
		return this._processVariables(translationFallback, params, fallbackTranslationPath)
	}
}