export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

export type RecursivePartial<T> = { [P in keyof T]?: RecursivePartial<T[P]> };

export type ConditionalReturnType<TCondition extends boolean, T, U> = TCondition extends true ? T : U;

export type GetByQuery<T, TPopulate = false> = Partial<T> & { step?: number; limit?: number; populate?: TPopulate };

export type AddParameters<TFunction extends (...args: any) => any, TParameters extends [...args: any]> = (
    ...args: [...Parameters<TFunction>, ...TParameters]
) => ReturnType<TFunction>;
