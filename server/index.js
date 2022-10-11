const express = require("express");
const app = express();
const port = 5100;
const bodyParser = require('body-parser');
const config = require('./config/key')
const cookieParser = require('cookie-parser');
const { User } = require("./models/User");
const { auth } = require('./middleware/auth');


//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json());
app.use(cookieParser());

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

  app.post('/api/users/register', (req, res) => {
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

  app.post('/api/users/login', (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
      if(!user) {
        return res.json({
          loginSuccess: false,
          message: "해당 이메일에 해당하는 유저가 없습니다."
        })
      }

      //요청된 이메일이 DB에 있다면 password 확인
      user.comparePassword(req.body.password, (err, isMatch) =>{
        if(!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다."
        })
      })
  
      //비밀번호가 맞다면 token 생성
      user.generateToken((err, user )=> {
        if(err) return res.status(400).send(err)
          // token을 저장 ( 쿠키 )
          res.cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id})
      })
    })
  })

  app.get('/api/users/auth', auth, (req, res) => {

    res.status(200).json({
      _id: req.user._id,
      isAdmin: req.user.role === 0 ? false : true,
      isAuth: true,
      email: req.user.email,
      name: req.user.name,
      lastname: req.user.lastname,
      role: req.user.role,
      image: req.user.image
    })

  })

  app.get('/api/landing', (req, res) => {
    res.send('true !!')
  })

  app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({_id: req.user._id},
      { token: "" }
      ,(err, user) => {
        if(err) return res.json({success: false, err});
        return res.status(200).send({
          success: true
        })
      })
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
