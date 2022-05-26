import { AudioElement } from "./audioObject";

export interface ExerciseItem {
  id: number;
  courseId: number;
  question: string;
  voiceDanishPath:string;
  audioElementDanish:AudioElement;

  singleChoiceTranslations:[{
    id?:number;
    voicePath:string;
  }];
  multiChoiceTranslations:[{
    id?:number;
    voicePath:string;
  }];
  audioElement:AudioElement;
}
