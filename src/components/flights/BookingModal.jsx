import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plane, Clock, Luggage, ExternalLink, Shield, Star, GraduationCap, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

// 默认 OTA 供应商数据
const DEFAULT_OTA_PROVIDERS = [
  { 
    id: 'ctrip', 
    name: '携程旅行', 
    logo: '🐬',
    color: 'blue',
    rating: 4.8,
    reviews: 12580,
    features: ['退改保障', '发票支持', '学生认证9折'],
    isStudentFriendly: true,
    bookingUrl: 'https://www.ctrip.com'
  },
  { 
    id: 'fliggy', 
    name: '飞猪旅行', 
    logo: '🐷',
    color: 'yellow',
    rating: 4.6,
    reviews: 6700,
    features: ['信用住', '会员积分', '学生专享价'],
    isStudentFriendly: true,
    bookingUrl: 'https://www.fliggy.com'
  },
  { 
    id: 'qunar', 
    name: '去哪儿网', 
    logo: '🐪',
    color: 'indigo',
    rating: 4.5,
    reviews: 8900,
    features: ['极速出票', '在线选座'],
    isStudentFriendly: false,
    bookingUrl: 'https://www.qunar.com'
  },
  { 
    id: 'studentuniverse', 
    name: 'StudentUniverse', 
    logo: '🎓',
    color: 'green',
    rating: 4.7,
    reviews: 3200,
    features: ['学生证专享折扣', '额外行李10kg', '免费改签', '24h中文客服'],
    isStudentFriendly: true,
    isInternational: true,
    bookingUrl: 'https://www.studentuniverse.com'
  },
  { 
    id: 'kiwi', 
    name: 'Kiwi.com', 
    logo: '🥝',
    color: 'orange',
    rating: 4.3,
    reviews: 2100,
    features: ['低价保证', '多航司组合', '留学生保险'],
    isStudentFriendly: true,
    isInternational: true,
    bookingUrl: 'https://www.kiwi.com'
  },
  { 
    id: 'trip', 
    name: 'Trip.com', 
    logo: '✈️',
    color: 'purple',
    rating: 4.6,
    reviews: 15400,
    features: ['多语言支持', '新人优惠', 'ISIC卡折扣'],
    isStudentFriendly: true,
    isInternational: true,
    bookingUrl: 'https://www.trip.com'
  }
];

const normalizeBookingOption = (option) => ({
  id: option.providerId,
  name: option.providerName,
  logo: getProviderLogo(option.providerName),
  color: 'blue',
  rating: option.studentFriendly ? 4.7 : 4.5,
  reviews: option.type === 'official' ? 9800 : 5200,
  features: option.features || [],
  isStudentFriendly: option.studentFriendly,
  isInternational: ['StudentUniverse', 'Skyscanner', 'KAYAK', 'Google Flights'].some((name) =>
    option.providerName?.includes(name)
  ),
  price: option.price,
  isLowest: false,
  bookingUrl: option.bookingUrl,
});

const getProviderLogo = (name = '') => {
  if (name.includes('官网')) return '🏢';
  if (name.includes('Trip') || name.includes('携程')) return '🐬';
  if (name.includes('飞猪')) return '🐷';
  if (name.includes('去哪儿')) return '🐪';
  if (name.includes('StudentUniverse')) return '🎓';
  if (name.includes('Skyscanner')) return '🔎';
  if (name.includes('Google')) return '🌐';
  if (name.includes('KAYAK')) return '🛶';
  return '🏷️';
};

