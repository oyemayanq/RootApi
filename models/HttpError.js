class HttpError extends Error {
  constructor(code, msg) {
    super(msg);
    this.code = code;
  }
}

module.exports = HttpError;
