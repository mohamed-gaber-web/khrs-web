import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { getLanguage, policyPage } from "src/app/api.constants";

import { faqPage, getGeneratedVidoes } from './../../api.constants';
import { shareReplay } from "rxjs/operators";



@Injectable({
    providedIn: 'root',
  })

  export class AppService {

  constructor(private http: HttpClient) {}

  getLanguage() {
    const params = `?offset=0&limit=30`
    return this.http.get(`${getLanguage}` + params);
  }

  getPolicyPage () {
    // const params = `?Offset=${offset}&Limit=${limit}`
    return this.http.get(`${policyPage}`);
  }

  getFaqPage (offset, limit) {
    const params = `?Offset=${offset}&Limit=${limit}`
    return this.http.get(`${faqPage}` + params );
  }

  getVidoes (title, appLang) {
    const params = `?title=${title}&lang=${appLang}`
    return this.http.get(`${getGeneratedVidoes}` + params ).pipe(shareReplay());
  }
  getCourseAudio (title) {
    const params = `?title=${title}`
    return this.http.get(`${this.getCourseAudio}` + params );
  }
}
