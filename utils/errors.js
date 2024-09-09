class BadRequestException extends Error {
    constructor(message) {
      super(message);
      this.name = 'BadRequestException';
    }
  }
  
  class NotFoundException extends Error {
    constructor(message) {
      super(message);
      this.name = 'NotFoundException';
    }
  }
  
  module.exports = {
    BadRequestException,
    NotFoundException,
  };
  