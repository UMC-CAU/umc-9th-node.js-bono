import { prisma } from "../db.config.js";

// User 데이터 삽입 (Prisma)
export const addUser = async (data) => {
  try {
    // 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return null;
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
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  }
};

// 사용자 정보 얻기 (Prisma)
export const getUser = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    console.log(user);

    if (!user) {
      return null;
    }

    return user;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  }
};

// 음식 선호 카테고리 매핑 (Prisma)
export const setPreference = async (userId, foodCategoryId) => {
  try {
    await prisma.userFavorCategory.create({
      data: {
        userId: userId,
        foodCategoryId: foodCategoryId,
      },
    });

    return;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  }
};

// 사용자 선호 카테고리 반환 (Prisma)
export const getUserPreferencesByUserId = async (userId) => {
  try {
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

    // MySQL 결과와 동일한 형식으로 변환
    return preferences.map((pref) => ({
      id: pref.id,
      food_category_id: pref.foodCategoryId,
      user_id: pref.userId,
      name: pref.foodCategory.name,
    }));
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  }
};
