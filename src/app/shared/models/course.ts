import { imagesBaseUrl } from "src/app/api.constants";
import { AudioElement } from "./audioObject";

export class Course{
    id:number;
    order:number;
    code:string;
    price:number;
    duration:number;
    imagePath:string;
    set imagePathCombined(value) {
        this.imagePathCombined = value;
    }
    get imagePathCombined(){
            return imagesBaseUrl + this.imagePathCombined;
    }
    courseTranslations:[{
        id?: number,
        title: string,
        introVideoPath: string,
        introVoicePath: string,
        languageName: string,
        languageId: number
    }]
    audioElement:AudioElement;

}