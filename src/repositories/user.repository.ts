import { prisma } from "../db.config.js";
import { UserPreference, CreateUserData } from "../types/types.js";

// User 데이터 삽입 (Prisma)
export const addUser = async (data: CreateUserData): Promise<number | null> => {
  // 이메일 중복 확인
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    return null; //이제 service에서 joinUserId에서 null을 반환한걸로 인식하고 DuplicateUserEmailError 던짐. 근데 이게 null이 나오는 경우가 중복일때뿐인가?
  }

  // 새 사용자 생성
  const newUser = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      gender: data.gender,
      birth: data.birth,
      address: data.address,
      detailAddress: data.detailAddress,
      phoneNumber: data.phoneNumber,
      password: data.password,
    },
  });

  return newUser.id;
};

// 사용자 정보 얻기 (Prisma)
export const getUser = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  console.log(user);

  if (!user) {
    return null;
  }

  return user;
};

// 음식 선호 카테고리 매핑 (Prisma)
export const setPreference = async (
  userId: number,
  foodCategoryId: number
): Promise<void> => {
  await prisma.userFavorCategory.create({
    data: {
      userId: userId,
      foodCategoryId: foodCategoryId,
    },
  });

  return;
};

// 사용자 선호 카테고리 반환 (Prisma)
export const getUserPreferencesByUserId = async (
  userId: number
): Promise<UserPreference[]> => {
  const preferences = await prisma.userFavorCategory.findMany({
    where: { userId: userId },
    select: {
      id: true,
      foodCategoryId: true,
      userId: true,
      foodCategory: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      foodCategoryId: "asc",
    },
  });

  // null 체크 후 매핑
  return preferences
    .filter((pref) => pref.foodCategory !== null) // foodCategory가 null인 경우 제외
    .map((pref) => ({
      id: pref.id,
      food_category_id: pref.foodCategoryId,
      user_id: pref.userId,
      name: pref.foodCategory!.name, // ! 로 null이 아님을 단언 (위에서 이미 필터링함)
    }));
};

export const updateUser = async (
  userId: number,
  data: Partial<CreateUserData> //일부분만 바디로 들어올거임
): Promise<boolean> => {
  const result = await prisma.user.updateMany({
    where: { id: userId },
    data: data,
  });

  return result.count > 0; //업데이트된 행이 있으면 true 반환
};
