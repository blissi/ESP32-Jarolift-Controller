import { Injectable } from '@angular/core';
import { TranslateLoader, TranslationObject } from '@ngx-translate/core';
import { Observable, of, Subject } from 'rxjs';
import { TRANSLATIONS } from './translations';


function getTranslationObject(lang: "de" | "en"): TranslationObject {
  let result: TranslationObject = {};

  for (const key of Object.getOwnPropertyNames(TRANSLATIONS)) {
    result[key] = (TRANSLATIONS as any)[key][lang];
  }

  return result;
}


@Injectable({
  providedIn: 'root'
})
export class StaticTranslationsLoaderService implements TranslateLoader {
  private static TranslationsByLang: {
    [lang: string]: TranslationObject
  } = {
    de: getTranslationObject("de"),
    en: getTranslationObject("en"),
  }

  getTranslation(lang: string): Observable<TranslationObject> {
    return of(StaticTranslationsLoaderService.TranslationsByLang[lang]);
  }
}
