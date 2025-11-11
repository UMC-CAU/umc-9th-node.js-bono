import bcrypt from "bcrypt";
import { responseFromUser } from "../dtos/user.dto.js";
import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
} from "../repositories/user.repository.js";
import { DuplicateUserEmailError } from "../errors.js";

export const userSignUp = async (data) => {
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
  }

  for (const preference of data.preferences) {
    //for (const 변수 of 배열): 변수에 배열 안의 각 요소가 하나씩 들어옴.
    await setPreference(joinUserId, preference);
  }

  const user = await getUser(joinUserId);
  const preferences = await getUserPreferencesByUserId(joinUserId);

  return responseFromUser({ user, preferences });
};