const BookingModal = ({ flight, isOpen, onClose, otaPricesData = [] }) => {
  const [otaPrices, setOtaPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && flight) {
      loadOTAPrices();
    }
  }, [isOpen, flight, otaPricesData]);

  const loadOTAPrices = async () => {
    setLoading(true);
    
    if (otaPricesData && otaPricesData.length > 0) {
      const formatted = otaPricesData.map(ota => {
        const features = Array.isArray(ota.features) ? ota.features : JSON.parse(ota.features || '[]');
        const isStudentFriendly = features.some(f => 
          f.includes('学生') || f.includes('Student') || f.includes('行李') || f.includes('改签')
        );
        
        return {
          id: ota.provider_code || ota.id,
          name: ota.provider_name,
          logo: ota.provider_logo || getDefaultLogo(ota.provider_name),
          color: 'blue',
          rating: parseFloat(ota.rating) || 4.5,
          reviews: ota.review_count || 1000,
          features: features,
          isStudentFriendly,
          price: ota.price,
          isLowest: false,
          bookingUrl: ota.booking_url || getDefaultUrl(ota.provider_name)
        };
      });
      
      const minPrice = Math.min(...formatted.map(o => o.price));
      formatted.forEach(o => {
        if (o.price === minPrice) o.isLowest = true;
      });
      
      // 学生友好的排前面
      formatted.sort((a, b) => {
        if (a.isStudentFriendly && !b.isStudentFriendly) return -1;
        if (!a.isStudentFriendly && b.isStudentFriendly) return 1;
        return a.price - b.price;
      });
      
      setOtaPrices(formatted);
      setLoading(false);
      return;
    }

    if (flight?.bookingOptions?.length > 0) {
      const formatted = flight.bookingOptions.map(normalizeBookingOption);
      const minPrice = Math.min(...formatted.map(o => o.price));
      formatted.forEach(o => {
        if (o.price === minPrice) o.isLowest = true;
      });
      formatted.sort((a, b) => {
        if (a.isStudentFriendly && !b.isStudentFriendly) return -1;
        if (!a.isStudentFriendly && b.isStudentFriendly) return 1;
        return a.price - b.price;
      });
      setOtaPrices(formatted);
      setLoading(false);
      return;
    }

    // 使用默认数据
    generateMockPrices();
    setLoading(false);
  };

  const generateMockPrices = () => {
    const { price = 1280 } = flight || {};
    const providers = DEFAULT_OTA_PROVIDERS.map((provider, index) => {
      const variation = (Math.random() - 0.5) * 0.15;
      const providerPrice = Math.round(price * (1 + variation) / 10) * 10;
      return {
        ...provider,
        price: providerPrice,
        isLowest: false
      };
    }).sort((a, b) => {
      // 学生友好的排前面
      if (a.isStudentFriendly && !b.isStudentFriendly) return -1;
      if (!a.isStudentFriendly && b.isStudentFriendly) return 1;
      return a.price - b.price;
    });
    
    if (providers.length > 0) {
      const minPrice = Math.min(...providers.map(p => p.price));
      providers.forEach(p => {
        if (p.price === minPrice) p.isLowest = true;
      });
    }
    
    setOtaPrices(providers);
  };

  const getDefaultLogo = (name) => {
    const logos = {
      '携程旅行': '🐬',
      'iwofly': '🌐',
      '哇卡旅行': '✈️',
      '同程旅行': '🟢',
      'gotogate': '🌍',
      '飞猪': '🐷',
      'StudentUniverse': '🎓'
    };
    return logos[name] || '🏷️';
  };

  const getDefaultUrl = (name) => {
    const urls = {
      '携程旅行': 'https://www.ctrip.com',
      'iwofly': 'https://www.iwofly.com',
      '哇卡旅行': 'https://www.waka.travel',
      '同程旅行': 'https://www.ly.com',
      'gotogate': 'https://www.gotogate.com',
      '飞猪': 'https://www.fliggy.com',
      'StudentUniverse': 'https://www.studentuniverse.com'
    };
    return urls[name] || 'https://www.google.com';
  };

  const handleBooking = (provider) => {
    const url = provider.bookingUrl || provider.booking_url;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.open('https://www.google.com/search?q=' + encodeURIComponent(`${flight.airline} ${flight.flightNo} 预订`), '_blank');
    }
  };

  if (!flight) return null;

  const { 
    airline = '酷航', 
    flightNo = 'TR189',
    departureTime = '08:30',
    arrivalTime = '14:20',
    originCode = 'SIN',
    destCode = 'PVG',
    duration = '5h 50m',
    stops = 0,
    price = 1280,
    date = '12月20日',
    baggage = '20kg'
  } = flight;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          />

          {/* 模态框 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* 头部 */}
            <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#00A5FF]" />
                  航班详情与预订
                </h2>
                <p className="text-sm text-slate-500 mt-1">留学生专享渠道，含额外行李与折扣</p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-auto max-h-[calc(90vh-140px)]">
              {/* 航班信息卡片 */}
              <div className="bg-gradient-to-r from-[#00A5FF]/5 to-[#FF8A2C]/5 rounded-2xl p-5 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">✈️</span>
                    <div>
                      <div className="font-semibold text-slate-800">{airline} · {flightNo}</div>
                      <div className="text-sm text-slate-500">{date}</div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-0">
                    <Shield className="w-3 h-3 mr-1" />
                    可改签
                  </Badge>
                </div>

                {/* 时间线 */}
                <div className="flex items-center gap-4 py-4">
                  <div className="text-center w-24">
                    <div className="text-2xl font-bold text-slate-800">{departureTime}</div>
                    <div className="text-sm text-slate-500">{originCode}</div>
                    <div className="text-xs text-slate-400">新加坡樟宜</div>
                  </div>

                  <div className="flex-1 flex flex-col items-center">
                    <div className="text-xs text-slate-400 mb-1">{duration}</div>
                    <div className="w-full h-0.5 bg-slate-300 relative">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-400" />
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-400" />
                      <Plane className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-[#00A5FF]" />
                    </div>
                    <div className="text-xs text-green-600 font-medium mt-1">
                      {stops === 0 ? '直飞' : `转机 ${stops} 次`}
                    </div>
                  </div>

                  <div className="text-center w-24">
                    <div className="text-2xl font-bold text-slate-800">{arrivalTime}</div>
                    <div className="text-sm text-slate-500">{destCode}</div>
                    <div className="text-xs text-slate-400">目的地</div>
                  </div>
                </div>

                {/* 行李信息 */}
                <div className="flex items-center gap-6 pt-4 border-t border-slate-200/50 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Luggage className="w-4 h-4 text-slate-400" />
                    <span>托运行李 {baggage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-slate-400" />
                    <span>机上餐食</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>准点率 92%</span>
                  </div>
                </div>
              </div>

              {/* 学生优惠提示 */}
              <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">🎓 留学生专属福利</h4>
                    <p className="text-sm text-slate-600 mt-1">
                      以下渠道凭学生证可享额外折扣及行李额度。StudentUniverse和Kiwi.com为海外留学生专用平台。
                    </p>
                  </div>
                </div>
              </div>

              {/* OTA比价列表 */}
              <div>
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="text-lg">🏷️</span>
                  供应商比价
                  <span className="text-sm font-normal text-slate-400 ml-2">
                    {loading ? '加载中...' : `已为您找到 ${otaPrices.length} 个预订渠道`}
                  </span>
                </h3>

                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00A5FF]" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {otaPrices.map((ota, index) => (
                      <motion.div
                        key={ota.id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`relative flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                          ota.isLowest 
                            ? 'border-[#FF8A2C] bg-orange-50' 
                            : 'border-slate-100 hover:border-slate-200 bg-white'
                        }`}
                      >
                        {/* 学生友好标签 */}
                        {ota.isStudentFriendly && (
                          <div className="absolute -top-2 left-4 px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
                            <GraduationCap className="w-3 h-3" />
                            学生优惠
                          </div>
                        )}

                        {/* 最低价标签 */}
                        {ota.isLowest && !ota.isStudentFriendly && (
                          <div className="absolute -top-2 left-4 px-2 py-0.5 bg-[#FF6B00] text-white text-[10px] font-bold rounded-full">
                            最低价
                          </div>
                        )}

                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-2xl shadow-sm">
                            {ota.logo}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800 flex items-center gap-2">
                              {ota.name}
                              {ota.isInternational && (
                                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 text-[10px] rounded">海外</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                <span className="text-xs text-slate-600">{ota.rating}</span>
                              </div>
                              <span className="text-xs text-slate-400">({ota.reviews.toLocaleString()}条评价)</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {ota.features.slice(0, 3).map((feature, i) => (
                                <span key={i} className={`text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                                  feature.includes('学生') || feature.includes('行李') 
                                    ? 'bg-green-100 text-green-600' 
                                    : 'bg-slate-100 text-slate-500'
                                }`}>
                                  {(feature.includes('学生') || feature.includes('行李')) && <Check className="w-2 h-2" />}
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${ota.isLowest ? 'text-[#FF6B00]' : 'text-slate-800'}`}>
                              ¥{ota.price}
                            </div>
                            <div className="text-xs text-slate-400">含税总价</div>
                          </div>
                          <Button
                            onClick={() => handleBooking(ota)}
                            className={`px-6 ${
                              ota.isStudentFriendly
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                                : ota.isLowest 
                                  ? 'btn-accent-gradient' 
                                  : 'bg-slate-800 hover:bg-slate-700 text-white'
                            }`}
                          >
                            去预订
                            <ExternalLink className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* 安全提示 */}
              <div className="mt-6 p-4 bg-blue-50 rounded-xl flex items-start gap-3">
                <Shield className="w-5 h-5 text-[#00A5FF] mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-slate-800">安全预订保障</div>
                  <div className="text-xs text-slate-500 mt-1">
                    价格为 demo 估算，正式预订前请到航司官网或平台二次确认行李、退改签和支付条款。
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;
