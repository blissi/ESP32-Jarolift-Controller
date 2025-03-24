import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { StaticTranslationsLoaderService } from './static-translations-loader.service';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideTranslateService({
      defaultLanguage: "de",
      useDefaultLang: true,
      loader: {
        provide: TranslateLoader,
        useClass: StaticTranslationsLoaderService
      }
    })
  ]
};
