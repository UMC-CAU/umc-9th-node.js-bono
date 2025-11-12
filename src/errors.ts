export class LoginError extends Error {
  // 로그인이 필요합니다.
  errorCode = "U000";
  reason: string;
  data: any;

  constructor(reason: string, data?: any) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class DuplicateUserEmailError extends Error {
  errorCode = "U001";
  reason: string;
  data: any;

  constructor(reason: string, data?: any) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class UserNotFoundError extends Error {
  errorCode = "U002";
  reason: string;
  data: any;

  constructor(reason: string, data?: any) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class StoreNotFoundError extends Error {
  errorCode = "S001";
  reason: string;
  data: any;

  constructor(reason: string, data?: any) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
export class DuplicateStoreError extends Error {
  errorCode = "S002";
  reason: string;
  data: any;

  constructor(reason: string, data?: any) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class MissionNotFoundError extends Error {
  errorCode = "M001";
  reason: string;
  data: any;

  constructor(reason: string, data?: any) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class ReviewNotFoundError extends Error {
  errorCode = "R001";
  reason: string;
  data: any;

  constructor(reason: string, data?: any) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class UserMissionNotFoundError extends Error {
  errorCode = "UM002";
  reason: string;
  data: any;

  constructor(reason: string, data?: any) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class AlreadyInProgressError extends Error {
  errorCode = "UM003";
  reason: string;
  data: any;

  constructor(reason: string, data?: any) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class AlreadyCompletedError extends Error {
  errorCode = "UM004";
  reason: string;
  data: any;

  constructor(reason: string, data?: any) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
