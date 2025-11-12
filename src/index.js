import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

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

const app = express();
const port = process.env.PORT;

app.use(morgan("dev")); // morgan 적용! 로그 포맷: dev
app.use(cookieParser()); // cookieParser 적용!

app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

/**
 * 공통 응답을 사용할 수 있는 헬퍼 함수 등록
 */
app.use((req, res, next) => {
  res.success = (success) => {
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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 쿠키 만드는 라우터 (로그인)
app.get("/api/v1/setcookie", (req, res) => {
  // 'myCookie'라는 이름으로 'hello' 값을 가진 쿠키를 생성
  res.cookie("myCookie", "hello", { maxAge: 60000 }); // 60초간 유효
  res.send("쿠키가 생성되었습니다!");
});

// 쿠키 읽는 라우터 (마이페이지?)
app.get("/api/v1/getcookie", (req, res) => {
  // cookie-parser 덕분에 req.cookies 객체에서 바로 꺼내 쓸 수 있음
  const myCookie = req.cookies.myCookie;

  if (myCookie) {
    console.log("쿠키가 있어요:", req.cookies); // { myCookie: 'hello' }
    res.send(`당신의 쿠키: ${myCookie}`);
  } else {
    console.log("쿠키가 없습니다.");
    res.send("쿠키가 없습니다.");
  }
});

// 쿠키 삭제 (로그아웃)
app.get("/api/v1/delcookie", (req, res) => {
  res.clearCookie("username");
  console.log("쿠키 삭제 완료");
  res.send('로그아웃 완료 (쿠키 삭제). <a href="/">메인으로</a>');
});

app.post("/api/v1/users/signup", handleUserSignUp);
app.post("/api/v1/store/signup", handleStoreSignUp);
app.post("/api/v1/review/signup", handleReviewSignUp);
app.post("/api/v1/store/mission/signup", handleMissionSignUp);
app.post("/api/v1/store/mission/inprogress", handleUserMissionUpdateInProgress);
app.patch(
  "/api/v1/users/mission/:user_mission_id/completed", //아이디를 바디로 넣는 게 낫나 params로 넣는 게 낫나?? 일단은 params로..
  handleUserMissionUpdateCompleted
);

app.get("/api/v1/stores/:storeId/reviews", handleListStoreReviews);
app.get("/api/v1/users/:userId/reviews", (req, res, next) => {
  // 쿠키 검사되어야 실행!!
  const myCookie = req.cookies.myCookie;

  if (myCookie) {
    console.log("쿠키 확인됨:", req.cookies);
    handleListMyReviews(req, res, next);
  } else {
    console.log("쿠키 없음");
    throw new LoginError("로그인이 필요합니다.");
  }
});

app.get("/api/v1/stores/:storeId/missions", handleListStoreMissions);
app.get("/api/v1/users/:userId/missions", (req, res, next) => {
  const myCookie = req.cookies.myCookie;

  if (myCookie) {
    console.log("쿠키 확인됨:", req.cookies);
    handleListMyMissionsInProgress(req, res, next);
  } else {
    console.log("쿠키 없음");
    throw new LoginError("로그인이 필요합니다.");
  }
});

/**
 * 전역 오류를 처리하기 위한 미들웨어 -> 맨 뒤에 있어야 함.
 */
app.use((err, req, res, next) => {
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
