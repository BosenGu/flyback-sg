import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Plane, Clock, Luggage, Info, TrendingDown, TrendingUp, Minus, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

// 航司Logo映射
const AIRLINE_LOGOS = {
  '酷航': '✈️',
  '国航': '🇨🇳',
  '东航': '🔴',
  '南航': '🔵',
  '新航': '🦁',
  '亚航': '🔴',
  '捷星': '🌟',
  '国泰': '🟢',
  '海航': '🌊',
  '春秋航空': '🟢',
  '厦航': '✈️',
  '川航': '🐼',
  '深航': '🔵',
  '吉祥航空': '🟣'
};

// AI价格趋势组件
const PriceTrendBadge = ({ trend }) => {
  if (trend === 'low') {
    return (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 text-xs">
        <TrendingDown className="w-3 h-3 mr-1" />
        当前低价·建议购买
      </Badge>
    );
  }
  if (trend === 'high') {
    return (
      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0 text-xs">
        <TrendingUp className="w-3 h-3 mr-1" />
        价格波动·建议观望
      </Badge>
    );
  }
  return (
    <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 border-0 text-xs">
      <Minus className="w-3 h-3 mr-1" />
      价格平稳
    </Badge>
  );
};

const FlightCard = ({ flight, onViewDetails, onOpenChat, index = 0 }) => {
  const [minPrice, setMinPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const {
    id,
    airline = '酷航',
    flightNo = 'TR189',
    departureTime = '08:30',
    arrivalTime = '14:20',
    originCode = 'SIN',
    destCode = 'PVG',
    duration = '5h 50m',
    stops = 0,
    price = 1280,
    originalPrice = 1680,
    trend = 'low',
    baggage = '20kg'
  } = flight;

  const airlineLogo = AIRLINE_LOGOS[airline] || '✈️';

  // 获取OTA最低价格
  useEffect(() => {
    const fetchMinPrice = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('ota_prices')
          .select('price')
          .eq('flight_id', id)
          .eq('is_available', true)
          .order('price', { ascending: true })
          .limit(1);
        
        if (error) {
          console.error('获取OTA价格失败:', error);
        } else if (data && data.length > 0) {
          setMinPrice(data[0].price);
        }
      } catch (err) {
        console.error('查询失败:', err);
      }
      setLoading(false);
    };
    
    fetchMinPrice();
  }, [id]);

  // 显示价格：优先使用OTA最低价格，否则使用基础价格
  const displayPrice = minPrice || price;
  const displayOriginalPrice = originalPrice || Math.round(displayPrice * 1.3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className="flight-card group"
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
        {/* 左侧：航司信息 */}
        <div className="flex items-center gap-3 lg:w-32">
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-xl">
            {airlineLogo}
          </div>
          <div>
            <div className="font-semibold text-slate-800 text-sm">{airline}</div>
            <div className="text-xs text-slate-400">{flightNo}</div>
          </div>
        </div>

        {/* 中部：航班时间线 */}
        <div className="flex-1 flex items-center gap-4">
          {/* 出发 */}
          <div className="text-center w-20">
            <div className="text-xl font-bold text-slate-800">{departureTime}</div>
            <div className="text-sm text-slate-500">{originCode}</div>
          </div>

          {/* 飞行线 */}
          <div className="flex-1 flex flex-col items-center">
            <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {duration}
            </div>
            <div className="w-full h-0.5 bg-slate-200 relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-300" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-300" />
              {stops === 0 ? (
                <Plane className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-[#00A5FF]" />
              ) : (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] rounded-full border border-amber-200">
                  转{stops}次
                </div>
              )}
            </div>
            <div className={`text-xs mt-1 ${stops === 0 ? 'text-green-600 font-medium' : 'text-amber-600'}`}>
              {stops === 0 ? '直飞' : `经停`}
            </div>
          </div>

          {/* 到达 */}
          <div className="text-center w-20">
            <div className="text-xl font-bold text-slate-800">{arrivalTime}</div>
            <div className="text-sm text-slate-500">{destCode}</div>
          </div>
        </div>

        {/* 右侧：价格与操作 */}
        <div className="flex items-center justify-between lg:justify-end gap-3 lg:w-80">
          <div className="text-right">
            {/* AI价格趋势标签 */}
            <div className="mb-1">
              <PriceTrendBadge trend={trend} />
            </div>
            <div className="flex items-baseline gap-2 justify-end">
              {loading ? (
                <span className="text-sm text-slate-400">加载中...</span>
              ) : (
                <>
                  <span className="text-2xl font-bold price-tag">¥{displayPrice}</span>
                  {displayOriginalPrice > displayPrice && (
                    <span className="text-sm text-slate-400 line-through">¥{displayOriginalPrice}</span>
                  )}
                </>
              )}
            </div>
            <div className="text-xs text-slate-400">含税总价</div>
            {!loading && minPrice && (
              <div className="text-xs text-green-600 flex items-center justify-end gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                全网最低价
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
            <Button 
              variant="outline"
              onClick={() => onOpenChat?.(flight)}
              className="rounded-xl border-sky-100 bg-white px-4 text-[#0088DD] hover:bg-sky-50"
            >
              <MessageCircle className="mr-1 h-4 w-4" />
              同航班
            </Button>
            <Button 
              onClick={() => onViewDetails?.(flight)}
              className="btn-primary-gradient rounded-xl px-5"
            >
              查看详情
            </Button>
          </div>
        </div>
      </div>

      {/* 底部：额外信息 */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <Luggage className="w-3.5 h-3.5" />
          <span>托运行李 {baggage}</span>
        </div>
        <div className="flex items-center gap-1">
          <Info className="w-3.5 h-3.5" />
          <span>可改签</span>
        </div>
        <div className="ml-auto flex items-center gap-1 text-[#00A5FF] font-medium">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>学生认证再减¥50</span>
        </div>
      </div>
    </motion.div>
  );
};

export default FlightCard;
