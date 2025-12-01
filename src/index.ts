import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";

import { googleStrategy, jwtStrategy } from "./auth.config.js";
//파일명을 auth.config.ts로 변경하고 타입을 명시하면 가장 깔끔하게 해결됩니다.
import { prisma } from "./db.config.js";
import { Response } from "express";

import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";

import { handleUserSignUp } from "./controllers/user.controller.js";
import { handleStoreSignUp } from "./controllers/store.controller.js";
import {
  handleReviewSignUp,
  handleListStoreReviews,
  handleListMyReviews,
} from "./controllers/review.controller.js";
import {
  handleMissionSignUp,
  handleUserMissionUpdateInProgress,
  handleListStoreMissions,
  handleListMyMissionsInProgress,
  handleUserMissionUpdateCompleted,
} from "./controllers/mission.controller.js";
import { LoginError } from "./errors.js";

dotenv.config();

passport.use(googleStrategy);
passport.use(jwtStrategy);

const app = express();
const port = process.env.PORT;

app.use(morgan("dev")); // morgan 적용! 로그 포맷: dev
app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석
app.use(passport.initialize());

app.use(
  "/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(
    {},
    {
      swaggerOptions: {
        url: "/openapi.json",
      },
    }
  )
);

//이 모든 use들이 한 번에 적용이 되는건가? -> 네, 미들웨어는 등록된 순서대로 요청을 처리합니다. 각 미들웨어는 요청 객체(req)와 응답 객체(res)를 수정하거나, 다음 미들웨어로 제어를 전달할 수 있습니다. 따라서 app.use()로 등록된 모든 미들웨어가 순차적으로 적용됩니다.

/**
 * 공통 응답을 사용할 수 있는 헬퍼 함수 등록
 */
app.use((req, res, next) => {
  res.success = (success: any) => {
    // success가 떴을때
    return res.json({ resultType: "SUCCESS", error: null, success });
  };

  res.error = ({ errorCode = "unknown", reason = null, data = null }) => {
    // error가 떴을때
    return res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null,
    });
  };

  next();
});

app.get("/openapi.json", async (req, res, next) => {
  // #swagger.ignore = true
  const options = {
    openapi: "3.1.0",
    disableLogs: true,
    writeOutputFile: false,
  };
  const outputFile = "/dev/null"; // 파일 출력은 사용하지 않습니다.
  const routes = ["./src/index.ts"];
  const doc = {
    info: {
      title: "UMC 9th",
      description: "UMC 9th Node.js 스웨거를 만들었어요.",
    },
    host: "localhost:3000",
    schemes: ["http"],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  };

  const result = await swaggerAutogen(options)(outputFile, routes, doc);
  res.json(result ? result.data : null);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get(
  "/oauth2/login/google", //접속하면 자동으로 Google 로그인 주소로 이동하여 사용자가 Google 로그인을 할 수 있도록 해줍니다.
  passport.authenticate("google", {
    session: false,
  })
);
app.get(
  "/oauth2/callback/google", //Google 로그인이 성공하면 자동으로 되돌아오는 주소입니다. 여기에서는 쿼리 파라미터로 전달된 code 값을 이용해 Google API를 호출하여 사용자의 프로필 정보를 조회해 오게 됩니다.
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login-failed",
  }),
  (req, res) => {
    const tokens = req.user;

    res.status(200).json({
      resultType: "SUCCESS",
      error: null,
      success: {
        message: "Google 로그인 성공!",
        tokens: tokens, // { "accessToken": "...", "refreshToken": "..." }
      },
    });
  }
);

const isLogin = passport.authenticate("jwt", { session: false });

app.get("/mypage", isLogin, (req, res) => {
  (res as any).status(200).success({
    message: `인증 성공! ${(req as any).user.name}님의 마이페이지입니다.`,
    user: req.user, //오류나서 res, req 둘다 any로 받아버림
  });
});
app.post("/api/v1/users/signup", handleUserSignUp);
app.post("/api/v1/store/signup", handleStoreSignUp);

app.post("/api/v1/review/signup", isLogin, handleReviewSignUp); //이렇게만 해도 로그인 시에만 접근 가능하게 된다
app.post("/api/v1/store/mission/signup", handleMissionSignUp); //이건 가게 주인이 하는 거
app.post(
  "/api/v1/store/mission/inprogress",
  isLogin,
  handleUserMissionUpdateInProgress
);
app.patch(
  "/api/v1/users/mission/:user_mission_id/completed", //아이디를 바디로 넣는 게 낫나 params로 넣는 게 낫나?? 일단은 params로..
  handleUserMissionUpdateCompleted //이건 관리자만 가능
);

app.get("/api/v1/stores/:storeId/reviews", handleListStoreReviews); //이건 로그인 안 해도 가능
app.get("/api/v1/users/reviews", isLogin, handleListMyReviews);

app.get("/api/v1/stores/:storeId/missions", handleListStoreMissions); //로그인 안 해도 가능
app.get(
  "/api/v1/users/missionsInProgress",
  isLogin,
  handleListMyMissionsInProgress
);

/**
 * 전역 오류를 처리하기 위한 미들웨어 -> 맨 뒤에 있어야 함.
 */
app.use((err: any, req: any, res: any, next: any) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode || 500).error({
    // Controller 내에서 별도로 처리하지 않은 오류가 발생할 경우, 모두 잡아서 공통된 오류 응답으로 내려준다.
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Express Response 타입을 확장하여 커스텀 메서드(res.success, res.error) 타입 에러를 해결합니다.

declare global {
  namespace Express {
    interface Response {
      success?: (success: any) => Response;
      error?: (params: {
        errorCode?: string;
        reason?: string | null;
        data?: any;
      }) => Response;
    }
  }
}
