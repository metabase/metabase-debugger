export interface XHREvent {
  request: {
    timestamp: number;
    method: string;
    url: string;
    data: string;
  };
  response: {
    status: number;
    responseText: string;
  };
}