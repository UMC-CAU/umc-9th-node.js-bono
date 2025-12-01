import { UserSignUpData } from "../types/types.js";

import bcrypt from "bcrypt";
import { responseFromUser } from "../dtos/user.dto.js";
import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
  updateUser,
} from "../repositories/user.repository.js";
import { DuplicateUserEmailError } from "../errors.js";

export const userSignUp = async (data: UserSignUpData) => {
  // 비밀번호 해싱 (salt rounds = 10)
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const joinUserId = await addUser({
    //addUser는 실행되는데, 반환은 아이디만 해서 joinUserId에는 아이디만 들어감.
    email: data.email,
    name: data.name,
    gender: data.gender,
    birth: data.birth,
    address: data.address,
    detailAddress: data.detailAddress,
    phoneNumber: data.phoneNumber,
    password: hashedPassword, // 해싱된 비밀번호 추가
  });

  if (joinUserId === null) {
    throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", data);
    //왜 service에서 했지 repository에서 안 하고?
    // -> Service 계층에서 비즈니스 로직 검증을 하는 것이 맞는 설계입니다! repository는 단순히 데이터 접근만 담당하니까요.
  }

  for (const preference of data.preferences) {
    //for (const 변수 of 배열): 변수에 배열 안의 각 요소가 하나씩 들어옴.
    await setPreference(joinUserId, preference);
  }

  const user = await getUser(joinUserId);
  // 방금 생성한 사용자가 없을 수 없으므로 null 체크
  if (user === null) {
    throw new Error("사용자 생성 후 조회에 실패했습니다.");
  }

  const preferences = await getUserPreferencesByUserId(joinUserId);

  return responseFromUser({ user, preferences });
};

export const updateUserProfile = async (userId: number, data: any) => {
  // data에는 수정할 필드들이 들어있음.
  // 예: { name: "새 이름", address: "새 주소" }

  // 비밀번호가 포함되어 있다면 해싱 처리
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  const updated = await updateUser(userId, data);
  if (!updated) {
    throw new Error("사용자 프로필 업데이트에 실패했습니다.");
  }

  const user = await getUser(userId);
  if (user === null) {
    throw new Error("업데이트 후 사용자 조회에 실패했습니다.");
  }

  const preferences = await getUserPreferencesByUserId(userId);

  return responseFromUser({ user, preferences });
};
