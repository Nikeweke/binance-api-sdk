import crypto from 'crypto'

/**
 * Get object and make it to query-params string
 * @param obj 
 * @returns string - like key=val&ke2=val2
 */
function toQueryParams(obj: Record<string, any>) : string {
  const str = Array<String>();
  for (let p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + 
      encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

function toQueryParamsWithSignature(queryParams: object, secretKey: string) : string {
  let queryParamsStr = toQueryParams(queryParams)
  return '?' + queryParamsStr + 
    '&signature=' + getSignature(queryParamsStr, secretKey)
}

function getTimestamp() : number {
  return Date.now()
}

function getSignature(params: string, secretKey: string) : string {
  return crypto
    .createHmac('sha256', secretKey)
    .update(params)
    .digest('hex');
}


export {
  toQueryParams,
  toQueryParamsWithSignature,
  getSignature,
  getTimestamp,
}