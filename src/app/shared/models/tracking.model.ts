export interface IStartTracking {
    courseId: number;
    limit: number;
    offset: number;
    type: number;
    startDate?: Date;
    endDate?: Date;
}