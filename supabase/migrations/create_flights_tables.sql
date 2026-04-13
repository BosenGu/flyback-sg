-- ============================================================
-- 数据库迁移文件: 创建航班数据表结构
-- 作用: 存储航班基本信息及OTA供应商比价数据
-- ============================================================

-- 创建 Flights 表 (航班基本信息)
CREATE TABLE IF NOT EXISTS Flights (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Flight_Number TEXT NOT NULL DEFAULT '',
    Airline TEXT NOT NULL DEFAULT '',
    Airline_Code TEXT DEFAULT '',
    Departure_City TEXT NOT NULL DEFAULT '',
    Departure_Code TEXT DEFAULT '',
    Arrival_City TEXT NOT NULL DEFAULT '',
    Arrival_Code TEXT DEFAULT '',
    Departure_Time TIME DEFAULT '00:00:00',
    Arrival_Time TIME DEFAULT '00:00:00',
    Duration_Minutes INTEGER DEFAULT 0,
    Stops INTEGER DEFAULT 0,
    Stop_Cities JSONB DEFAULT '[]',
    Base_Price INTEGER DEFAULT 0,
    Original_Price INTEGER DEFAULT 0,
    Price_Trend TEXT DEFAULT 'stable',
    Baggage_Allowance TEXT DEFAULT '20kg',
    Is_Direct BOOLEAN DEFAULT true,
    Flight_Date DATE DEFAULT CURRENT_DATE,
    Created_At TIMESTAMP WITH TIME ZONE DEFAULT now(),
    Updated_At TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 创建 OTA_Prices 表 (供应商报价比价)
CREATE TABLE IF NOT EXISTS OTA_Prices (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Flight_ID BIGINT NOT NULL DEFAULT 0,
    Provider_Name TEXT NOT NULL DEFAULT '',
    Provider_Code TEXT DEFAULT '',
    Provider_Logo TEXT DEFAULT '',
    Price INTEGER DEFAULT 0,
    Currency TEXT DEFAULT 'CNY',
    Booking_URL TEXT DEFAULT '',
    Features JSONB DEFAULT '[]',
    Rating DECIMAL(2,1) DEFAULT 4.5,
    Review_Count INTEGER DEFAULT 0,
    Is_Available BOOLEAN DEFAULT true,
    Last_Updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
    Created_At TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 创建 Price_Alerts 表 (降价订阅)
CREATE TABLE IF NOT EXISTS Price_Alerts (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Email TEXT NOT NULL DEFAULT '',
    Departure_City TEXT DEFAULT '',
    Arrival_City TEXT DEFAULT '',
    Target_Price INTEGER DEFAULT 0,
    Is_Active BOOLEAN DEFAULT true,
    Created_At TIMESTAMP WITH TIME ZONE DEFAULT now(),
    Notified_At TIMESTAMP WITH TIME ZONE
);

-- 添加表注释
COMMENT ON TABLE Flights IS '航班基本信息表，存储航线、时间、价格等核心数据';
COMMENT ON TABLE OTA_Prices IS 'OTA供应商比价表，关联Flights表存储各平台报价';
COMMENT ON TABLE Price_Alerts IS '用户降价订阅表，存储价格监控请求';

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_flights_route ON Flights(Departure_City, Arrival_City);
CREATE INDEX IF NOT EXISTS idx_flights_date ON Flights(Flight_Date);
CREATE INDEX IF NOT EXISTS idx_flights_price ON Flights(Base_Price);
CREATE INDEX IF NOT EXISTS idx_ota_prices_flight ON OTA_Prices(Flight_ID);
CREATE INDEX IF NOT EXISTS idx_price_alerts_email ON Price_Alerts(Email);
