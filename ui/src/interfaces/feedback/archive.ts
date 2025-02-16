export enum UrgencyTypes {
    NOT_URGENT = 'NOT_URGENT',
    URGENT = 'URGENT',
    VERY_URGENT = 'VERY_URGENT',
}

export enum CategoryTypes {
    OTHER = 'OTHER',
    AUTHENTICATION = 'AUTHENTICATION',
    CLASS_GANTT = 'CLASS_GANTT',
    OFFICE_GANTT = 'OFFICE_GANTT',
    BEDROOM_GANTT = 'BEDROOM_GANTT',
    COURSE_GANTT = 'COURSE_GANTT',
    RECRUIT_GANTT = 'RECRUIT_GANTT',
    ADD_RESOURCES = 'ADD_RESOURCES',
}

export interface FeedbackArchive {
    userId: string;
    urgency: UrgencyTypes;
    category: CategoryTypes;
    description: string;
    rating: number;
    seen: boolean;
}

export interface FeedbackArchiveDocument extends FeedbackArchive {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}
