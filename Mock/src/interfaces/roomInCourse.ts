export interface RoomInCourse {
    roomId: String;
    courseId: String;
    startDate: Date;
    endDate: Date;
    occupation?: number;
}

export interface RoomInCourseDocument extends RoomInCourse {
    _id: string;
}

export interface SubLocationData {
    buildingName: string;
    floorNumber: number;
}
