export class AnswerTestModel {
  testId: number;
  questionType: number;
  singleChoiceAnswer: {
    singleChoiceAnswerId: number,
    answer: boolean
  };
  multiChoiceAnswer: {
    multiChoiceQuestionId: number,
    multiChoiceAnswerId: number
  };
  puzzleWithTextAnswers: [
    {
      puzzleWithTextId: number,
      keyword: string,
      translationKeyword: string
    }
  ];

  puzzleWithImageAnswers: [
    {
      puzzleWithImageQuestionId: number,
      imageGuid: string,
      wordId: number
    }
  ];
}
