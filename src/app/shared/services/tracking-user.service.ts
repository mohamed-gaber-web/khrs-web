import { getAllByUser } from './../../api.constants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { end, start } from 'src/app/api.constants';
import { IStartTracking } from '../models/tracking.model';

@Injectable({
  providedIn: 'root'
})
export class TrackingUserService {

  constructor(private http: HttpClient) {}

  // ** start tracking when user click in material button
  startTracking(startParams: IStartTracking) {
    return this.http.post(`${ start }`, startParams)
  }

  // ** end tracking when user click in amDoneToday button
  endTracking(endParams: IStartTracking) {
    return this.http.post(`${ end }`, endParams)
  }

  getAllUser(offset: number, limit: number) {
    return this.http.get(`${getAllByUser}?offset=${offset}&&limit=${limit}`);
  }

}
