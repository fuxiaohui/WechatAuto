// const Robot = require('tuling123-client')
// robot = new Robot('0a4114ff7687944016c9d50a07eb0f50')
// robot.ask('你好', {userid: 'wwx'}).then(function (data) {
//   console.log(data.text);
// })

const { Wechaty, Room} = require('wechaty')
const qrcodeTerminal = require('qrcode-terminal')
const schedule = require("node-schedule")

//微信机器人
Wechaty.instance()

//扫描登录
.on('scan', (url, code) => {
  if (!/201|200/.test(String(code))) {
    const loginUrl = url.replace(/\/qrcode\//, '/l/')
    qrcodeTerminal.generate(loginUrl)
  }
})

//登录成功
.on('login', user => {
  console.log(`User ${user} logined`)

  setTimeout(function () {
    Room.find({ topic: "test" }).then(function (room) {
      console.log(room);

      test(room);

    })
  }, 5000);

})

//初始化成功
.init()


//周任务单提醒
//每周5中午12点提醒
function test(room) {
  var rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = 5;
  rule.hour = 11;
  rule.minute = 0;
  var j = schedule.scheduleJob(rule, function(){
    room.say("今天是周五, 记得发本周的产出和下周的计划");
  });
}