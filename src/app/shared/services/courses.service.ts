import { createUserCourseRate } from './../../api.constants';
import { IRating } from './../models/rating.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  getAllCoursesAPI,
  getCourseDetails,
  getUsersCoursesAPI,
  createApplyCourse,
  courseMaterials,
  getUserCourseDetails,
  getCourseCategories,
  getCoursesByCategory,
  getAllByUser} from 'src/app/api.constants';
import { Course } from '../models/course';
import { MyCourse } from '../models/myCourse';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  limit: number = 6;
  offset: number = 0;

  queryParams = `?Offset=${this.offset}&Limit=${this.limit}`;

  constructor(private http: HttpClient) {}

  // ** get all courses in the system
  getAllCourses(courseQuery: string, offset?: number) {
    if (offset != null) {
      this.queryParams = `?Offset=${offset}&Limit=${this.limit}`;
    }
    return this.http.get<Course>(
      `${getAllCoursesAPI}/${courseQuery}` + this.queryParams
    );
  }

  // ** get the subscribed courses of the user
  getUserCourses(courseQuery: string, offset?: number) {
    if (offset != null) {
      this.queryParams = `?Offset=${offset}&Limit=${this.limit}`;
    }
    return this.http.get<MyCourse>(
      `${getUsersCoursesAPI}/${courseQuery}` + this.queryParams
    );
  }

  // ** get the course details
  getCoursesDetails(id: number) {
    return this.http.get(`${getCourseDetails}?id=${id}`);
  }

  // ** get user course details
  getUserCoursesDetails(courseId: number) {
    return this.http.get(`${getUserCourseDetails}?courseId=${courseId}`);
  }

  // ** create course apply
  createCourseApply(from: Date) {
    return this.http.post(`${createApplyCourse}` , from);
  }

  // ** get course material
  getCourseMaterial(courseId: number, offset: number, limit: number) {
    return this.http.get(`${courseMaterials}?Offset=${offset}&Limit=${limit}&courseId=${courseId}`);
  }

  // ** get all categories
  getCourseCategories(offset: number, limit: number) {
    const params = new HttpParams()
      .set('Offset', `${ offset }`)
      .set('Limit', `${limit}`)
    return this.http.get(`${getCourseCategories}`, { params })
  }

  // ** get courses by category
  getCoursesByCategories(offset: number, limit: number, catId: number) {
    return this.http.get(`${ getCoursesByCategory }?Offset=${offset}&Limit=${limit}&categoryId=${catId}`)
  }

    // ** rating service
  createRatingService(rating: IRating) {
    return this.http.post(`${createUserCourseRate}`, rating)
  }

}


