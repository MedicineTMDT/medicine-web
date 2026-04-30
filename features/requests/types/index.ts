// Enum matching the backend TypeOfRequest
export type TypeOfRequest = "ADD" | "EDIT" | "QUESTION";

// Payload sent to POST /api/v1/requests
export interface CreateRequestPayload {
  title: string;
  content: string;
  typeOfRequest: TypeOfRequest;
}

// The response shape from POST /api/v1/requests
export interface RequestResponse {
  id: string;
  title: string;
  content: string;
  typeOfRequest: TypeOfRequest;
  proceed: boolean;
}

// Paginated response from GET /api/v1/requests/user/{userId}
export interface RequestPageResponse {
  content: RequestResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
