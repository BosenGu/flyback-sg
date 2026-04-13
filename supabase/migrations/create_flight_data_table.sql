-- ============================================================
-- 数据库迁移文件: 创建特价机票数据表
-- 作用: 存储目的地城市、坐标、价格等特价机票信息
-- ============================================================

-- 创建 Flight_Data 表
CREATE TABLE IF NOT EXISTS Flight_Data (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    City_Name TEXT NOT NULL DEFAULT '',
    Coordinate JSONB DEFAULT '{}',
    Current_Price INTEGER DEFAULT 0,
    Original_Price INTEGER DEFAULT 0,
    Drop_Rate INTEGER DEFAULT 0,
    Flight_Image TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 添加表注释
COMMENT ON TABLE Flight_Data IS '特价机票数据源表，存储目的地城市、坐标、价格等信息';

-- 为常用查询字段创建索引（使用GIN索引支持JSONB查询）
CREATE INDEX IF NOT EXISTS idx_flight_data_drop_rate ON Flight_Data(Drop_Rate);
CREATE INDEX IF NOT EXISTS idx_flight_data_created_at ON Flight_Data(created_at);
