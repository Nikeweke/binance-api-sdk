/**
 * Get object and make it to query-params string
 * @param obj
 * @returns string - like key=val&ke2=val2
 */
declare function toQueryParams(obj: Record<string, any>): string;
declare function toQueryParamsWithSignature(queryParams: object, secretKey: string): string;
declare function getTimestamp(): number;
declare function getSignature(params: string, secretKey: string): string;
export { toQueryParams, toQueryParamsWithSignature, getSignature, getTimestamp, };
