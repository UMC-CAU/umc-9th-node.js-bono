export class DuplicateUserEmailError extends Error {
  errorCode = "U001";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class StoreNotFoundError extends Error {
  errorCode = "S001";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class UserNotFoundError extends Error {
  errorCode = "U002";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class MissionNotFoundError extends Error {
  errorCode = "M001";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class UserMissionInProgressError extends Error {
  errorCode = "UM001";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class UserMissionNotFoundError extends Error {
  errorCode = "UM002";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
