// const CORS = 'https://cors-anywhere.herokuapp.com/';

// export const baseUrl = `https://khrs-api.sdex.online`;
// export const baseUrl = `https://dev-khrs-api.sdex.online`;// test url
export const baseUrl = `https://api.e-asylearn.dk`;
// export const baseUrl = `https://khrs-api-test.sdex.online`;
export const imagesBaseUrl = 'https://khrs-admin.sdex.online';

//Account
export const loginAPI = `${baseUrl}/api/Account/Login`;
export const registerAPI = `${baseUrl}/api/Account/Register`;
export const recommendedBy = `${baseUrl}/api/RecommendedBy/GetRecommendedBy`;
export const userChangePassword = `${baseUrl}/api/Account/changePasswod`;
export const updatedUserInfo = `${baseUrl}/api/Account/UpdateUser`;
export const resetPassword = `${baseUrl}/api/Account/requestResetPassword`;
export const getProfileData = `${baseUrl}/api/Account/GetProfileData`;

// get language
export const getLanguage = `${baseUrl}/api/Language/GetLanguage`

//Courses
export const getAllCoursesAPI = `${baseUrl}/api/Course/GetCourses`;
export const getUsersCoursesAPI = `${baseUrl}/api/UserCourse/GetAll`;
export const getCourseDetails = `${baseUrl}/api/Course/Details`;
export const createApplyCourse = `${baseUrl}/api/UserCourse/Create`;
export const getUserCourseDetails = `${baseUrl}/api/UserCourse/Details`;
export const courseMaterials = `${baseUrl}/api/Course/CourseMaterial`;
export const getCourseCategories = `${baseUrl}/api/Category/GetCategories`;
export const getCoursesByCategory = `${baseUrl}/api/Course/GetCoursesByCategory`;

// exercise
export const getExercise = `${baseUrl}/api/Exercise/Get`;
export const checkAnswerSingleChoise = `${baseUrl}/api/Exercise/SingleChoice/Answer`;
export const getMultiChoiceAnswer = `${baseUrl}/api/MultiChoiceAnswer/GetAll`;
export const checkAnswerMultipleChoice = `${baseUrl}/api/Exercise/MultiChoice/Answer`;
export const checkAnswerPuzzleText = `${baseUrl}/api/Exercise/PuzzleWithText/Answer`;
export const checkAnswerPuzzleImage = `${baseUrl}/api/Exercise/PuzzleWithImage/Answer`;

// test
export const getTextType = `${baseUrl}/api/Test/Get`;
export const getUserActiveTest = `${baseUrl}/api/Test/GetUserActiveTest`;
export const sendAnswerTest = `${baseUrl}/api/Test/Answer`;
export const finishedTest = `${baseUrl}/api/Test/Finished`;
export const getCertificate = `${baseUrl}/api/UserTest/GetCertificate`;

// pages
export const faqPage = `${baseUrl}/api/Faq/GetFaq`;
export const policyPage = `${baseUrl}/api/Policy/GetPolicy`;
export const getGeneratedVidoes = `${baseUrl}/api/GenericAttributeMedia/GetByGenericAttributeTitle`;


// traking page material
export const start = `${baseUrl}/api/AmDoneToday/Start`;
export const end = `${baseUrl}/api/AmDoneToday/End`;
export const getAllByUser = `${baseUrl}/api/AmDoneToday/GetAllByUser`;

// rating
export const createUserCourseRate = `${baseUrl}/api/Rate/Create`;

// suuccess board
export const successBoard = `${baseUrl}/api/SuccessBoard/GetSuccessBoard`;

