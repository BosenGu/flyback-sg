-- ============================================================
-- 数据库迁移文件: 扩展 Flights 表添加城市信息字段
-- 作用: 添加城市图片和描述字段，支持低价探索页展示
-- ============================================================

-- 添加 City_Image_URL 字段
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'flights' AND column_name = 'city_image_url'
    ) THEN
        ALTER TABLE flights ADD COLUMN city_image_url TEXT DEFAULT '';
    END IF;
END $$;

-- 添加 City_Description 字段
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'flights' AND column_name = 'city_description'
    ) THEN
        ALTER TABLE flights ADD COLUMN city_description TEXT DEFAULT '';
    END IF;
END $$;

-- 添加测试数据：中国境内热门航线（从新加坡出发）
INSERT INTO flights (
    flight_number, airline, airline_code, 
    departure_city, departure_code, arrival_city, arrival_code,
    departure_time, arrival_time, duration_minutes, stops, is_direct,
    base_price, original_price, price_trend, baggage_allowance, flight_date,
    city_image_url, city_description
) VALUES 
('TR189', '酷航', 'TR', '新加坡', 'SIN', '上海', 'PVG', '08:30:00', '14:20:00', 350, 0, true, 899, 1599, 'low', '20kg', '2025-02-15', 'https://source.unsplash.com/featured/?city,china,shanghai', '东方巴黎，繁华与历史交融的国际大都市'),
('CA976', '国航', 'CA', '新加坡', 'SIN', '北京', 'PEK', '09:15:00', '15:30:00', 375, 0, true, 1099, 1899, 'stable', '23kg', '2025-02-16', 'https://source.unsplash.com/featured/?city,china,beijing', '千年帝都，古今辉映的文化心脏'),
('MU5036', '东航', 'MU', '新加坡', 'SIN', '成都', 'CTU', '13:20:00', '18:45:00', 325, 0, true, 799, 1499, 'low', '23kg', '2025-02-17', 'https://source.unsplash.com/featured/?city,china,chengdu', '天府之国，美食与大熊猫的故乡'),
('CZ3038', '南航', 'CZ', '新加坡', 'SIN', '昆明', 'KMG', '11:00:00', '15:30:00', 270, 0, true, 699, 1299, 'low', '23kg', '2025-02-18', 'https://source.unsplash.com/featured/?city,china,kunming', '春城花都，四季如春的高原明珠'),
('MF852', '厦航', 'MF', '新加坡', 'SIN', '西安', 'XIY', '14:30:00', '20:15:00', 345, 0, true, 849, 1599, 'stable', '23kg', '2025-02-19', 'https://source.unsplash.com/featured/?city,china,xian', '十三朝古都，兵马俑守护的历史名城'),
('HU748', '海航', 'HU', '新加坡', 'SIN', '海口', 'HAK', '12:00:00', '15:45:00', 225, 0, true, 599, 1199, 'low', '20kg', '2025-02-20', 'https://source.unsplash.com/featured/?city,china,haikou', '椰风海韵，热带风情的度假天堂'),
('9C8542', '春秋航空', '9C', '新加坡', 'SIN', '杭州', 'HGH', '10:30:00', '16:00:00', 330, 0, true, 749, 1399, 'low', '15kg', '2025-02-21', 'https://source.unsplash.com/featured/?city,china,hangzhou', '人间天堂，西湖美景如诗如画'),
('3K533', '捷星', '3K', '新加坡', 'SIN', '香港', 'HKG', '11:30:00', '15:50:00', 260, 0, true, 650, 1250, 'low', '20kg', '2025-02-22', 'https://source.unsplash.com/featured/?city,china,hongkong', '东方之珠，购物美食不夜城')

ON CONFLICT DO NOTHING;
