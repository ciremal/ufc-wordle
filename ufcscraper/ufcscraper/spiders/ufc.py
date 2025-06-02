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
        '''
        response.css("h1.hero-profile__name::text").get()
        response.css("p.hero-profile__division-title::text").get()
        response.css("p.hero-profile__division-body::text").get()
        response.css('div.c-stat-3bar__group')
        
        '''

        name = response.css("h1.hero-profile__name::text").get()
        division = response.css("p.hero-profile__division-title::text").get()
        record = response.css("p.hero-profile__division-body::text").get()
        if name and division and record:
            yield {
                "name": name.strip(),
                "divison": division.strip(),
                "record": record.strip()
            }

