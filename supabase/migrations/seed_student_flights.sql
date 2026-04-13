-- ============================================================
-- 数据库迁移文件: 新加坡留学生回国航班数据种子
-- 作用: 生成15+条从SIN出发到中国主要城市的航班数据
-- ============================================================

-- 清空现有数据并重新插入（仅用于开发环境）
DELETE FROM flights WHERE departure_city = '新加坡';

-- 插入15条航班数据，覆盖7个中国主要城市，每个城市2-3个不同日期
INSERT INTO flights (
    flight_number, airline, airline_code, 
    departure_city, departure_code, arrival_city, arrival_code,
    departure_time, arrival_time, duration_minutes, stops, is_direct,
    base_price, original_price, price_trend, baggage_allowance, flight_date,
    city_image_url, city_description
) VALUES 
-- 上海 (3个航班，不同日期)
('TR189', '酷航', 'TR', '新加坡', 'SIN', '上海', 'PVG', '08:30:00', '14:20:00', 350, 0, true, 899, 1599, 'low', '20kg', '2025-02-15', 'https://nocode.meituan.com/photo/search?keyword=shanghai,skyline,night&width=800&height=600', '东方巴黎，繁华与历史交融的国际大都市'),
('SQ802', '新加坡航空', 'SQ', '新加坡', 'SIN', '上海', 'PVG', '10:00:00', '15:50:00', 350, 0, true, 1299, 2199, 'stable', '30kg', '2025-02-18', 'https://nocode.meituan.com/photo/search?keyword=shanghai,bund,modern&width=800&height=600', '东方巴黎，繁华与历史交融的国际大都市'),
('MU568', '东航', 'MU', '新加坡', 'SIN', '上海', 'PVG', '14:20:00', '20:10:00', 350, 0, true, 1099, 1899, 'low', '23kg', '2025-02-22', 'https://nocode.meituan.com/photo/search?keyword=shanghai,tower,urban&width=800&height=600', '东方巴黎，繁华与历史交融的国际大都市'),

-- 北京 (3个航班，不同日期)
('CA976', '国航', 'CA', '新加坡', 'SIN', '北京', 'PEK', '09:15:00', '15:30:00', 375, 0, true, 1099, 1899, 'stable', '23kg', '2025-02-16', 'https://nocode.meituan.com/photo/search?keyword=beijing,forbidden,city&width=800&height=600', '千年帝都，古今辉映的文化心脏'),
('SQ802', '新加坡航空', 'SQ', '新加坡', 'SIN', '北京', 'PEK', '00:30:00', '06:45:00', 375, 0, true, 1499, 2499, 'high', '30kg', '2025-02-20', 'https://nocode.meituan.com/photo/search?keyword=beijing,great,wall&width=800&height=600', '千年帝都，古今辉映的文化心脏'),
('CZ354', '南航', 'CZ', '新加坡', 'SIN', '北京', 'PEK', '13:50:00', '20:05:00', 375, 0, true, 1199, 1999, 'low', '23kg', '2025-02-24', 'https://nocode.meituan.com/photo/search?keyword=beijing,temple,ancient&width=800&height=600', '千年帝都，古今辉映的文化心脏'),

-- 成都 (2个航班，不同日期)
('MU5036', '东航', 'MU', '新加坡', 'SIN', '成都', 'CTU', '13:20:00', '18:45:00', 325, 0, true, 799, 1499, 'low', '23kg', '2025-02-17', 'https://nocode.meituan.com/photo/search?keyword=chengdu,panda,garden&width=800&height=600', '天府之国，美食与大熊猫的故乡'),
('3U3868', '川航', '3U', '新加坡', 'SIN', '成都', 'CTU', '17:00:00', '22:25:00', 325, 0, true, 859, 1599, 'low', '23kg', '2025-02-21', 'https://nocode.meituan.com/photo/search?keyword=chengdu,food,street&width=800&height=600', '天府之国，美食与大熊猫的故乡'),

