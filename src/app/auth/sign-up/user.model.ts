import FileUpload from "src/app/shared/models/fileUpload";

export interface User {

  id?: number;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  birthDate: Date;
  gender:number;
  password?: string;
  confirmPassword?: string;
  Recommended: number,
  languageId: number;
  acceptTerms: string;
  file: FileUpload[]
}
