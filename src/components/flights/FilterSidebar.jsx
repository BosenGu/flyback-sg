import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, ChevronDown, ChevronUp, Plane, Clock, DollarSign } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
const FilterSidebar = ({ onFilterChange, filters = {} }) => {
  const [expanded, setExpanded] = useState({
    stops: true,
    price: true,
    airlines: true,
    time: false
  });
  
  // 本地状态，用于即时响应用户操作
  const [localFilters, setLocalFilters] = useState({
    stops: filters.stops || ['direct'],
    minPrice: filters.minPrice || 500,
    maxPrice: filters.maxPrice || 5000,
    airlines: filters.airlines || [],
    departureTime: filters.departureTime || []
  });

  // 防抖定时器
  const debounceTimerRef = useRef(null);

  // 同步父组件传入的 filters - 添加深度比较避免不必要的更新
  useEffect(() => {
    const hasChanged = 
      JSON.stringify(filters.stops) !== JSON.stringify(localFilters.stops) ||
      filters.minPrice !== localFilters.minPrice ||
      filters.maxPrice !== localFilters.maxPrice ||
      JSON.stringify(filters.airlines) !== JSON.stringify(localFilters.airlines) ||
      JSON.stringify(filters.departureTime) !== JSON.stringify(localFilters.departureTime);
    
    if (hasChanged) {
      setLocalFilters({
        stops: filters.stops || ['direct'],
        minPrice: filters.minPrice || 500,
        maxPrice: filters.maxPrice || 5000,
        airlines: filters.airlines || [],
        departureTime: filters.departureTime || []
      });
    }
  }, [filters]);

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const toggleSection = (section) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const airlines = [
    { id: 'scoot', name: '酷航', count: 15 },
    { id: 'singapore', name: '新加坡航空', count: 15 },
    { id: 'airchina', name: '国航', count: 15 },
    { id: 'chinaeastern', name: '东航', count: 15 },
    { id: 'chinacs', name: '南航', count: 15 },
    { id: 'xiamenair', name: '厦航', count: 8 },
    { id: 'shenzhenair', name: '深航', count: 6 },
    { id: 'cathay', name: '国泰', count: 9 },
    { id: 'juneyao', name: '吉祥航空', count: 15 }
  ];

  const handleStopsChange = (stop) => {
    setLocalFilters(prev => {
      const newStops = prev.stops.includes(stop) 
        ? prev.stops.filter(s => s !== stop)
        : [...prev.stops, stop];
      
      const newFilters = { ...prev, stops: newStops };
      onFilterChange?.(newFilters);
      return newFilters;
    });
  };

  const handleMinPriceChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setLocalFilters(prev => {
      const newMin = Math.min(value, prev.maxPrice - 100);
      const newFilters = { ...prev, minPrice: newMin };
      
      // 清除之前的定时器
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      // 延迟 300ms 后再通知父组件
      debounceTimerRef.current = setTimeout(() => {
        onFilterChange?.(newFilters);
      }, 300);
      
      return newFilters;
    });
  };

  const handleMaxPriceChange = (e) => {
    const value = parseInt(e.target.value) || 5000;
    setLocalFilters(prev => {
      const newMax = Math.max(value, prev.minPrice + 100);
      const newFilters = { ...prev, maxPrice: newMax };
      
      // 清除之前的定时器
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      // 延迟 300ms 后再通知父组件
      debounceTimerRef.current = setTimeout(() => {
        onFilterChange?.(newFilters);
      }, 300);
      
      return newFilters;
    });
  };

  const handleAirlineChange = (airlineId) => {
    setLocalFilters(prev => {
      const newAirlines = prev.airlines.includes(airlineId)
        ? prev.airlines.filter(a => a !== airlineId)
        : [...prev.airlines, airlineId];
      
      const newFilters = { ...prev, airlines: newAirlines };
      onFilterChange?.(newFilters);
      return newFilters;
    });
  };

  const handleTimeChange = (time) => {
    setLocalFilters(prev => {
      const newTimes = prev.departureTime.includes(time)
        ? prev.departureTime.filter(t => t !== time)
        : [...prev.departureTime, time];
      
      const newFilters = { ...prev, departureTime: newTimes };
      onFilterChange?.(newFilters);
      return newFilters;
    });
  };

  const handleReset = () => {
    const resetFilters = {
      stops: ['direct', 'one'],
      minPrice: 500,
      maxPrice: 5000,
      airlines: [],
      departureTime: []
    };
    setLocalFilters(resetFilters);
    onFilterChange?.(resetFilters);
  };

  return (
    <div className="filter-sidebar space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          筛选条件
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs text-[#00A5FF] h-8"
          onClick={handleReset}
        >
          重置
        </Button>
      </div>

      {/* 转机次数 */}
      <div className="border-b border-slate-100 pb-4">
        <button 
          onClick={() => toggleSection('stops')}
          className="w-full flex items-center justify-between py-2 text-sm font-medium text-slate-700"
        >
          <span className="flex items-center gap-2">
            <Plane className="w-4 h-4 text-slate-400" />
            转机次数
          </span>
          {expanded.stops ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {expanded.stops && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="space-y-2 mt-2"
          >
            {[
              { id: 'direct', label: '直飞', count: 288 },
              { id: 'one', label: '转机1次', count: 48 },
              { id: 'two', label: '转机2次+', count: 0 }
            ].map((stop) => (
              <label key={stop.id} className="flex items-center justify-between py-1 cursor-pointer group">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={localFilters.stops.includes(stop.id)}
                    onCheckedChange={() => handleStopsChange(stop.id)}
                    className="border-slate-300 data-[state=checked]:bg-[#00A5FF] data-[state=checked]:border-[#00A5FF]"
                  />
                  <span className="text-sm text-slate-600 group-hover:text-slate-800">{stop.label}</span>
                </div>
                <span className="text-xs text-slate-400">{stop.count}</span>
              </label>
            ))}
          </motion.div>
        )}
      </div>

      {/* 价格范围 - 双向滑块 */}
      <div className="border-b border-slate-100 pb-4">
        <button 
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between py-2 text-sm font-medium text-slate-700"
        >
          <span className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-slate-400" />
            价格范围
          </span>
          {expanded.price ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {expanded.price && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mt-3 px-1"
          >
            {/* 双向范围滑块 - 使用原生 input range */}
            <div className="relative h-6 mb-4">
              <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-slate-200 rounded-full -translate-y-1/2" />
              <div 
                className="absolute top-1/2 h-1.5 bg-[#00A5FF] rounded-full -translate-y-1/2"
                style={{
                  left: `${(localFilters.minPrice / 5000) * 100}%`,
                  right: `${100 - (localFilters.maxPrice / 5000) * 100}%`
                }}
              />
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={localFilters.minPrice}
                onChange={handleMinPriceChange}
                className="absolute top-1/2 -translate-y-1/2 w-full h-6 opacity-0 cursor-pointer"
                style={{ zIndex: 2 }}
              />
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={localFilters.maxPrice}
                onChange={handleMaxPriceChange}
                className="absolute top-1/2 -translate-y-1/2 w-full h-6 opacity-0 cursor-pointer"
                style={{ zIndex: 3 }}
              />
              {/* 滑块按钮 */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-[#00A5FF] rounded-full shadow-md pointer-events-none"
                style={{ left: `calc(${(localFilters.minPrice / 5000) * 100}% - 10px)` }}
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-[#00A5FF] rounded-full shadow-md pointer-events-none"
                style={{ left: `calc(${(localFilters.maxPrice / 5000) * 100}% - 10px)` }}
              />
            </div>
            
            {/* 价格输入框 */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  value={localFilters.minPrice}
                  onChange={handleMinPriceChange}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A5FF] focus:border-transparent"
                  placeholder="最低"
                />
              </div>
              <span className="text-slate-400">-</span>
              <div className="flex-1">
                <input
                  type="number"
                  value={localFilters.maxPrice}
                  onChange={handleMaxPriceChange}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A5FF] focus:border-transparent"
                  placeholder="最高"
                />
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              <span>¥{localFilters.minPrice}</span>
              <span>¥{localFilters.maxPrice}</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* 航司选择 */}
      <div className="border-b border-slate-100 pb-4">
        <button 
          onClick={() => toggleSection('airlines')}
          className="w-full flex items-center justify-between py-2 text-sm font-medium text-slate-700"
        >
          <span className="flex items-center gap-2">
            <Plane className="w-4 h-4 text-slate-400" />
            航空公司
          </span>
          {expanded.airlines ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {expanded.airlines && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="space-y-2 mt-2"
          >
            {airlines.map((airline) => (
              <label key={airline.id} className="flex items-center justify-between py-1 cursor-pointer group">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={localFilters.airlines.includes(airline.id)}
                    onCheckedChange={() => handleAirlineChange(airline.id)}
                    className="border-slate-300 data-[state=checked]:bg-[#00A5FF] data-[state=checked]:border-[#00A5FF]"
                  />
                  <span className="text-sm text-slate-600 group-hover:text-slate-800">{airline.name}</span>
                </div>
                <span className="text-xs text-slate-400">~{airline.count}</span>
              </label>
            ))}
          </motion.div>
        )}
      </div>

      {/* 出发时间 */}
      <div>
        <button 
          onClick={() => toggleSection('time')}
          className="w-full flex items-center justify-between py-2 text-sm font-medium text-slate-700"
        >
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            出发时间
          </span>
          {expanded.time ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {expanded.time && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="space-y-2 mt-2"
          >
            {[
              { id: 'morning', label: '凌晨 (00:00-06:00)' },
              { id: 'forenoon', label: '上午 (06:00-12:00)' },
              { id: 'afternoon', label: '下午 (12:00-18:00)' },
              { id: 'evening', label: '晚上 (18:00-24:00)' }
            ].map((time) => (
              <label key={time.id} className="flex items-center gap-2 py-1 cursor-pointer">
                <Checkbox 
                  checked={localFilters.departureTime.includes(time.id)}
                  onCheckedChange={() => handleTimeChange(time.id)}
                  className="border-slate-300 data-[state=checked]:bg-[#00A5FF] data-[state=checked]:border-[#00A5FF]"
                />
                <span className="text-sm text-slate-600">{time.label}</span>
              </label>
            ))}
          </motion.div>
        )}
      </div>

      {/* 应用筛选按钮（移动端可见） */}
      <div className="lg:hidden pt-4 border-t border-slate-100">
        <Button 
          className="w-full btn-primary-gradient"
          onClick={() => onFilterChange?.(localFilters)}
        >
          应用筛选
        </Button>
      </div>
    </div>
  );
};

export default FilterSidebar;
