export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

export type RecursivePartial<T> = { [P in keyof T]?: RecursivePartial<T[P]> };

export type ConditionalReturnType<TCondition extends boolean, T, U> = TCondition extends true ? T : U;

export type GetByQuery<T> = Partial<T> & { step?: number; limit?: number };

export const TypedObject = <T>(object: any): object is T => {
    return (
        typeof object === 'object' &&
        !!object &&
        Object.keys(object).every((key) => {
            const interfaceProp = (object as T)[key];
            return key in object || interfaceProp === undefined;
        })
    );
};

export type GetByQuery2<T, TPopulate extends boolean> = Partial<T> & { step?: number; limit?: number; populate?: TPopulate };
