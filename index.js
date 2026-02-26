//mongodb(データベース)に接続しないとサーバが立ち上がらない
//app.listenをclient.connectの前におくと、ユーザがデータベースにアクセスできないままサーバにアクセス
// (docker run --rm --name=my-app-db -p 27017:27017 mongo)
const express = require('express');//express:サーバーを立ち上げる大元のライブラリ
const { MongoClient } = require('mongodb');
const path = require('path');
const { insertUser } = require('./user')
const app = express();//expressを使ってサーバーを立ち上げる
app.set('view engine', 'ejs');//ejsを使ってテンプレートを表示する
const client = new MongoClient('mongodb://localhost:27017');//どのmongodbに繋ぐか

app.use('/static', express.static(path.join(__dirname, 'public')));

async function main() {
  // サーバーのlisten前に接続する
  await client.connect();//接続する(非同期関数ー＞成功するかわからないのでawaitで待つ)

  const db = client.db('my-app');
  async function getUsers(db) {
    //users配列の中はオブジェクト
    const users = await db.collection('user').find().toArray();//users:データベースからとってきた値(find())をtoArray()
    //map:配列の中の要素を一つずつ取り出して、新しい配列を作る
    const names = users.map((user) => { return user.name });
    return {names};
  }
  app.get('/', async (req, res) => {//npm install ejsが必要
    const names = await getUsers(db);
    res.render(path.resolve(__dirname, 'views/index.ejs'), { users: names });
  });



  //post:データベースにデータを追加する
  //api/userにデータを送信する
  app.post('/api/user', express.json(), async (req, res) => {
    const name = req.body.name;//ユーザのリクエストの中にnameが入っていたらそれを取り出して入れる
    const { status, body } = await insertUser(name, db);
    res.status(status).send(body);
  });

  app.listen(3000, () => {
    console.log('start listening');
  });
}
main();