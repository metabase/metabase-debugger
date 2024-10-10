export interface XHREvent {
  timestamp: number;
  data: {
    method: string;
    url: string;
    requestHeaders: {
      [key: string]: string;
    };
    requestBody: string;
    responseHeaders: {
      [key: string]: string;
    };
    responseBody: string;
    responseStatus: number;
  };
}
