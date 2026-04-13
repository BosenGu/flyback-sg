import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, TrendingDown, Plane, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WatchlistCard = ({ item, onRemove, onView, index = 0 }) => {
  const [isFlashing, setIsFlashing] = useState(false);
  const discount = Math.round(((item.originalPrice - item.currentPrice) / item.originalPrice) * 100);

  // 模拟大幅降价时的频闪效果
  useEffect(() => {
    if (discount >= 65) {
      const interval = setInterval(() => {
        setIsFlashing(prev => !prev);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [discount]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="relative group"
    >
      {/* 频闪背景效果 */}
      {discount >= 65 && (
        <div className={`absolute -inset-[1px] rounded-xl transition-opacity duration-300 ${isFlashing ? 'bg-red-500/20 opacity-100' : 'bg-red-500/5 opacity-50'}`} />
      )}

      {/* 卡片主体 */}
      <div className={`relative bg-gray-900/90 backdrop-blur-xl rounded-xl border overflow-hidden transition-all duration-300 ${discount >= 65 ? 'border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 'border-gray-800 hover:border-[#00F5FF]/30'}`}>
        {/* 降价警告条 */}
        {discount >= 65 && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-pulse" />
        )}

        <div className="p-4">
          {/* 头部信息 */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${discount >= 65 ? 'bg-red-500/10' : 'bg-gray-800'}`}>
                {discount >= 65 ? (
                  <Bell className="w-5 h-5 text-red-400 animate-bounce" />
                ) : (
                  <Plane className="w-5 h-5 text-[#00F5FF]" />
                )}
              </div>
              <div>
                <div className="text-white font-bold text-sm flex items-center gap-2">
                  上海 → {item.destination}
                  {discount >= 65 && (
                    <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-[10px] rounded-full animate-pulse">
                      超值!
                    </span>
                  )}
                </div>
                <div className="text-gray-500 text-xs mt-0.5">
                  目标价格: ¥{item.targetPrice} · 当前: ¥{item.currentPrice}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`font-mono font-bold ${discount >= 65 ? 'text-red-400' : 'text-[#00FF41]'}`}>
                -{discount}%
              </div>
              <div className="text-gray-500 text-[10px]">较原价</div>
            </div>
          </div>

          {/* 价格进度条 */}
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">价格追踪</span>
              <span className={item.currentPrice <= item.targetPrice ? 'text-[#00FF41]' : 'text-gray-400'}>
                {item.currentPrice <= item.targetPrice ? '已达目标!' : '未达目标'}
              </span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${discount >= 65 ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-[#00F5FF] to-[#00FF41]'}`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (item.originalPrice - item.currentPrice) / (item.originalPrice - item.targetPrice) * 100)}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 h-8 text-xs bg-[#00F5FF]/10 text-[#00F5FF] hover:bg-[#00F5FF]/20"
              onClick={() => onView?.(item)}
            >
              <Eye className="w-3 h-3 mr-1" />
              查看详情
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-500 hover:text-red-400 hover:bg-red-500/10"
              onClick={() => onRemove?.(item.id)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WatchlistCard;
