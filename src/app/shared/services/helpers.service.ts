import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { baseUrl } from 'src/app/api.constants';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {
  baseUrl = baseUrl;
  constructor(private translate: TranslateService) {}

  toBase64(file) {
    console.log(file);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  correctImageUrl(...args) {
    if (typeof args[0] === 'string') {
      const url = args[0].replace(/\\/g, '/');
      const newUrl = `${this.baseUrl}/${url}`;
      return newUrl;
    } else if (args[0] instanceof Array) {
      const images = [];
      args[0].forEach((img) => images.push(this.correctImageUrl(img)));
      return images;
    }
  }

  getExtension(fileName: string): string {
    return fileName.split('.').pop();
  }
  validBase64(value: string): string {
    return value.substr(value.indexOf(',') + 1);
  }

  getIndexById(id: number, array: any[]) {
    const index = array.map((x) => x.id).indexOf(id);
    return index;
  }

  getTranslation(word: string) {
    let translation = '';
    this.translate.get(word).subscribe(res => translation = res);
    return translation;
  }
}
