import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Compass, GraduationCap, MapPin, X } from 'lucide-react';

// 热门回国目的地配置（带价格和距离梯度）
const HOT_DESTINATIONS = [
  // 华北 - 最远
  { city: '北京', code: 'PEK', gradient: 'from-amber-500 to-red-600', distance: 'far', basePrice: '¥1,499' },
  { city: '上海', code: 'PVG', gradient: 'from-blue-500 to-cyan-600', distance: 'far', basePrice: '¥1,399' },
  // 西南/西北 - 偏远
  { city: '成都', code: 'CTU', gradient: 'from-orange-500 to-red-500', distance: 'remote', basePrice: '¥1,199' },
  { city: '西安', code: 'XIY', gradient: 'from-rose-500 to-pink-600', distance: 'remote', basePrice: '¥1,149' },
  // 华东/华中 - 中等
  { city: '杭州', code: 'HGH', gradient: 'from-emerald-500 to-green-600', distance: 'medium', basePrice: '¥1,049' },
  { city: '厦门', code: 'XMN', gradient: 'from-sky-500 to-blue-600', distance: 'medium', basePrice: '¥999' },
  // 华南 - 最近
  { city: '广州', code: 'CAN', gradient: 'from-green-500 to-teal-600', distance: 'near', basePrice: '¥799' },
  { city: '深圳', code: 'SZX', gradient: 'from-indigo-500 to-purple-600', distance: 'near', basePrice: '¥749' },
];

const DestinationModal = ({ isOpen, onClose, onSelect }) => {
  // 禁止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleExploreClick = () => {
    onClose();
    window.location.href = '/#/explore';
  };

  const handleCitySelect = (city) => {
    onSelect(city);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 全屏深色半透明遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleOverlayClick}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 99998,
              backdropFilter: 'blur(4px)',
            }}
          />

          {/* 居中的白色卡片弹窗 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 99999,
              width: '100%',
              maxWidth: '680px',
              margin: '0 20px',
              padding: '0 16px',
            }}
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
              {/* 弹窗头部 */}
              <div className="bg-gradient-to-r from-[#00A5FF] to-[#0088DD] p-6 text-white flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Plane className="w-6 h-6" />
                      选择回国目的地
                    </h3>
                    <p className="text-white/80 text-sm mt-1">从新加坡出发，探索超值回国航线</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* 弹窗内容 */}
              <div className="p-6 overflow-auto">
                {/* 探索任意目的地 - 大按钮 */}
                <button
                  onClick={handleExploreClick}
                  className="w-full mb-6 p-5 bg-gradient-to-r from-amber-100 via-orange-50 to-amber-100 border-2 border-amber-200 rounded-2xl hover:from-amber-200 hover:via-orange-100 hover:to-amber-200 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FF8A2C] to-[#FF6B00] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Compass className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        🌍 探索任意低价目的地
                        <span className="px-2 py-0.5 bg-[#FF6B00] text-white text-xs rounded-full">HOT</span>
                      </div>
                      <div className="text-slate-500 text-sm">发现最超值的回国航线，智能比价省更多</div>
                    </div>
                    <div className="text-[#FF6B00]">
                      <span className="text-2xl">→</span>
                    </div>
                  </div>
                </button>

                {/* 距离梯度说明 */}
                <div className="mb-4 flex items-center gap-4 text-xs text-slate-500 overflow-x-auto pb-2">
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>华南圈（最近）</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>华东/华中</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span>西南/西北</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>华北（最远）</span>
                  </div>
                </div>

                {/* 热门回国目的地网格 */}
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-4 flex items-center gap-2">
                    <span className="w-1 h-4 bg-[#00A5FF] rounded-full"></span>
                    热门回国目的地
                    <span className="text-xs text-slate-400 font-normal ml-auto">显示起步价</span>
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {HOT_DESTINATIONS.map((dest) => (
                      <motion.button
                        key={dest.city}
                        onClick={() => handleCitySelect(dest.city)}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative p-4 rounded-2xl bg-gradient-to-br ${dest.gradient} text-white text-left overflow-hidden group shadow-md hover:shadow-xl transition-shadow`}
                      >
                        {/* 装饰背景 */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                        
                        {/* 距离指示点 */}
                        <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                          dest.distance === 'near' ? 'bg-green-300' :
                          dest.distance === 'medium' ? 'bg-blue-300' :
                          dest.distance === 'remote' ? 'bg-orange-300' :
                          'bg-red-300'
                        }`} />

                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-1">
                            <div className="text-2xl font-bold">{dest.city}</div>
                            <span className="text-xs text-white/80 font-mono">{dest.code}</span>
                          </div>
                          <div className="text-white/80 text-xs mb-2 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>SIN直飞</span>
                          </div>
                          <div className="text-white font-bold text-sm bg-white/20 rounded-full px-2 py-0.5 inline-block">
                            {dest.basePrice}起
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* 提示信息 */}
                <div className="mt-6 p-4 bg-slate-50 rounded-xl flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-[#00A5FF] flex-shrink-0" />
                  <p className="text-sm text-slate-600">
                    <span className="font-medium text-slate-800">留学生专享：</span>
                    凭学生证在携程、StudentUniverse等平台享额外9折及+10kg行李额度
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DestinationModal;
