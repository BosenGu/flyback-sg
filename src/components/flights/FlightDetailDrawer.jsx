import { motion, AnimatePresence } from 'framer-motion';
import { X, Plane, Calendar, Clock, Luggage, Wifi, Utensils, Armchair } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FlightDetailDrawer = ({ flight, isOpen, onClose }) => {
  if (!flight) return null;

  const discount = Math.round(((flight.originalPrice - flight.price) / flight.originalPrice) * 100);

  const features = [
    { icon: Luggage, label: '23kg行李额' },
    { icon: Wifi, label: '机上WiFi' },
    { icon: Utensils, label: '免费餐食' },
    { icon: Armchair, label: '可选座位' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* 抽屉主体 - 毛玻璃效果 */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-2xl border-t border-[#00F5FF]/20 rounded-t-3xl max-h-[85vh] overflow-auto"
          >
            {/* 拖动指示条 */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-12 h-1 bg-gray-700 rounded-full" />
            </div>

            <div className="p-6">
              {/* 头部：关闭按钮 */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 目的地大图 */}
              <div className="relative h-48 rounded-2xl overflow-hidden mb-6">
                <img
                  src={`https://nocode.meituan.com/photo/search?keyword=${flight.city || flight.destination},scenery&width=600&height=400`}
                  alt={flight.city || flight.destination}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h2 className="text-3xl font-bold text-white mb-1">
                    {flight.city || flight.destination}
                  </h2>
                  <p className="text-gray-300 text-sm">{flight.country}</p>
                </div>
                <div className="absolute top-4 right-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${discount >= 65 ? 'bg-[#00FF41] text-black' : 'bg-[#00F5FF] text-black'}`}>
                    ↓{discount}%
                  </div>
                </div>
              </div>

              {/* 航线信息 */}
              <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">上海</div>
                    <div className="text-gray-500 text-sm">SHA</div>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="flex items-center justify-center gap-2 text-[#00F5FF] mb-1">
                      <Plane className="w-4 h-4 rotate-90" />
                      <span className="text-xs">直飞</span>
                      <Plane className="w-4 h-4 -rotate-90" />
                    </div>
                    <div className="h-0.5 bg-gradient-to-r from-gray-700 via-[#00F5FF] to-gray-700" />
                    <div className="text-center text-gray-500 text-xs mt-1">约 4小时30分</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{flight.city || flight.destination}</div>
                    <div className="text-gray-500 text-sm">{flight.country?.substring(0, 3).toUpperCase()}</div>
                  </div>
                </div>

                {/* 价格信息 */}
                <div className="flex items-end justify-between pt-4 border-t border-gray-700">
                  <div>
                    <div className="text-gray-500 text-sm mb-1">特价机票</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-[#00FF41]">¥{flight.price}</span>
                      <span className="text-gray-500 line-through">¥{flight.originalPrice}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#00F5FF] text-sm font-medium">省 ¥{flight.originalPrice - flight.price}</div>
                    <div className="text-gray-500 text-xs">含税总价</div>
                  </div>
                </div>
              </div>

              {/* 航班特色 */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                {features.map((feature, idx) => (
                  <div key={idx} className="text-center p-3 bg-gray-800/30 rounded-xl">
                    <feature.icon className="w-5 h-5 text-[#00F5FF] mx-auto mb-1" />
                    <span className="text-gray-400 text-xs">{feature.label}</span>
                  </div>
                ))}
              </div>

              {/* 日期选择 */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-white font-medium mb-3">
                  <Calendar className="w-4 h-4 text-[#00F5FF]" />
                  <span>可选日期</span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {['12/20', '12/21', '12/22', '12/23', '12/24'].map((date, idx) => (
                    <button
                      key={date}
                      className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${idx === 0 ? 'bg-[#00F5FF] text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    >
                      {date}
                    </button>
                  ))}
                </div>
              </div>

              {/* 预订按钮 */}
              <Button
                className="w-full h-14 bg-gradient-to-r from-[#00F5FF] to-[#00FF41] text-black font-bold text-lg rounded-xl hover:opacity-90 transition-opacity"
              >
                立即预订
              </Button>

              <p className="text-center text-gray-500 text-xs mt-4">
                价格实时变动，以实际预订为准
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FlightDetailDrawer;
