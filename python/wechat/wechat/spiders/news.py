# -*- coding: utf-8 -*-
import re
import scrapy
import datetime
from scrapy_splash import SplashRequest
from lxml import etree



class NewsSpider(scrapy.Spider):
    name = 'news'
    allowed_domains = ['weixin.sogou.com', 'mp.weixin.qq.com']
    start_urls = ['http://weixin.sogou.com/weixin?type=1&s_from=input&query=mrzb158&ie=utf8&_sug_=n&_sug_type_=']

    def parse(self, response):
        result = response.selector.xpath('//p[@class="tit"]/a/@href').extract()
        if result is not None:
            # print(result[0])
            # yield scrapy.Request(result[0], callback=self.parse_list)
            yield SplashRequest(result[0], self.parse_list, args={'wait': 0.5})

    def parse_list(self, response):

        i = datetime.datetime.now()
        a = "{0}月{1}日".format(i.month, i.day)

        result = response.selector.xpath('//h4[@class="weui_media_title"]').extract()
        # print(result)

        url = "https://mp.weixin.qq.com";
        for item in result:
            # print(item)
            html = etree.HTML(item)
            text = html.xpath('//h4/text()')[0].strip('\n ')
            # print(text)
            if text.startswith(a):
                temp = html.xpath('//h4/@hrefs')[0]
                url += temp
                break
        print(url)
        yield scrapy.Request(url, callback=self.parse_content)

    def parse_content(self, response):
        print(response.body)
        result = response.selector.xpath('//div[@id="js_content"]/section[4]//p//span/text()').extract()
        str = "".join(result).replace("（公众号：简报微刊）", "")
        str = re.sub(r'1、', '\n1、', str, 1)
        print("；\n".join(str.split("；")))

