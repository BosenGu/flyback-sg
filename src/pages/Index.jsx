import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, MapPin, ArrowUpDown, Sparkles, GraduationCap, Users, Heart, Clock, Trash2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import SearchWidget from '@/components/search/SearchWidget';
import FlightCard from '@/components/flights/FlightCard';
import FilterSidebar from '@/components/flights/FilterSidebar';
import BookingModal from '@/components/flights/BookingModal';
import FlightChatDrawer from '@/components/flights/FlightChatDrawer';
import PriceAlert from '@/components/flights/PriceAlert';
import { supabase } from '@/integrations/supabase/client';
import { AIRLINE_MAP, CITY_CODE_MAP, MOCK_FLIGHTS } from '@/data/flights';

const RECENT_SEARCHES = [
  { id: 1, from: '新加坡', to: '成都', date: '2026-05-30' },
  { id: 2, from: '新加坡', to: '上海', date: '2026-06-15' },
];

const getFlightsByDestination = (flights, destination) => {
  if (!destination) return [...flights];
  const targetCode = CITY_CODE_MAP[destination];
  return flights.filter(f => f.destCode === targetCode || f.arrivalCity === destination);
};

const formatRecentDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

const Index = () => {
  const [hasSearched, setHasSearched] = useState(false);
  const [allFlights, setAllFlights] = useState(MOCK_FLIGHTS);
  const [filteredFlights, setFilteredFlights] = useState(MOCK_FLIGHTS);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [chatFlight, setChatFlight] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [sortBy, setSortBy] = useState('price');
  const [otaPrices, setOtaPrices] = useState([]);
  const [currentDestination, setCurrentDestination] = useState('');
  const [currentTripType, setCurrentTripType] = useState('oneway');
  const [isInboundToSingapore, setIsInboundToSingapore] = useState(false);
  
  // 分页相关状态
  const [displayCount, setDisplayCount] = useState(10);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const [filters, setFilters] = useState({
    stops: ['direct', 'one'],
    minPrice: 500,
    maxPrice: 5000,
    airlines: [],
    departureTime: []
  });

  const recentSearches = useMemo(() => {
    return RECENT_SEARCHES.map((search) => {
      const destinationFlights = getFlightsByDestination(allFlights, search.to);
      const lowestPrice = destinationFlights.length
        ? Math.min(...destinationFlights.map((flight) => flight.price))
        : null;

      return {
        ...search,
        displayDate: formatRecentDate(search.date),
        price: lowestPrice ? `¥${lowestPrice}` : '暂无',
      };
    });
  }, [allFlights]);

  const flightsForCounts = useMemo(() => {
    let result = getFlightsByDestination(allFlights, currentDestination);

    if (filters.stops && filters.stops.length > 0) {
      result = result.filter(f => {
        if (filters.stops.includes('direct') && f.stops === 0) return true;
        if (filters.stops.includes('one') && f.stops === 1) return true;
        if (filters.stops.includes('two') && f.stops >= 2) return true;
        return false;
      });
    }

    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      result = result.filter(f => f.price >= filters.minPrice && f.price <= filters.maxPrice);
    }

    if (filters.departureTime && filters.departureTime.length > 0) {
      result = result.filter(f => {
        const hour = f.departureHour;
        return filters.departureTime.some(time => {
          if (time === 'morning') return hour >= 0 && hour < 6;
          if (time === 'forenoon') return hour >= 6 && hour < 12;
          if (time === 'afternoon') return hour >= 12 && hour < 18;
          if (time === 'evening') return hour >= 18 && hour < 24;
          return false;
        });
      });
    }

    return result;
  }, [allFlights, currentDestination, filters.departureTime, filters.maxPrice, filters.minPrice, filters.stops]);

  // 从数据库加载真实航班数据
  useEffect(() => {
    loadRealFlights();
  }, []);

  const loadRealFlights = async () => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('flights')
        .select('*')
        .eq('departure_city', '新加坡');
      
      if (error) {
        console.error('加载航班数据失败:', error);
        return;
      }
      
      if (data && data.length > 0) {
        // 转换为前端需要的格式
        const formattedFlights = data.map(f => ({
          id: f.id,
          airline: f.airline,
          flightNo: f.flight_number,
          departureTime: f.departure_time?.substring(0, 5) || '08:00',
          arrivalTime: f.arrival_time?.substring(0, 5) || '14:00',
          originCode: f.departure_code || 'SIN',
          destCode: f.arrival_code || 'PEK',
          duration: `${Math.floor(f.duration_minutes / 60)}h ${f.duration_minutes % 60}m`,
          durationMinutes: f.duration_minutes,
          stops: f.stops || 0,
          isDirect: f.is_direct,
          price: f.base_price,
          originalPrice: f.original_price,
          trend: f.price_trend || 'stable',
          baggage: f.baggage_allowance || '20kg',
          departureHour: parseInt(f.departure_time?.substring(0, 2) || 8),
          arrivalCity: f.arrival_city
        }));
        const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
        const city = params.get('city');
        const targetCode = CITY_CODE_MAP[city];
        const initialFlights = city
          ? formattedFlights.filter(f => f.destCode === targetCode || f.arrivalCity === city)
          : formattedFlights;

        setAllFlights(formattedFlights);
        setFilteredFlights(initialFlights);
      }
    } catch (err) {
      console.error('查询失败:', err);
    }
  };

  // 实时筛选逻辑
  useEffect(() => {
    let result = [...allFlights];

    if (currentDestination) {
      const targetCode = CITY_CODE_MAP[currentDestination];
      result = result.filter(f =>
        f.destCode === targetCode || f.arrivalCity === currentDestination
      );
    }

    if (filters.stops && filters.stops.length > 0) {
      result = result.filter(f => {
        if (filters.stops.includes('direct') && f.stops === 0) return true;
        if (filters.stops.includes('one') && f.stops === 1) return true;
        if (filters.stops.includes('two') && f.stops >= 2) return true;
        return false;
      });
    }

    // 使用 minPrice 和 maxPrice 进行筛选
    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      result = result.filter(f => 
        f.price >= filters.minPrice && f.price <= filters.maxPrice
      );
    }

    if (filters.airlines && filters.airlines.length > 0) {
      result = result.filter(f => {
        const airlineId = AIRLINE_MAP[f.airline];
        return filters.airlines.includes(airlineId);
      });
    }

    if (filters.departureTime && filters.departureTime.length > 0) {
      result = result.filter(f => {
        const hour = f.departureHour;
        return filters.departureTime.some(time => {
          if (time === 'morning') return hour >= 0 && hour < 6;
          if (time === 'forenoon') return hour >= 6 && hour < 12;
          if (time === 'afternoon') return hour >= 12 && hour < 18;
          if (time === 'evening') return hour >= 18 && hour < 24;
          return false;
        });
      });
    }

    result = sortFlights(result, sortBy);
    setFilteredFlights(result);
    // 重置显示数量
    setDisplayCount(10);
  }, [filters, allFlights, sortBy, currentDestination]);

  const sortFlights = (flights, type) => {
    const sorted = [...flights];
    switch (type) {
      case 'price':
        return sorted.sort((a, b) => a.price - b.price);
      case 'duration':
        return sorted.sort((a, b) => a.durationMinutes - b.durationMinutes);
      case 'departure':
        return sorted.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
      default:
        return sorted;
    }
  };

  const handleSearch = async (searchParams) => {
    setHasSearched(true);
    setCurrentDestination(searchParams.destination);
    setCurrentTripType(searchParams.tripType || 'oneway');
    setIsInboundToSingapore(Boolean(searchParams.isInboundToSingapore));
    setDisplayCount(10); // 重置显示数量
    
    const filtered = getFlightsByDestination(allFlights, searchParams.destination);
    
    setFilteredFlights(filtered);
  };

  useEffect(() => {
    const queryString = window.location.hash.split('?')[1];
    if (!queryString) return;

    const params = new URLSearchParams(queryString);
    const city = params.get('city');
    if (!city) return;

    setCurrentDestination(city);
    handleSearch({
      origin: '新加坡',
      originCode: 'SIN',
      destination: city,
      departDate: params.get('date') ? new Date(params.get('date')) : new Date(),
      tripType: 'oneway',
      returnDate: null,
      isInboundToSingapore: false,
    });
  }, []);

  const handleViewDetails = async (flight) => {
    setSelectedFlight(flight);

    if (!supabase) {
      setOtaPrices([]);
      setBookingModalOpen(true);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('ota_prices')
        .select('*')
        .eq('flight_id', flight.id);
      
      if (error) {
        console.error('获取 OTA 价格失败:', error);
        setOtaPrices([]);
      } else if (data && data.length > 0) {
        setOtaPrices(data);
      } else {
        setOtaPrices([]);
      }
    } catch (err) {
      console.error('查询失败:', err);
      setOtaPrices([]);
    }
    
    setBookingModalOpen(true);
  };

  const handleSort = (type) => {
    setSortBy(type);
    const sorted = sortFlights(filteredFlights, type);
    setFilteredFlights(sorted);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const clearRecentSearch = (e, id) => {
    e.stopPropagation();
    toast.success('已删除搜索记录');
  };

  const handleRecentSearchClick = (search) => {
    setCurrentDestination(search.to);
    handleSearch({
      origin: '新加坡',
      originCode: 'SIN',
      destination: search.to,
      departDate: new Date(search.date),
      tripType: 'oneway',
      returnDate: null,
      isInboundToSingapore: false,
    });
  };

  // 加载更多航班
  const handleLoadMore = async () => {
    if (displayCount >= filteredFlights.length) {
      toast.info('已显示所有航班');
      return;
    }
    
    setIsLoadingMore(true);
    
    // 模拟加载延迟，提升用户体验
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setDisplayCount(prev => Math.min(prev + 10, filteredFlights.length));
    setIsLoadingMore(false);
  };

  // 当前显示的航班列表
  const displayedFlights = filteredFlights.slice(0, displayCount);
  const hasMoreFlights = displayCount < filteredFlights.length;

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      {/* 顶部Hero区域 - 新加坡留学主题 */}
      <div className="relative">
        {/* 狮城航拍背景 */}
        <div className="absolute inset-0 h-[680px]">
          <img 
            src="https://nocode.meituan.com/photo/search?keyword=singapore,marina,bay,skyline,aerial&width=1920&height=800"
            alt="Singapore Skyline"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-[#F0F7FF]" />
        </div>

        {/* 导航栏 */}
        <nav className="relative z-10 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">FlyBack SG</h1>
                <p className="text-xs text-white/70 flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" />
                  新加坡留学生专属
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                className="text-white/90 hover:text-white hover:bg-white/10"
                onClick={() => {
                  window.location.hash = '/explore';
                }}
              >
                <MapPin className="w-4 h-4 mr-1" />
                低价地图
              </Button>
              <Button 
                variant="ghost" 
                className="text-white/90 hover:text-white hover:bg-white/10"
                onClick={() => {
                  window.location.hash = '/community';
                }}
              >
                <Users className="w-4 h-4 mr-1" />
                社群
              </Button>
              <Button 
                className="bg-white text-[#00A5FF] hover:bg-white/90 font-medium"
                onClick={() => toast.info('登录/注册功能正在内测中', { description: '留学生专属账户系统即将上线，敬请期待！' })}
              >
                登录 / 注册
              </Button>
            </div>
          </div>
        </nav>

        {/* 搜索区域 */}
        <div className="relative z-10 px-6 pt-8 pb-16">
          <div className="max-w-5xl mx-auto text-center mb-8">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-white mb-3"
            >
              FlyBack SG：从 SIN 到家
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/90 text-lg flex items-center justify-center gap-2 flex-wrap"
            >
              <span>省下的机票钱够吃</span>
              <span className="text-[#FF8A2C] font-bold text-2xl">十顿火锅</span>
              <span>🍲</span>
            </motion.p>
          </div>
          
          <SearchWidget 
            onSearch={handleSearch} 
            initialDestination={currentDestination}
          />
        </div>
      </div>

      {/* 主页核心功能区 - 仅在未搜索时显示 */}
      {!hasSearched && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 -mt-8 relative z-20"
        >
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-xl shadow-sky-200/50 border border-white/70">
              <div className="absolute right-0 top-0 h-40 w-40 translate-x-12 -translate-y-12 rounded-full bg-[#00A5FF]/15 blur-2xl" />
              <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-10 translate-y-10 rounded-full bg-[#FF8A2C]/15 blur-2xl" />
              <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-gradient-to-br from-[#00A5FF] to-[#0088DD] p-4 text-white shadow-lg shadow-sky-300/40">
                    <Users className="h-8 w-8" />
                  </div>
                  <div>
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-[#FF6B00]">
                      新加坡社群圈
                    </span>
                    <h3 className="mt-3 text-2xl font-black text-slate-900">找同航班同学，顺路拼车去机场</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                      按 NUS / NTU / SIM / SMU 等学校和航班方向聚合同路人，适合回国前拼车、到坡后落地同行。
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {['同航班聊天', '机场拼车', '学校生态圈', '到坡 Checklist'].map((tag) => (
                        <span key={tag} className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-[#0088DD]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <Button
                  className="btn-accent-gradient rounded-xl px-6 py-6 text-base font-bold"
                  onClick={() => {
                    window.location.hash = '/community';
                  }}
                >
                  进入生态圈
                </Button>
              </div>
            </div>

            {/* 最近搜索 */}
            <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#00A5FF]" />
                  最近搜索
                </h3>
              </div>
              <div className="space-y-3">
                {recentSearches.map((search) => (
                  <button
                    key={search.id}
                    onClick={() => handleRecentSearchClick(search)}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-[#00A5FF]/5 hover:ring-1 hover:ring-[#00A5FF] transition-all group text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#00A5FF]/10 flex items-center justify-center">
                        <Plane className="w-5 h-5 text-[#00A5FF]" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">
                          {search.from} <span className="text-slate-400 mx-1">→</span> {search.to}
                        </div>
                        <div className="text-sm text-slate-500">{search.displayDate}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-[#FF6B00]">{search.price}</span>
                      <button 
                        onClick={(e) => clearRecentSearch(e, search.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 为什么选择 FlyBack SG？ */}
            <div className="text-center mb-10 pt-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">为什么选择 FlyBack SG？</h3>
              <p className="text-slate-500">专为新加坡留学生打造的回国机票神器</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Sparkles, title: '低价与学生优惠', desc: '聚合 Trip.com、StudentUniverse、航司官网等渠道，价格为 demo 估算' },
                { icon: MapPin, title: '到坡前后提醒', desc: '覆盖入境文件、机场到校、SIM 卡、银行卡和校园报到清单' },
                { icon: ArrowUpDown, title: '同航班协同', desc: '围绕同一航班寻找同路人，支持聊天和拼车帖子 demo' }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-slate-200 text-center hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => toast.info(`${item.title}正在内测中`, { description: '留学生专属功能即将上线，敬请期待！' })}
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#00A5FF]/10 to-[#FF8A2C]/10 flex items-center justify-center">
                    <item.icon className="w-7 h-7 text-[#00A5FF]" />
                  </div>
                  <h4 className="font-bold text-slate-800 mb-2">{item.title}</h4>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid gap-6 pb-12 lg:grid-cols-2">
              {[
                {
                  label: '回国前',
                  title: '低价机票 + 同航班同行',
                  desc: '把价格、行李、学生优惠和去机场拼车放在一个流程里，适合假期回国和毕业返程。',
                  items: ['低价提醒', '行李额度', '学生优惠', '同航班聊天', '机场拼车'],
                },
                {
                  label: '到坡后',
                  title: '落地拼车 + 新生待办',
                  desc: '覆盖机场到学校、临时住宿、SIM 卡、银行卡和报到清单，帮新生快速落地。',
                  items: ['机场到校', 'IPA/STP 清单', 'SIM / 银行卡', '临时住宿', '校园报到'],
                },
              ].map((scene) => (
                <div key={scene.label} className="travel-card p-6 text-left">
                  <span className="rounded-full bg-[#00A5FF]/10 px-3 py-1 text-xs font-bold text-[#0088DD]">{scene.label}</span>
                  <h4 className="mt-4 text-xl font-bold text-slate-900">{scene.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{scene.desc}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {scene.items.map((item) => (
                      <span key={item} className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-[#FF6B00]">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* 搜索结果区域 */}
      <AnimatePresence>
        {hasSearched && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-6 pb-12 -mt-8 relative z-20"
          >
            <div className="max-w-7xl mx-auto">
              {/* 返回按钮 */}
              <div className="mb-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setHasSearched(false);
                    setCurrentDestination('');
                    setDisplayCount(10);
                  }}
                  className="bg-white"
                >
                  ← 返回搜索
                </Button>
              </div>

              <div className="flex flex-col lg:flex-row gap-6">
                {/* 左侧筛选栏 */}
                <div className="lg:w-64 flex-shrink-0">
                  <div className="sticky top-6">
                    <FilterSidebar
                      onFilterChange={handleFilterChange}
                      filters={filters}
                      flightsForCounts={flightsForCounts}
                    />
                  </div>
                </div>

                {/* 右侧结果列表 */}
                <div className="flex-1">
                  {/* 排序与统计 */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 flex items-center justify-between shadow-soft">
                    <div className="text-sm text-slate-600">
                      找到 <span className="font-bold text-slate-800">{filteredFlights.length}</span> 个{currentTripType === 'roundtrip' ? '往返参考' : '单程'}航班
                      {currentDestination && (
                        <span className="ml-2 text-[#00A5FF]">
                          {isInboundToSingapore ? `${currentDestination} → 新加坡` : `新加坡 → ${currentDestination}`}
                        </span>
                      )}
                      <span className="ml-2 text-slate-400">(显示 {displayedFlights.length} 个)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500 mr-2">排序：</span>
                      <Tabs value={sortBy} onValueChange={handleSort}>
                        <TabsList className="bg-slate-100">
                          <TabsTrigger value="price" className="text-xs data-[state=active]:bg-[#00A5FF] data-[state=active]:text-white">
                            价格
                          </TabsTrigger>
                          <TabsTrigger value="duration" className="text-xs data-[state=active]:bg-[#00A5FF] data-[state=active]:text-white">
                            时长
                          </TabsTrigger>
                          <TabsTrigger value="departure" className="text-xs data-[state=active]:bg-[#00A5FF] data-[state=active]:text-white">
                            出发时间
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </div>

                  {/* 留学生提示条 */}
                  <div className="bg-gradient-to-r from-[#00A5FF]/10 to-[#FF8A2C]/10 rounded-xl p-4 mb-4 border border-[#00A5FF]/20">
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <GraduationCap className="w-5 h-5 text-[#00A5FF]" />
                      <span>留学生专享：凭学生证在携程、StudentUniverse等平台享额外9折及+10kg行李额度</span>
                    </div>
                  </div>

                  {/* 航班列表 */}
                  {displayedFlights.length > 0 ? (
                    <div className="space-y-3">
                      {displayedFlights.map((flight, index) => (
                        <FlightCard 
                          key={flight.id}
                          flight={flight}
                          index={index}
                          onViewDetails={handleViewDetails}
                          onOpenChat={(targetFlight) => {
                            setChatFlight(targetFlight);
                            setChatOpen(true);
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-lg font-medium text-slate-700 mb-2">未找到符合条件的航班</h3>
                      <p className="text-sm text-slate-500">请尝试调整筛选条件或选择其他日期</p>
                    </div>
                  )}

                  {/* 加载更多 */}
                  {displayedFlights.length > 0 && hasMoreFlights && (
                    <div className="mt-6 text-center">
                      <Button 
                        variant="outline" 
                        className="px-8 border-slate-300 text-slate-600 hover:bg-slate-50"
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                      >
                        {isLoadingMore ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600 mr-2" />
                            加载中...
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4 mr-2" />
                            加载更多航班 (还剩 {filteredFlights.length - displayCount} 个)
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                  
                  {/* 已加载全部提示 */}
                  {displayedFlights.length > 0 && !hasMoreFlights && filteredFlights.length > 10 && (
                    <div className="mt-6 text-center text-sm text-slate-400">
                      已显示所有 {filteredFlights.length} 个航班
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 底部心愿单入口 */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => toast.info('心愿单功能正在内测中', { description: '收藏功能即将上线，敬请期待！' })}
          className="flex items-center gap-2 px-5 py-3 bg-white rounded-full shadow-xl shadow-slate-300/50 border border-slate-100 text-slate-700 font-medium hover:bg-slate-50 hover:shadow-2xl transition-all"
        >
          <Heart className="w-5 h-5 text-red-500" />
          心愿单
          <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
        </button>
      </div>

      {/* 预订模态框 */}
      <BookingModal
        flight={selectedFlight}
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        otaPricesData={otaPrices}
      />

      <FlightChatDrawer
        flight={chatFlight}
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
      />

      {/* 降价提醒 */}
      {hasSearched && <PriceAlert route="新加坡 → 中国" />}
    </div>
  );
};

export default Index;
