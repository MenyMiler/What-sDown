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

export interface Feedback {
    userId: string;
    urgency: UrgencyTypes;
    category: CategoryTypes;
    description: string;
    rating: number;
    seen: boolean;
}

export interface FeedbackDocument extends Feedback {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface PopulatedFeedback extends Omit<FeedbackDocument, 'userId'> {
    name: string;
    job: string;
    personalNumber: string;
    mail: string;
    phoneNumber: string;
    basesNames: string[];
}

export interface PopulatedFeedbackForExcel
    extends Omit<PopulatedFeedback, 'updatedAt' | '_id' | 'createdAt' | 'seen' | 'personalNumber' | 'mail' | 'phoneNumber' | 'basesNames'> {
    createdAt: string;
    seen: string;
}

export enum FeedbackTypes {
    NORMAL = 'NORMAL',
    ARCHIVE = 'ARCHIVE',
}
