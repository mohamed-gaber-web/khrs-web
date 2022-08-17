import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CourseService } from 'src/app/shared/services/courses.service';

@Component({
  selector: 'app-course-item',
  templateUrl: './course-item.component.html',
  styleUrls: ['./course-item.component.scss'],
})
export class CourseItemComponent implements OnInit {

  @Input() courseItem: any;
  @Output() playSound:  EventEmitter<any> = new EventEmitter();
  @Output() getData: EventEmitter<any> = new EventEmitter();
  
  @Input() loading: boolean;

  constructor(private courseService: CourseService) { }

  ngOnInit() { }

  playIntroHTML(e) {
    this.playSound.emit(e)
  }

  getCourse(e) {
    this.getData.emit(e)
  }

}
