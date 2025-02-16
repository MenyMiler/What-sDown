import { BaseDocument } from './base';
import { CourseDocument } from './course';
import { RoomWithSoldiers } from './room';

export interface Event {
    baseId: String;
    courseId?: String;
    name: string;
    description: string;
    amount: number;
    startDate: Date;
    endDate: Date;
}

export interface EventDocument extends Event {
    _id: string;
}

export interface PopulatedEvent extends Omit<EventDocument, 'baseId' | 'courseId'> {
    base: BaseDocument;
    course?: CourseDocument;
    rooms: RoomWithSoldiers[];
}

export interface EventGanttFilters extends Partial<Pick<Event, 'startDate' | 'endDate' | 'name' | 'courseId'>> {
    isConnectedToCourseFilter?: boolean;
}

export interface EventGantt extends EventDocument {
    courseName?: string;
}
