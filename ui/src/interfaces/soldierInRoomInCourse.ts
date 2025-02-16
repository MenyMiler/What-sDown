import { CourseDocument } from './course';
import { RoomDocument } from './room';
import { SoldierDocument } from './soldier';

export interface SoldierInRoomInCourse {
    roomOfCourseId: String;
    soldierId: String;
}

export interface SoldierInRoomInCourseDocument extends SoldierInRoomInCourse {
    _id: string;
}
export interface SoldierInCourse {
    courseId: string;
    soldiersIds: string[];
}

export interface PopulatedSoldierInRoomInCourse {
    soldier: SoldierDocument;
    room: RoomDocument;
    course: CourseDocument;
    startDate: Date;
    endDate: Date;
}
