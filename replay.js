//自动回复
const qrcodeTerminal = require('qrcode-terminal')


const { Wechaty, Room} = require('wechaty')

const bot = Wechaty.instance(/* no profile here because roger bot is too noisy */)

bot

.on('scan', (url, code) => {
  if (!/201|200/.test(String(code))) {
  const loginUrl = url.replace(/\/qrcode\//, '/l/')
  qrcodeTerminal.generate(loginUrl)
}
console.log(`${url}\n[${code}] Scan QR Code in above url to login: `)
})

.on('message', async m => {
  if (m.self()) {
    return // skip self
  }
  await m.say('roger')                            // 1. reply others' msg
  console.log(`RECV: ${m}, REPLY: "roger"`) // 2. log message
})

.init()

.catch(e => console.error(e))