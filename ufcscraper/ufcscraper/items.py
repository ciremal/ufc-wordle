# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy
from itemloaders.processors import MapCompose, TakeFirst, Identity
from w3lib.html import remove_tags

def clean_record(value):
    record_arr = value.split(" ")[0].split("-")
    return [int(item) for item in record_arr]

def clean_values_int(value):
    return int(value.split(" ")[0])

def clean_values_float(value):
    return float(value.split(" ")[0])

def format_str(value):
    return value.lower()

def format_values_percent(value):
    return value.split()[0] + "%"

class UfcItem(scrapy.Item):
    name = scrapy.Field(
        input_processor=MapCompose(remove_tags, format_str),
        output_processor=TakeFirst(),
    )
    division = scrapy.Field(
        input_processor=MapCompose(remove_tags, format_str),
        output_processor=TakeFirst(),
    )
    record = scrapy.Field(
        input_processor=MapCompose(remove_tags, clean_record),
        output_processor=Identity(),
    )
    status = scrapy.Field(
        input_processor=MapCompose(format_str),
        output_processor=TakeFirst(),
    )
    hometown = scrapy.Field(
        input_processor=MapCompose(format_str),
        output_processor=TakeFirst(),
    )
    fighting_style = scrapy.Field(
        input_processor=MapCompose(format_str),
        output_processor=TakeFirst(),
    )
    age = scrapy.Field(
        input_processor=MapCompose(clean_values_int),
        output_processor=TakeFirst(),
    )
    height = scrapy.Field(
        input_processor=MapCompose(clean_values_float),
        output_processor=TakeFirst(),
    )
    weight = scrapy.Field(
        input_processor=MapCompose(clean_values_float),
        output_processor=TakeFirst(),
    )
    debut = scrapy.Field(
        input_processor=MapCompose(format_str),
        output_processor=TakeFirst(),
    )
    reach = scrapy.Field(
        input_processor=MapCompose(clean_values_float),
        output_processor=TakeFirst(),
    )
    leg_reach = scrapy.Field(
        input_processor=MapCompose(clean_values_float),
        output_processor=TakeFirst(),
    )
    ko_tko = scrapy.Field(
        input_processor=MapCompose(remove_tags, clean_values_int),
        output_processor=TakeFirst(),
    )
    dec = scrapy.Field(
        input_processor=MapCompose(remove_tags, clean_values_int),
        output_processor=TakeFirst(),
    )
    sub = scrapy.Field(
        input_processor=MapCompose(remove_tags, clean_values_int),
        output_processor=TakeFirst(),
    )
    standing = scrapy.Field(
        input_processor=MapCompose(remove_tags, clean_values_int),
        output_processor=TakeFirst(),
    )
    clinch = scrapy.Field(
        input_processor=MapCompose(remove_tags, clean_values_int),
        output_processor=TakeFirst(),
    )
    ground = scrapy.Field(
        input_processor=MapCompose(remove_tags, clean_values_int),
        output_processor=TakeFirst(),
    )
    str_acc = scrapy.Field(
        output_processor=TakeFirst(),
    )
    tkd_acc = scrapy.Field(
        output_processor=TakeFirst(),
    )
    sig_str_landed = scrapy.Field(
        input_processor=MapCompose(remove_tags, clean_values_float),
        output_processor=TakeFirst(),
    )
    sig_str_absorbed = scrapy.Field(
        input_processor=MapCompose(remove_tags, clean_values_float),
        output_processor=TakeFirst(),
    )
    tkd_avg = scrapy.Field(
        input_processor=MapCompose(remove_tags, clean_values_float),
        output_processor=TakeFirst(),
    )
    sub_avg = scrapy.Field(
        input_processor=MapCompose(remove_tags, clean_values_float),
        output_processor=TakeFirst(),
    )
    kd_avg = scrapy.Field(
        input_processor=MapCompose(remove_tags, clean_values_float),
        output_processor=TakeFirst(),
    )
    sig_str_def = scrapy.Field(
        input_processor=MapCompose(remove_tags, format_values_percent),
        output_processor=TakeFirst(),
    )
    tkd_def = scrapy.Field(
        input_processor=MapCompose(remove_tags, format_values_percent),
        output_processor=TakeFirst(),
    )
    avg_fight_time = scrapy.Field(
        output_processor=TakeFirst(),
    )
