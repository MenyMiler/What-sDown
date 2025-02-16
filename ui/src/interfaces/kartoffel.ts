export interface BaseKartoffelUser {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    hierarchy: string;
    jobTitle: string;
    personalNumber: string;
    mail: string;
    mobilePhone: string[];
    rank: string;
    sex: string;
    digitalIdentities: { uniqueId: string; source: string }[];
}

export interface KartoffelUser extends Omit<BaseKartoffelUser, 'digitalIdentities'> {
    /** custom displayName, not of kartoffel: `${fullName} - ${hierarchy}/${jobTitle}` */
    displayName: string;
    _id: string;
}
