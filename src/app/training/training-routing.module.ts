import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrainingPage } from './training.page';

const routes: Routes = [
  {
    path: '',
    component: TrainingPage
  },
  {
    path: 'single-choice',
    loadChildren: () => import('./single-choice/single-choice.module').then( m => m.SingleChoicePageModule)
  },
  {
    path: 'multi-choice',
    loadChildren: () => import('./multi-choice/multi-choice.module').then( m => m.MultiChoicePageModule)
  },
  {
    path: 'puzzle-text',
    loadChildren: () => import('./puzzle-text/puzzle-text.module').then( m => m.PuzzleTextPageModule)
  },
  {
    path: 'puzzle-image',
    loadChildren: () => import('./puzzle-image/puzzle-image.module').then( m => m.PuzzleImagePageModule)
  },
  {
    path: 'test-course',
    loadChildren: () => import('./test-course/test-course.module').then( m => m.TestCoursePageModule)
  },
  {
    path: 'finished-test',
    loadChildren: () => import('./finished-test/finished-test.module').then( m => m.FinishedTestPageModule)
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingPageRoutingModule {}
