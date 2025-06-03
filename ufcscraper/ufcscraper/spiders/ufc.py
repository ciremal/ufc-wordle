import scrapy
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor


class UfcSpider(CrawlSpider):
    name = "ufc"
    allowed_domains = ["ufc.com"]
    start_urls = ["https://www.ufc.com/athletes/all?filters%5B0%5D=status%3A23"]

    rules = (
        Rule(LinkExtractor(allow=(r"athletes/all\?filters.*page=\d+")), callback='parse_fighter_pages', follow=True),
    )

    page_count = 0
    max_pages = 2

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
        name = response.css("h1.hero-profile__name::text").get()
        division = response.css("p.hero-profile__division-title::text").get()
        record = response.css("p.hero-profile__division-body::text").get().strip()

        record = record.split(" ")[0].split("-")

        win_method_info = self.parse_win_method(response)
        sig_str_pos_info = self.parse_sig_str_pos(response)
        accuracy_info = self.parse_accuracy_stats(response)
        additional_info = self.parse_additional_stats(response)
        if name and division and record:
            yield {
                "name": name.strip(),
                "divison": division.strip(),
                "wins": int(record[0]),
                "loss": int(record[1]),
                "draws": int(record[2])
            } | win_method_info | sig_str_pos_info | accuracy_info | additional_info

    def parse_win_method(self, response):
        
        info = {
            "KO/TKO": 0,
            "DEC": 0,
            "SUB": 0
        }
        for item in response.css('div.c-stat-3bar__group'):
            label = item.css("div.c-stat-3bar__label::text").get().split()[0]
            value = item.css("div.c-stat-3bar__value::text").get().split()[0]
            if label == "KO/TKO" or label == "DEC" or label == "SUB":
                info[label] = int(value.split(" ")[0])

        return info

    def parse_sig_str_pos(self, response):
        
        info = {
            "Standing": 0,
            "Clinch": 0,
            "Ground": 0
        }
        for item in response.css('div.c-stat-3bar__group'):
            label = item.css("div.c-stat-3bar__label::text").get().split()[0]
            value = item.css("div.c-stat-3bar__value::text").get().split()[0]
            if label == "Standing" or label == "Clinch" or label == "Ground":
                info[label] = int(value.split(" ")[0])

        return info

    def parse_accuracy_stats(self, response):
        info = {
            "striking accuracy": "0%",
            "takedown accuracy": "0%",
        }
        for item in response.css('div[class="stats-records stats-records--two-column"]'):
            title = item.css('h2.e-t3::text').get()
            if title == "Striking accuracy" or title == "Takedown Accuracy":
                percent = item.css('text.e-chart-circle__percent::text').get().strip()
                info[title.lower()] = percent
        return info

    def parse_additional_stats(self, response):
        info = {"Sig. Str. Landed": 0, 
                "Sig. Str. Absorbed": 0, 
                "Takedown avg": 0, 
                "Submission avg": 0, 
                "Sig. Str. Defense": "0%", 
                "Takedown Defense": "0%", 
                "Knockdown Avg": 0, 
                "Average fight time": "06:41"
            }
        for item in response.css('div[class*="c-stat-compare__group"]'):
            label = item.css('div.c-stat-compare__label::text').get()
            value = item.css('div.c-stat-compare__number::text').get()
            if label and value:
                label = label.strip()
                if label == "Sig. Str. Landed" or label == "Sig. Str. Absorbed" or label == "Takedown avg" or label == "Submission avg" or label == "Knockdown Avg":
                    info[label] = float(value.strip())
                elif label == "Sig. Str. Defense" or label == "Takedown Defense":
                    info[label] = value.strip() + "%"
                else:
                    info[label] = value.strip()
        return info

            
