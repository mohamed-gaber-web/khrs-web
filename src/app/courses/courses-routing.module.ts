import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoursesPage } from './courses.page';

const routes: Routes = [
  // {
  //   path: '',
  //   component: CoursesPage
  // },
  // {
  //   path: 'all-courses',
  //   loadChildren: () => import('./all-courses/all-courses.module').then( m => m.AllCoursesPageModule)
  // },
  // {
  //   path: 'my-courses',
  //   loadChildren: () => import('./my-courses/my-courses.module').then( m => m.MyCoursesPageModule)
  // },
  // {
  //   path: '/:courseId',
  //   loadChildren: () => import('./course-details/course-details.module').then( m => m.CourseDetailsPageModule)
  // }

  {
    path: 'tabs',
    component: CoursesPage,
    children: [
    {
      path: 'all-courses',
      loadChildren: () => import('./all-courses/all-courses.module').then( m => m.AllCoursesPageModule)
    },
    {
      path: 'my-courses',
      loadChildren: () => import('./my-courses/my-courses.module').then( m => m.MyCoursesPageModule)
    },
    {
      path: 'apply-course',
      loadChildren: () => import('./apply-course/apply-course.module').then( m => m.ApplyCoursePageModule)
    },
    {
      path: 'choose-course-material',
      loadChildren: () => import('./choose-course-material/choose-course-material.module').then( m => m.ChooseCourseMaterialPageModule)
    },
    {
      path: ':courseId',
      loadChildren: () => import('./course-details/course-details.module').then( m => m.CourseDetailsPageModule)
      },
    ]
  },

  {
    path: '',
    redirectTo: '/courses/tabs/all-courses',
    pathMatch: 'full'
  },
  {
    path: 'course-material/:courseId',
    loadChildren: () => import('./course-material/course-material.module').then( m => m.CourseMaterialPageModule)
  },
  {
    path: 'course-by-category/:categoryId',
    loadChildren: () => import('./course-by-category/course-by-category.module').then( m => m.CourseByCategoryPageModule)
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoursesPageRoutingModule {}
