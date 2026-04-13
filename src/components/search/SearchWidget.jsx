import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, ArrowRightLeft, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button';
import { format, addDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { toast } from 'sonner';

// 8个热门城市
const HOT_CITIES = ['北京', '上海', '广州', '深圳', '成都', '西安', '杭州', '厦门'];

const SearchWidget = ({ onSearch, initialDestination = '', initialDate = null }) => {
  const [origin, setOrigin] = useState('新加坡');
  const [originCode, setOriginCode] = useState('SIN');
  const [destination, setDestination] = useState(initialDestination || '');
  
  // 使用原生日期输入格式 (YYYY-MM-DD)
  const [departDate, setDepartDate] = useState(
    initialDate 
      ? format(new Date(initialDate), 'yyyy-MM-dd')
      : format(addDays(new Date(), 7), 'yyyy-MM-dd')
  );

  // 当初始值变化时更新
  useEffect(() => {
    if (initialDestination) {
      setDestination(initialDestination);
    }
    if (initialDate) {
      setDepartDate(format(new Date(initialDate), 'yyyy-MM-dd'));
    }
  }, [initialDestination, initialDate]);

  const handleSwapLocations = () => {
    const tempOrigin = origin;
    const tempOriginCode = originCode;
    setOrigin(destination || '选择目的地');
    setOriginCode(destination ? destination.substring(0, 3).toUpperCase() : 'DST');
    setDestination(tempOrigin === '新加坡' ? '' : tempOrigin);
  };

  const handleCitySelect = (city) => {
    setDestination(city);
    // 立即触发搜索
    setTimeout(() => {
      onSearch?.({
        origin,
        originCode,
        destination: city,
        departDate: new Date(departDate),
      });
    }, 100);
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    if (selectedDate) {
      setDepartDate(selectedDate);
    }
  };

  const handleSearch = () => {
    if (!destination) {
      toast.info('请先选择目的地', { description: '请从下拉列表中选择目的地' });
      return;
    }
    onSearch?.({
      origin,
      originCode,
      destination,
      departDate: new Date(departDate),
    });
  };

  // 格式化日期显示
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return format(date, 'yyyy年MM月dd日', { locale: zhCN });
  };

  return (
    <div className="w-full max-w-5xl mx-auto relative">
      {/* 搜索表单卡片 */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-300/50 p-6 md:p-8 border border-white/60 relative"
      >
        {/* 搜索表单 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* 出发地 - 固定为新加坡 */}
          <div className="md:col-span-3 relative">
            <label className="block text-xs font-medium text-slate-500 mb-1.5 ml-1 flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[8px] text-white">SIN</span>
              出发地
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={`${origin} (${originCode})`}
                readOnly
                className="w-full pl-9 pr-3 h-12 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium cursor-not-allowed outline-none"
              />
            </div>
          </div>

          {/* 交换按钮 */}
          <div className="md:col-span-1 flex justify-center md:pb-1">
            <button
              onClick={handleSwapLocations}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors group"
            >
              <ArrowRightLeft className="w-4 h-4 text-slate-400 group-hover:text-[#00A5FF] transition-colors" />
            </button>
          </div>

          {/* 目的地 - 原生下拉选择器 */}
          <div className="md:col-span-3 relative">
            <label className="block text-xs font-medium text-slate-500 mb-1.5 ml-1">目的地</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
              <select
                value={destination}
                onChange={(e) => handleCitySelect(e.target.value)}
                className={`w-full pl-9 pr-8 h-12 rounded-xl font-medium outline-none appearance-none cursor-pointer border ${destination ? 'bg-[#00A5FF]/10 border-[#00A5FF] text-slate-800' : 'bg-white border-slate-200 text-slate-500'} focus:ring-2 focus:ring-[#00A5FF] focus:border-[#00A5FF]`}
                style={{ 
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center'
                }}
              >
                <option value="">请选择目的地</option>
                {HOT_CITIES.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 日期选择器 - 原生 HTML5 Date Input */}
          <div className="md:col-span-3 relative">
            <label className="block text-xs font-medium text-slate-500 mb-1.5 ml-1">
              出发日期
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
              <input
                type="date"
                value={departDate}
                onChange={handleDateChange}
                min={format(new Date(), 'yyyy-MM-dd')}
                max={format(addDays(new Date(), 365), 'yyyy-MM-dd')}
                className="w-full pl-9 pr-3 h-12 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-[#00A5FF] focus:border-[#00A5FF] cursor-pointer"
                style={{
                  // 隐藏原生日期选择器的默认图标，使用自定义图标
                  WebkitAppearance: 'none',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  backgroundColor: 'white'
                }}
              />
            </div>
            {/* 显示格式化的日期文本 */}
            <div className="mt-1 text-xs text-slate-500 ml-1">
              {formatDisplayDate(departDate)}
            </div>
          </div>

          {/* 搜索按钮 */}
          <div className="md:col-span-2">
            <Button 
              onClick={handleSearch}
              className="w-full h-12 btn-primary-gradient rounded-xl font-semibold text-base"
            >
              <Search className="w-5 h-5 md:mr-2" />
              <span className="hidden md:inline">搜索</span>
            </Button>
          </div>
        </div>

        {/* 平铺式城市胶囊选择区 */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex flex-col gap-3">
            {/* 提示文字 */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">热门目的地：</span>
              <span className="text-xs text-slate-400">点击城市立即筛选航班</span>
            </div>
            
            {/* 城市胶囊组 */}
            <div className="flex items-center gap-2 flex-wrap">
              {HOT_CITIES.map((city) => (
                <button
                  key={city}
                  onClick={() => handleCitySelect(city)}
                  className={`
                    px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200
                    ${destination === city 
                      ? 'bg-[#00A5FF] text-white shadow-lg shadow-blue-500/25' 
                      : 'bg-[#F5F7FA] text-slate-700 hover:bg-[#00A5FF] hover:text-white'
                    }
                  `}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SearchWidget;
