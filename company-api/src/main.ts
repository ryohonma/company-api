import express from "express";
import work from './controlers/work'            ;

// expressアプリを生成する
const app: express.Express = express()

// CORSの許可
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

// body-parserに基づいた着信リクエストの解析
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ルーティング
app.use("/api/work" , work);

// APIサーバ起動
const port = process.argv[2] || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
