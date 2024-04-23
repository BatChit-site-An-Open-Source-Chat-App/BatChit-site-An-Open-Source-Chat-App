class ApiResponse {
  constructor(statusCode, data, message = "Success", code) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
    this.code = code;
  }
}

export { ApiResponse };
