export interface SoldierInRoomInCourse {
    roomOfCourseId: String;
    soldierId: String;
}

export interface SoldierInRoomInCourseDocument extends SoldierInRoomInCourse {
    _id: String;
}
