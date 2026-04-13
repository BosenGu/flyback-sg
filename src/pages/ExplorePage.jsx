import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, GraduationCap, Calendar, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { MOCK_FLIGHTS } from '@/data/flights';
import { format, addDays } from 'date-fns';

// 城市渐变色配置 - 现代感高级 CSS 渐变色
const CITY_GRADIENTS = {
  '北京': 'from-amber-600 via-orange-500 to-red-600',
  '上海': 'from-blue-600 via-cyan-500 to-blue-700',
  '广州': 'from-emerald-500 via-teal-500 to-cyan-600',
  '深圳': 'from-indigo-600 via-purple-500 to-pink-600',
  '成都': 'from-orange-500 via-red-500 to-rose-600',
  '西安': 'from-rose-600 via-pink-500 to-purple-600',
  '杭州': 'from-green-500 via-emerald-500 to-teal-600',
  '厦门': 'from-sky-500 via-blue-500 to-indigo-600',
  '昆明': 'from-lime-500 via-green-500 to-emerald-600',
  '海口': 'from-cyan-500 via-blue-500 to-blue-600',
  '香港': 'from-violet-600 via-purple-500 to-fuchsia-600',
};

const DEFAULT_GRADIENT = 'from-slate-600 via-slate-500 to-slate-700';

// 中国境内城市列表（用于过滤）
const CHINA_CITIES = [
  '北京', '上海', '广州', '深圳', '成都', '杭州', '武汉', '西安', 
  '重庆', '南京', '天津', '苏州', '长沙', '郑州', '青岛', '大连', 
  '厦门', '昆明', '海口', '三亚', '香港', '澳门'
];

