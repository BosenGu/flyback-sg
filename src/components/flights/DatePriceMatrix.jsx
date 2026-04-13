import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { format, addDays, startOfDay } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// 生成模拟价格数据
const generatePriceMatrix = (baseDate) => {
  const prices = [];
  const basePrice = 1200;
  
  for (let i = -3; i <= 3; i++) {
    const date = addDays(baseDate, i);
    // 随机波动价格
    const randomFactor = 0.7 + Math.random() * 0.6;
    const price = Math.round(basePrice * randomFactor / 10) * 10;
    prices.push({
      date,
      price,
      isLowest: false,
      isWeekend: date.getDay() === 0 || date.getDay() === 6
    });
  }
  
  // 标记最低价
  const minPrice = Math.min(...prices.map(p => p.price));
  prices.forEach(p => {
    if (p.price === minPrice) p.isLowest = true;
  });
  
  return prices;
};

const DatePriceMatrix = ({ selectedDate, onDateChange }) => {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const prices = generatePriceMatrix(currentDate);

  const handlePrev = () => {
    const newDate = addDays(currentDate, -7);
    setCurrentDate(newDate);
    onDateChange?.(newDate);
  };

  const handleNext = () => {
    const newDate = addDays(currentDate, 7);
    setCurrentDate(newDate);
    onDateChange?.(newDate);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 shadow-soft"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FF8A2C]" />
          <h3 className="font-semibold text-slate-800">灵活日期比价</h3>
          <span className="text-xs text-slate-500 ml-2">前后3天价格对比</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrev}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-slate-600 font-medium">
            {format(currentDate, 'yyyy年MM月', { locale: zhCN })}
          </span>
          <button 
            onClick={handleNext}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 价格矩阵 */}
      <div className="grid grid-cols-7 gap-2">
        {prices.map((item, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onDateChange?.(item.date)}
            className={`relative p-3 rounded-xl border-2 transition-all ${
              item.isLowest 
                ? 'border-[#FF8A2C] bg-orange-50' 
                : format(item.date, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd')
                ? 'border-[#00A5FF] bg-blue-50'
                : 'border-slate-100 hover:border-slate-200 bg-white'
            }`}
          >
            {/* 星期 */}
            <div className="text-xs text-slate-400 mb-1">
              {format(item.date, 'EEE', { locale: zhCN })}
            </div>
            {/* 日期 */}
            <div className={`text-sm font-semibold mb-1 ${
              item.isLowest ? 'text-[#FF6B00]' : 'text-slate-700'
            }`}>
              {format(item.date, 'dd')}
            </div>
            {/* 价格 */}
            <div className={`text-xs font-bold ${
              item.isLowest ? 'text-[#FF6B00]' : 'text-[#00A5FF]'
            }`}>
              ¥{item.price}
            </div>
            
            {/* 最低价标签 */}
            {item.isLowest && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#FF6B00] text-white text-[10px] rounded-full font-medium">
                最低
              </div>
            )}
            
            {/* 周末标识 */}
            {item.isWeekend && !item.isLowest && (
              <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#00A5FF]/50" />
            )}
          </motion.button>
        ))}
      </div>

      {/* 提示 */}
      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded border-2 border-[#FF8A2C] bg-orange-50" />
          <span>最低价</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded border-2 border-[#00A5FF] bg-blue-50" />
          <span>已选日期</span>
        </div>
      </div>
    </motion.div>
  );
};

export default DatePriceMatrix;
