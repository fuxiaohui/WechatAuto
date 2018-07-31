const {Wechaty, Room, config} = require('wechaty');
const qrcodeTerminal = require('qrcode-terminal');
const schedule = require("node-schedule");
const cheerio = require("cheerio");
const request = require('request');


// 微信机器人
const bot = Wechaty.instance({profile: config.default.DEFAULT_PROFILE});

bot
// 扫描登录
  .on('scan', (url, code) => {
    if (!/201|200/.test(String(code))) {
      const loginUrl = url.replace(/\/qrcode\//, '/l/');
      qrcodeTerminal.generate(loginUrl)
    }
  })


  // 登录成功
  .on('login', async function (user) {
    console.log(`User ${user.name()} logined`);


    setTimeout(async function () {
      const room = await bot.Room.find({topic: "蓝鸥Java分组"});
      console.log(room);

      if (room != null) {
        room.say("大家好!");

        task(room);
      }
    }, 3000);

  })

  // 初始化成功
  .start();


// 定时任务
function task(room) {
  /*
    * * * * * *
    ┬ ┬ ┬ ┬ ┬ ┬
    │ │ │ │ │ |
    │ │ │ │ │ └ day of week (0 - 7) (0 or 7 is Sun)
    │ │ │ │ └───── month (1 - 12)
    │ │ │ └────────── day of month (1 - 31)
    │ │ └─────────────── hour (0 - 23)
    │ └──────────────────── minute (0 - 59)
    └───────────────────────── second (0 - 59, OPTIONAL)
 */

  // 讲师反馈周报
  // 每周1 8点40
  schedule.scheduleJob('0 40 8 * * 5', function () {
    room.say("友情提示: 上课前请反馈上周周报中学员提出的问题");
  });

  // 提醒讲师进行周考
  // 每周2 8点40
  schedule.scheduleJob('0 40 8 * * 5', function () {
    room.say("友情提示: 下午5点进行周考, 请提前打印答题卡");
  });

  // 讲师提交周考成绩
  // 每周5 8点40
  schedule.scheduleJob('0 40 8 * * 5', function () {
    room.say("友情提示: 下班之前, 提交本周周考成绩");
  });

  // 讲师提醒学员写周报
  // 每周5 17点30
  schedule.scheduleJob('0 30 17 * * 5', function () {
    room.say("友情提示: 提醒学员在周六12点之前在OA中写周报");
  });

  // 提醒讲师写周报
  // 每周6 12点0
  schedule.scheduleJob('0 0 12 * * 6', function () {
    room.say("友情提示: 提醒学员在周六12点之前在OA中写周报");
  });

  // 简报微刊
  // 每天 8点30
  schedule.scheduleJob('0 30 8 * * *', function () {
    news(room);
  });
}

function news(room) {
  const ut = require('./common.js');
  const async = require('async');
  console.log('开始测试!!!');
  const public_num = 'mrzb158';
  //  任务数组
  const task = [];

  // 根据public_num搜索公众号,最好是微信号或者微信全名.
  task.push(function (callback) {
    ut.search_wechat(public_num, callback)
  });

  // 根据url获取公众号获取最后10条图文列表
  task.push(function (url, callback) {
    ut.look_wechat_by_url(url, callback)
  });

  // 根据图文url获取详细信息,发布日期,作者,公众号,阅读量,点赞量等
  task.push(function (article_titles, article_urls, article_pub_times, callback) {
    ut.get_info_by_url(article_titles, article_urls, article_pub_times, callback)
  });

  // 执行任务
  async.waterfall(task, function (err, result) {
    if (err) return console.log(err);

    console.log(result);
    let url;
    for (let obj of result) {
      if (obj.title.startsWith(getNowFormatDate())) {
        url = obj.url;
      }
    }
    console.log(url);

    request(url, function (err, response, html) {
      if (err) return;
      if (html.indexOf('<title>302 Found</title>') != -1) return;
      if (html.indexOf('您的访问过于频繁') != -1) return;

      const $ = cheerio.load(html);
      const text = $("#js_content section[data-tools-id]").text();
      console.log(text);
      const a = text.replace(/\d{1,2}、/g, '\n$&').replace(/【/g, '\n$&').replace("（公众号：简报微刊）", "");
      console.log(a);
      room.say(a);
    });

  });
}

// 获取当前的日期时间 格式“MM月dd日”
function getNowFormatDate() {
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return month + "月" + day + "日";
}