-- 广州 (2个航班，不同日期)
('CZ304', '南航', 'CZ', '新加坡', 'SIN', '广州', 'CAN', '12:30:00', '16:45:00', 255, 0, true, 699, 1299, 'low', '23kg', '2025-02-15', 'https://nocode.meituan.com/photo/search?keyword=guangzhou,tower,night&width=800&height=600', '南国花城，美食与商贸之都'),
('TR100', '酷航', 'TR', '新加坡', 'SIN', '广州', 'CAN', '07:20:00', '11:35:00', 255, 0, true, 599, 1199, 'low', '20kg', '2025-02-19', 'https://nocode.meituan.com/photo/search?keyword=guangzhou,pearl,river&width=800&height=600', '南国花城，美食与商贸之都'),

-- 深圳 (2个航班，不同日期)
('ZH9024', '深航', 'ZH', '新加坡', 'SIN', '深圳', 'SZX', '11:00:00', '15:20:00', 260, 0, true, 749, 1399, 'stable', '23kg', '2025-02-16', 'https://nocode.meituan.com/photo/search?keyword=shenzhen,skyline,tech&width=800&height=600', '创新之城，粤港澳大湾区的明珠'),
('SQ847', '新加坡航空', 'SQ', '新加坡', 'SIN', '深圳', 'SZX', '08:45:00', '13:05:00', 260, 0, true, 999, 1799, 'high', '30kg', '2025-02-23', 'https://nocode.meituan.com/photo/search?keyword=shenzhen,modern,city&width=800&height=600', '创新之城，粤港澳大湾区的明珠'),

-- 杭州 (2个航班，不同日期)
('9C8542', '春秋航空', '9C', '新加坡', 'SIN', '杭州', 'HGH', '10:30:00', '16:00:00', 330, 0, true, 749, 1399, 'low', '15kg', '2025-02-18', 'https://nocode.meituan.com/photo/search?keyword=hangzhou,west,lake&width=800&height=600', '人间天堂，西湖美景如诗如画'),
('MF852', '厦航', 'MF', '新加坡', 'SIN', '杭州', 'HGH', '14:10:00', '19:40:00', 330, 0, true, 829, 1529, 'low', '23kg', '2025-02-25', 'https://nocode.meituan.com/photo/search?keyword=hangzhou,tea,plantation&width=800&height=600', '人间天堂，西湖美景如诗如画'),

-- 西安 (1个航班)
('MU221', '东航', 'MU', '新加坡', 'SIN', '西安', 'XIY', '15:30:00', '21:15:00', 345, 0, true, 849, 1599, 'stable', '23kg', '2025-02-17', 'https://nocode.meituan.com/photo/search?keyword=xian,terracotta,warriors&width=800&height=600', '十三朝古都，兵马俑守护的历史名城');

-- 为这15个航班生成OTA价格数据（含学生优惠标识）
INSERT INTO ota_prices (flight_id, provider_name, provider_code, provider_logo, price, currency, booking_url, features, rating, review_count, is_available, last_updated)
SELECT 
    f.id,
    unnest(ARRAY['携程旅行', '飞猪旅行', '去哪儿网', 'StudentUniverse', 'Kiwi.com']),
    unnest(ARRAY['ctrip', 'fliggy', 'qunar', 'studentuniverse', 'kiwi']),
    unnest(ARRAY['🐬', '🐷', '🐪', '🎓', '🥝']),
    (f.base_price + (random() * 400 - 200))::integer,
    'CNY',
    unnest(ARRAY[
        'https://www.ctrip.com',
        'https://www.fliggy.com',
        'https://www.qunar.com',
        'https://www.studentuniverse.com',
        'https://www.kiwi.com'
    ]),
    unnest(ARRAY[
        '["退改保障", "发票支持"]'::jsonb,
        '["信用住", "会员积分"]'::jsonb,
        '["极速出票", "在线选座"]'::jsonb,
        '["学生证9折", "额外行李10kg", "免费改签"]'::jsonb,
        '["低价保证", "多航司组合"]'::jsonb
    ]),
    unnest(ARRAY[4.8, 4.6, 4.5, 4.7, 4.3]),
    unnest(ARRAY[12580, 6700, 8900, 1200, 2100]),
    true,
    now()
FROM flights f
WHERE f.departure_city = '新加坡' AND f.id NOT IN (SELECT DISTINCT flight_id FROM ota_prices WHERE flight_id IN (SELECT id FROM flights WHERE departure_city = '新加坡'));

-- 更新统计信息
ANALYZE flights;
ANALYZE ota_prices;
