import scrapy
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
from ..items import UfcItem
from scrapy.loader import ItemLoader

class UfcSpider(CrawlSpider):
    name = "ufc"
    allowed_domains = ["ufc.com"]
    start_urls = ["https://www.ufc.com/athletes/all?filters%5B0%5D=status%3A23"]

    rules = (
        Rule(LinkExtractor(allow=(r"athletes/all\?filters.*page=\d+")), callback='parse_fighter_pages', follow=True),
    )

    page_count = 0
    max_pages = 1

    def parse_start_url(self, response):
        return self.parse_fighter_pages(response)

    def parse_fighter_pages(self, response):
        if self.page_count >= self.max_pages:
            self.crawler.engine.close_spider(self, reason="Reached max pages for testing")
            return
        
        self.page_count += 1
        for card in response.css("ul > li.l-flex__item"):
            fighter_page = card.css('div.c-listing-athlete-flipcard__action a::attr("href")').get()
            if fighter_page:
                yield response.follow(fighter_page, self.parse_fighter_info)

    def parse_fighter_info(self, response):
        itemLoader = ItemLoader(item=UfcItem(), response=response)

        itemLoader.add_css("name", "h1.hero-profile__name")
        itemLoader.add_css("division", "p.hero-profile__division-title")
        itemLoader.add_css("record", "p.hero-profile__division-body")

        self.parse_bio(response, itemLoader)
        self.parse_win_method(response, itemLoader)
        self.parse_sig_str_pos(response, itemLoader)
        self.parse_accuracy_stats(response, itemLoader)
        self.parse_additional_stats(response, itemLoader)

        return itemLoader.load_item()

    def parse_bio(self, response, itemLoader):
        for item in response.css("div.c-bio__field"):
            label = item.css('div.c-bio__label::text').get()
            if label:
                value = item.css('div.c-bio__text::text').get()
                if label == "Status": itemLoader.add_value('status', value)
                if label == "Hometown": itemLoader.add_value('hometown', value)
                if label == "Fighting style": itemLoader.add_value('fighting_style', value)
                if label == "Age": itemLoader.add_value('age', item.css('div[class*="field--name-age"]::text').get())
                if label == "Height": itemLoader.add_value('height', value)
                if label == "Weight": itemLoader.add_value('weight', value)
                if label == "Octagon Debut": itemLoader.add_value('debut', value)
                if label == "Reach": itemLoader.add_value('reach', value)
                if label == "Leg reach": itemLoader.add_value('leg_reach', value)
        return itemLoader.load_item()
        

    def parse_win_method(self, response, itemLoader):
        for item in response.css('div.c-stat-3bar__group'):
            label = item.css("div.c-stat-3bar__label::text").get().split()[0]
            if label == "KO/TKO":
                itemLoader.add_value("ko_tko", item.css("div.c-stat-3bar__value::text").get())
            elif label == "DEC":
                itemLoader.add_value("dec", item.css("div.c-stat-3bar__value::text").get())
            elif label == "SUB":
                itemLoader.add_value("sub", item.css("div.c-stat-3bar__value::text").get())
        return itemLoader.load_item()

    def parse_sig_str_pos(self, response, itemLoader):
        for item in response.css('div.c-stat-3bar__group'):
            label = item.css("div.c-stat-3bar__label::text").get().split()[0]
            if label == "Standing":
                itemLoader.add_value("standing", item.css("div.c-stat-3bar__value::text").get())
            elif label == "Clinch":
                itemLoader.add_value("clinch", item.css("div.c-stat-3bar__value::text").get())
            elif label == "Ground":
                itemLoader.add_value("ground", item.css("div.c-stat-3bar__value::text").get())

        return itemLoader.load_item()

    def parse_accuracy_stats(self, response, itemLoader):
        for item in response.css('div[class="stats-records stats-records--two-column"]'):
            title = item.css('h2.e-t3::text').get()
            if title == "Striking accuracy":
                itemLoader.add_value("str_acc", item.css('text.e-chart-circle__percent::text').get())
            elif title == "Takedown Accuracy":
                itemLoader.add_value("tkd_acc", item.css('text.e-chart-circle__percent::text').get())
        return itemLoader.load_item()

    def parse_additional_stats(self, response, itemLoader):
        for item in response.css('div[class*="c-stat-compare__group"]'):
            label = item.css('div.c-stat-compare__label::text').get()
            if label:
                label = label.strip()
                value = item.css('div.c-stat-compare__number::text').get()
                if label == "Sig. Str. Landed": itemLoader.add_value("sig_str_landed", value)
                elif label == "Sig. Str. Absorbed": itemLoader.add_value("sig_str_absorbed", value)
                elif label == "Takedown avg": itemLoader.add_value("tkd_avg", value)
                elif label == "Submission avg": itemLoader.add_value("sub_avg", value)
                elif label == "Knockdown Avg": itemLoader.add_value("kd_avg", value)
                elif label == "Sig. Str. Defense": itemLoader.add_value("sig_str_def", value)
                elif label == "Takedown Defense": itemLoader.add_value("tkd_def", value)
                elif label == "Average fight time": itemLoader.add_value("avg_fight_time", value.split())
        return itemLoader.load_item()

            

