import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SharedModule } from './shared/shared.module';


// import { SwiperModule } from 'swiper/angular';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppInterceptor } from './app-interceptor';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    // SwiperModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
      useFactory: (LanguageLoader),
      deps: [HttpClient]
      }
    }),
    NgbModule
  ],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    FileOpener,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true }, // AppInterceptor
    // { provide: HTTP_INTERCEPTORS, useClass: MonitorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})


export class AppModule {

}
