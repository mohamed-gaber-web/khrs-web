import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { successBoard } from './../../api.constants';

@Injectable({
  providedIn: 'root'
})
export class SuccessBoardService {

  constructor(private http: HttpClient) { }

  successBoardFn(offset, limit) {
    return this.http.get(`${successBoard}?Offset=${offset}&Limit=${limit}`);
  }
}
