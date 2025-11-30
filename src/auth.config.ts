import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "./db.config.js";
import jwt from "jsonwebtoken"; // JWT 생성을 위해 import
import { user_gender } from "@prisma/client";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

const jwtOptions = {
  // 요청 헤더의 'Authorization'에서 'Bearer <token>' 토큰을 추출
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET!, //느낌표 추가함 오류나서..
};

export const jwtStrategy = new JwtStrategy(
  jwtOptions,
  async (payload, done) => {
    try {
      const user = await prisma.user.findFirst({ where: { id: payload.id } });

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  }
);
dotenv.config();
const secret = process.env.JWT_SECRET!; // .env의 비밀 키
//타스 오류 나서 느낌표!추가함

export const generateAccessToken = (user: any) => {
  return jwt.sign({ id: user.id, email: user.email }, secret, {
    expiresIn: "1h",
  });
};

export const generateRefreshToken = (user: any) => {
  return jwt.sign({ id: user.id }, secret, { expiresIn: "14d" });
};

const googleVerify = async (profile: any) => {
  const email = profile.emails?.[0]?.value; //google 로그인 후 전달 받은 사용자의 프로필 정보에 이메일이 포함되어 있는지 확인한다.
  if (!email) {
    throw new Error(`profile.email was not found: ${profile}`);
  }

  const user = await prisma.user.findFirst({ where: { email } }); //전달받은 이메일을 이용해서 사용자를 조회해본다.
  if (user != null) {
    return { id: user.id, email: user.email, name: user.name }; //이미 있는 이메일이면 여기서 리턴되고 끝
  }

  const created = await prisma.user.create({
    //없는 이메일이면 아래와 같은 디폴트값으로 생성함
    data: {
      email,
      name: profile.displayName, //오류 나서 고침
      gender: user_gender.여성,
      birth: new Date(1970, 0, 1),
      address: "추후 수정",
      detailAddress: "추후 수정",
      phoneNumber: "추후 수정",
    },
  });

  return { id: created.id, email: created.email, name: created.name };
};

export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID!,
    clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET!,
    //오류 나서 느낌표 추가함
    callbackURL: "/oauth2/callback/google",
    scope: ["email", "profile"],
  },

  async (accessToken: any, refreshToken: any, profile: any, cb: any) => {
    //사용자가 구글 로그인을 하면, Google에서 accessToken, refreshToken, profile 정보를 전달합니다.
    try {
      const user = await googleVerify(profile); //googleVerify(profile) 함수로 사용자의 이메일을 확인하고, DB에 해당 이메일이 있으면 기존 사용자 정보를 반환, 없으면 새로 생성합니다.
      //반환된 사용자 정보로 JWT 액세스 토큰과 리프레시 토큰을 생성합니다.
      const jwtAccessToken = generateAccessToken(user);
      const jwtRefreshToken = generateRefreshToken(user);

      return cb(null, {
        // cb는 콜백함수이다. 즉 여기서 선언하는 함수가 아니라 인수로 들어오는 함수이다.
        accessToken: jwtAccessToken,
        refreshToken: jwtRefreshToken,
      });
    } catch (err) {
      return cb(err);
    }
  }
);

//여기서 콜백함수는 뭐고 어떤역할을 하고 왜 굳이 쓰지? 단순히 인수 값만 return하고 실행은 호출한 함수가 하면 안되는건가?
//-> Passport라는 라이브러리 함수(외부 함수! 내가 바꿀 수 없는!!) 가 그렇게 정해놓았다. Passport 함수에서 cb를 인수로 주고, 나한테 cb를 실행하라고 정해둔 것. 그래서 우리는 cb를 실행시켜줘야 함.
