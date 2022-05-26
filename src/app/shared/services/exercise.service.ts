import { PuzzleWithImageAnswers } from './../models/puzzleWithImageAnswers';
import { PuzzleImageTranslations } from './../models/puzzleImageTranslation';
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import {
  checkAnswerSingleChoise,
  getExercise,
  getMultiChoiceAnswer,
  checkAnswerMultipleChoice,
  checkAnswerPuzzleText,
  checkAnswerPuzzleImage }
from './../../api.constants';
import { PuzzleWithTextAnswer } from '../models/puzzleWithTextAnswer';



@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  offset: number = 1;

  constructor(private http: HttpClient) {}

  /**
   * Get exercise
   * exerciseType [ number ]
   * courseId [ number ]
   * offset [ number ]
   * url [ "http://khrs-api.sdex.online/api/Exercise/Get?exerciseType=1&courseId=5&offset=1" ]
   */
  getCourseExercise(exerciseType: number, courseId: number, offset: number, limit: number) {
    const params = `?exerciseType=${exerciseType}&courseId=${courseId}&offset=${offset}&limit=${limit}`
    return this.http.get(`${getExercise}` + params );
  }

  checkAnswerSingleChoise(singleChoiceAnswerId: number, answer) {
    let data = {
      singleChoiceAnswerId,
      answer
    }
    return this.http.post(`${checkAnswerSingleChoise}`, data);
  }

  checkAnswerMultiChoise(multiChoiceQuestionId: number, multiChoiceAnswerId: number) {
    let data = {
      multiChoiceQuestionId,
      multiChoiceAnswerId
    }
    return this.http.post(`${checkAnswerMultipleChoice}`, data);
  }

  checkAnswerPuzzleWithText(puzzleTextAnswer: PuzzleWithTextAnswer[]) {
    return this.http.post(`${checkAnswerPuzzleText}`, puzzleTextAnswer);
  }


  checkAnswerPuzzleWithImage(data: PuzzleWithImageAnswers[]) {
    return this.http.post(`${checkAnswerPuzzleImage}`, data);
  }

}
