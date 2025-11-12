import { user_gender } from "@prisma/client";

// 회원가입 전체 데이터
export interface UserSignUpData {
  email: string;
  name: string;
  gender: user_gender;
  birth: Date;
  address: string;
  detailAddress: string;
  phoneNumber: string;
  password: string;
  preferences: number[];
}

// User 테이블 생성용 데이터 (preferences 제외)
export interface CreateUserData {
  //addUser에서 쓰임
  email: string;
  name: string;
  gender: user_gender;
  birth: Date;
  address: string;
  detailAddress: string;
  phoneNumber: string;
  password: string;
}

// 회원가입 응답 데이터
export interface UserResponse {
  email: string;
  name: string;
  gender: string;
  birth: Date;
  address: string;
  detailAddress: string;
  phoneNumber: string;
  preferences: string[];
}

// 사용자 선호 카테고리
export interface UserPreference {
  id: number;
  food_category_id: number | null; // ← null 허용
  user_id: number | null; // ← null 허용
  name: string;
}

// responseFromUser 함수의 파라미터 타입
export interface ResponseFromUserInput {
  user: {
    email: string;
    name: string;
    gender: string;
    birth: Date;
    address: string | null; // ← null 허용
    detailAddress: string | null; // ← null 허용
    phoneNumber: string | null; // ← null 허용
  };
  preferences: UserPreference[];
}
