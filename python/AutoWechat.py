import itchat
import schedule
import time


# 注意实验楼环境的中文输入切换
# itchat.send('测试消息发送', 'filehelper')

# 监听收到文本信息
@itchat.msg_register(itchat.content.TEXT)
def auto_replay(msg):
    return msg['Text']


# 主方法
def main():
    # 登录
    itchat.auto_login(hotReload=True)
    # 启动自动回复
    # itchat.run()

    # 搜索微信群
    chatrooms = itchat.search_chatrooms(name=u'微信机器人测试')
    if len(chatrooms) == 0:
        print(u'没有找到群聊')
    else:
        print(chatrooms)

        # 定时任务
        # 讲师反馈周报(每周1 8点40)
        schedule.every().monday.at("8:40").do(lambda: itchat.send('友情提示: 上课前请反馈上周周报中学员提出的问题', chatrooms[0]['UserName']))
        # 提醒讲师进行周考(每周2 8点40)
        schedule.every().tuesday.at("8:40").do(lambda: itchat.send('友情提示: 下午5点进行周考, 请提前打印答题卡', chatrooms[0]['UserName']))
        # 提醒讲师进行阶段测评(每周3 8点40)
        schedule.every().wednesday.at("8:40").do(lambda: itchat.send('友情提示: 如果当阶段的测评还没有做, 请提醒我给大家做测评', chatrooms[0]['UserName']))
        # 讲师提交周考成绩(每周5 8点40)
        schedule.every().friday.at("8:40").do(lambda: itchat.send('友情提示: 下班之前, 提交本周周考成绩', chatrooms[0]['UserName']))
        # 讲师提醒学员写周报(每周5 17点30)
        schedule.every().friday.at("17:30").do(lambda: itchat.send('友情提示: 提醒学员在周六12点之前在OA中写周报', chatrooms[0]['UserName']))
        # 提醒讲师写周报(每周6 12点0)
        schedule.every().saturday.at("12:00").do(lambda: itchat.send('友情提示: 讲师记得在伙伴云表格中写周报', chatrooms[0]['UserName']))
        # 简报微刊(每天 8点30)
        schedule.every().day.at("8:40").do(lambda: itchat.send('简报', chatrooms[0]['UserName']))

        while True:
            schedule.run_pending()
            time.sleep(1)


def job():
    print("I'm working...")


# 调用main方法
main()
