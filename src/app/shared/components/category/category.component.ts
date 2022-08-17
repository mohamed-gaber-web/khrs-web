import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { ICategory } from '../../models/category.model';
import { CourseService } from '../../services/courses.service';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {

  sub: Subscription[] = [];
  categories: ICategory[];

  slideOpts = {
    initialSlide: 1,
    speed: 400,
    // slidesPerView: 4,
    pagination: { el: '.swiper-pagination', type: 'bullets', clickable: true},
    scrollbar: false,
    autoplay: false,
    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 1,
        spaceBetween: 0
      },
      // when window width is >= 480px
      480: {
        slidesPerView: 2,
        spaceBetween: 30
      },
      // when window width is >= 640px
      640: {
        slidesPerView: 4,
        spaceBetween: 40
      }
    }
  };

  constructor(private courseService: CourseService) { }

  ngOnInit() {

    this.sub.push(
      this.courseService.getCourseCategories(0, 50)
      .subscribe(response => {
        this.categories = response['result'];
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.forEach(el => {
      el.unsubscribe();
    })
  }

}