const ExplorePage = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChinaFlights();
  }, []);

  const fetchChinaFlights = async () => {
    setLoading(true);
    if (!supabase) {
      setFlights(getMockFlights());
      setLoading(false);
      return;
    }

    try {
      // 从 Flights 表获取数据，按价格排序
      const { data, error } = await supabase
        .from('flights')
        .select('*')
        .eq('departure_city', '新加坡')
        .order('base_price', { ascending: true });

      if (error) {
        console.error('获取航班数据失败:', error);
        setError('数据加载失败，请稍后重试');
        setFlights(getMockFlights());
      } else if (data && data.length > 0) {
        // 过滤只显示中国境内的到达城市
        const chinaFlights = data.filter(flight => 
          CHINA_CITIES.includes(flight.arrival_city)
        );
        setFlights(chinaFlights);
      } else {
        setFlights(getMockFlights());
      }
    } catch (err) {
      console.error('查询失败:', err);
      setFlights(getMockFlights());
    } finally {
      setLoading(false);
    }
  };

  // 模拟数据（当数据库无数据时使用）
  const getMockFlights = () => MOCK_FLIGHTS.map((flight) => ({
    id: flight.id,
    flight_number: flight.flightNo,
    airline: flight.airline,
    arrival_city: flight.arrivalCity,
    arrival_code: flight.destCode,
    base_price: flight.price,
    flight_date: flight.date,
    city_description: flight.sourceNote,
  }));

  const handleBack = () => {
    window.location.href = '/#/';
  };

  const handleFlightClick = (flight) => {
    // 携带目的地和日期参数跳转到首页，并自动触发搜索
    const dateStr = flight.flight_date || format(addDays(new Date(), 7), 'yyyy-MM-dd');
    const params = new URLSearchParams({
      city: flight.arrival_city,
      date: dateStr,
      price: flight.base_price.toString()
    });
    
    // 使用HashRouter格式的URL
    window.location.href = `/#/?${params.toString()}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '2月15日';
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  // 获取城市渐变色
  const getCityGradient = (city) => {
    return CITY_GRADIENTS[city] || DEFAULT_GRADIENT;
  };

  return (
    <div className="min-h-screen bg-travel-page">
      {/* 顶部导航栏 */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-slate-600 hover:text-slate-800"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            返回
          </Button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FF8A2C]" />
            <h1 className="font-bold text-slate-800">探索低价回国目的地</h1>
          </div>
          <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-[#00A5FF]/10 rounded-full">
            <GraduationCap className="w-4 h-4 text-[#00A5FF]" />
            <span className="text-xs text-[#00A5FF] font-medium">留学生专属</span>
          </div>
        </div>
      </nav>

      {/* 页面内容 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 标题区 */}
        <div className="text-center mb-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold text-slate-800 mb-2"
          >
            从新加坡出发，超值回国航线
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500"
          >
            精选 <span className="text-[#00A5FF] font-bold">{flights.length}</span> 条低价航线，省下的钱够吃十顿火锅 🍲
          </motion.p>
        </div>

        {/* 加载状态 */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00A5FF]" />
          </div>
        )}

        {/* 错误状态 */}
        {!loading && error && (
          <div className="text-center py-12 text-slate-500">
            <p>{error}</p>
            <Button 
              onClick={fetchChinaFlights} 
              className="mt-4 btn-primary-gradient"
            >
              重新加载
            </Button>
          </div>
        )}

        {/* 卡片流 - CSS 渐变色版本 */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flights.map((flight, index) => (
              <motion.div
                key={flight.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                onClick={() => handleFlightClick(flight)}
                className="group relative h-80 overflow-hidden rounded-3xl border border-white/50 shadow-xl shadow-sky-200/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-300/50"
              >
                {/* CSS 渐变背景 - 替代图片 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getCityGradient(flight.arrival_city)}`}>
                  {/* 装饰性图案 */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/3" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/3 -translate-x-1/3" />
                    <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  {/* 网格纹理 */}
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                  }} />
                </div>

                {/* 价格标签 */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                  <span className="text-sm text-slate-500">¥</span>
                  <span className="text-2xl font-bold text-[#FF6B00]">{flight.base_price}</span>
                  <span className="text-sm text-slate-500 ml-1">起</span>
                </div>

                {/* 日期标签 */}
                <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-white" />
                  <span className="text-xs text-white font-medium">{formatDate(flight.flight_date)}</span>
                </div>

                {/* 中央大排版 - 城市名称 */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    className="mb-4"
                  >
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white/90 font-medium">
                      {flight.arrival_code}
                    </span>
                  </motion.div>
                  <h3 className="text-5xl md:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-lg group-hover:scale-105 transition-transform duration-300">
                    {flight.arrival_city}
                  </h3>
                  <p className="text-white/80 text-sm max-w-[200px] leading-relaxed">
                    {flight.city_description || '探索这座美丽城市的独特魅力'}
                  </p>
                </div>

                {/* 底部信息 */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/40 to-transparent">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white flex items-center gap-1.5">
                        <Plane className="w-3 h-3" />
                        {flight.airline}
                      </span>
                    </div>
                    <motion.span 
                      className="px-4 py-2 bg-white text-slate-800 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg group-hover:bg-[#00FF41] group-hover:text-slate-900 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      立即搜索
                      <span className="text-lg">→</span>
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* 空状态 */}
        {!loading && !error && flights.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛫</div>
            <h3 className="text-lg font-medium text-slate-700 mb-2">暂无航班数据</h3>
            <p className="text-slate-500 mb-4">请稍后重试或返回首页搜索</p>
            <Button onClick={handleBack} className="btn-primary-gradient">
              返回首页
            </Button>
          </div>
        )}

        {/* 提示信息 */}
        <div className="mt-8 p-4 bg-gradient-to-r from-[#00A5FF]/10 to-[#FF8A2C]/10 rounded-xl border border-[#00A5FF]/20">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <GraduationCap className="w-5 h-5 text-[#00A5FF]" />
            <span>💡 提示：点击任意卡片即可跳转到该日期、该目的地的具体航班搜索结果页</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
