const express = require("express");
const app = express();
const port = 5100;
const bodyParser = require('body-parser');
const { User } = require("./models/User");

const config = require('./config/key')

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended : true}))
//applicataion/json
app.use(bodyParser.json())

const mongoose = require("mongoose");
mongoose.connect(config.mongoURI,
    // { useNewParser: true,
    //   useUnifiedTopology: true,
    //   useCreateIndex: true,
    //   useFindAndModify: false,
    // }
    // 몽구스 버전이 6.0이상이라면 주석처리 
  )
  .then(() => { console.log("Connected...");})
  .catch((err) => console.log(err));

  app.get("/", (req, res) => res.send("acc") );

  app.post('/register', (req, res) => {
    //회원가입 할 때 필요한 정보를 client 에서 가져오면
    //DB에 삽입
    const user = new User(req.body);
    user.save((err, userInfo) => {
      if (err) return res.json({ success : false, err})
      return res.status(200).json({
        success : true
      })
    })
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
