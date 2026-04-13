import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, ArrowRightLeft, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, addDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { toast } from 'sonner';

const HOT_CITIES = ['北京', '上海', '广州', '深圳', '成都', '西安', '杭州', '厦门', '香港'];
const HOT_CITY_CODES = {
  '北京': 'PEK',
  '上海': 'PVG',
  '广州': 'CAN',
  '深圳': 'SZX',
  '成都': 'CTU',
  '西安': 'XIY',
  '杭州': 'HGH',
  '厦门': 'XMN',
  '香港': 'HKG',
};

const SINGAPORE_LOCATION = {
  city: '新加坡',
  code: 'SIN',
  label: '新加坡 (SIN)',
};

const SearchWidget = ({ onSearch, initialDestination = '', initialDate = null }) => {
  const [otherCity, setOtherCity] = useState(initialDestination || '');
  const [tripType, setTripType] = useState('oneway');
  const [isInboundToSingapore, setIsInboundToSingapore] = useState(false);

  const [departDate, setDepartDate] = useState(
    initialDate
      ? format(new Date(initialDate), 'yyyy-MM-dd')
      : format(addDays(new Date(), 7), 'yyyy-MM-dd')
  );
  const [returnDate, setReturnDate] = useState(format(addDays(new Date(), 21), 'yyyy-MM-dd'));

  useEffect(() => {
    if (initialDestination) {
      setOtherCity(initialDestination);
    }
    if (initialDate) {
      setDepartDate(format(new Date(initialDate), 'yyyy-MM-dd'));
    }
  }, [initialDestination, initialDate]);

  useEffect(() => {
    if (tripType !== 'roundtrip') return;
    if (new Date(returnDate) <= new Date(departDate)) {
      setReturnDate(format(addDays(new Date(departDate), 14), 'yyyy-MM-dd'));
    }
  }, [departDate, returnDate, tripType]);

  const buildSearchPayload = (city = otherCity) => ({
    origin: isInboundToSingapore ? city : SINGAPORE_LOCATION.city,
    originCode: isInboundToSingapore ? HOT_CITY_CODES[city] : SINGAPORE_LOCATION.code,
    destination: city,
    destinationLabel: isInboundToSingapore ? SINGAPORE_LOCATION.city : city,
    departDate: new Date(departDate),
    tripType,
    returnDate: tripType === 'roundtrip' ? new Date(returnDate) : null,
    isInboundToSingapore,
  });

  const handleSwapLocations = () => {
    setIsInboundToSingapore((prev) => !prev);
    toast.info('已切换方向', {
      description: isInboundToSingapore ? '现在搜索从新加坡出发的航班' : '现在搜索飞往新加坡的航班',
    });
  };

  const handleCitySelect = (city) => {
    setOtherCity(city);
    if (!city) return;
    setTimeout(() => {
      onSearch?.(buildSearchPayload(city));
    }, 100);
  };

  const handleSearch = () => {
    if (!otherCity) {
      toast.info('请先选择目的地', { description: '请从热门城市中选择一个城市' });
      return;
    }
    onSearch?.(buildSearchPayload());
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    return format(new Date(dateStr), 'yyyy年MM月dd日', { locale: zhCN });
  };

  const leftLocation = isInboundToSingapore
    ? { label: otherCity || '选择城市', muted: !otherCity, type: 'other' }
    : { label: SINGAPORE_LOCATION.label, muted: false, type: 'singapore' };
  const rightLocation = isInboundToSingapore
    ? { label: SINGAPORE_LOCATION.label, muted: false, type: 'singapore' }
    : { label: otherCity || '请选择目的地', muted: !otherCity, type: 'other' };
  const locationColumnClass = tripType === 'roundtrip' ? 'md:col-span-2' : 'md:col-span-3';
  const dateColumnClass = tripType === 'roundtrip' ? 'md:col-span-2' : 'md:col-span-3';
  const buttonColumnClass = tripType === 'roundtrip' ? 'md:col-span-2' : 'md:col-span-2';

  const renderLocationField = (location, label) => (
    <div className="relative">
      <label className="mb-2 ml-1 flex h-5 items-center gap-1 text-xs font-medium text-slate-500">
        {location.type === 'singapore' && (
          <span className="flex h-4 w-7 items-center justify-center rounded-full bg-red-500 text-[8px] text-white">
            SIN
          </span>
        )}
        {label}
      </label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
        {location.type === 'other' ? (
          <select
            value={otherCity}
            onChange={(e) => handleCitySelect(e.target.value)}
            className={`h-12 w-full cursor-pointer appearance-none rounded-xl border pl-9 pr-8 font-medium outline-none focus:border-[#00A5FF] focus:ring-2 focus:ring-[#00A5FF] ${
              otherCity ? 'border-[#00A5FF] bg-[#00A5FF]/10 text-slate-800' : 'border-slate-200 bg-white text-slate-500'
            }`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
            }}
          >
            <option value="">{location.label}</option>
            {HOT_CITIES.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        ) : (
          <input
            value={location.label}
            readOnly
            className="h-12 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 font-medium text-slate-800 outline-none"
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-3xl border border-white/60 bg-white/95 p-6 shadow-2xl shadow-slate-300/50 backdrop-blur-xl md:p-8"
      >
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="rounded-full bg-slate-100 p-1">
            {[
              { id: 'oneway', label: '单程' },
              { id: 'roundtrip', label: '往返' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setTripType(item.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  tripType === item.id
                    ? 'bg-white text-[#0088DD] shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-[#FF6B00]">
            {isInboundToSingapore ? '到坡方向' : '从新加坡出发'}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-start">
          <div className={locationColumnClass}>
            {renderLocationField(leftLocation, '出发地')}
          </div>

          <div className="flex items-end justify-center md:col-span-1 md:h-[76px]">
            <button
              onClick={handleSwapLocations}
              className="mb-0 rounded-full border border-slate-200 bg-white p-2.5 shadow-sm transition-all hover:border-[#00A5FF] hover:bg-sky-50"
              aria-label="切换新加坡方向"
            >
              <ArrowRightLeft className="h-4 w-4 text-slate-500 transition-colors hover:text-[#00A5FF]" />
            </button>
          </div>

          <div className={locationColumnClass}>
            {renderLocationField(rightLocation, '目的地')}
          </div>

          <div className={dateColumnClass}>
            <label className="mb-2 ml-1 flex h-5 items-center text-xs font-medium text-slate-500">
              出发日期
            </label>
            <div className="relative">
              <Calendar className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                value={departDate}
                onChange={(e) => setDepartDate(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
                max={format(addDays(new Date(), 365), 'yyyy-MM-dd')}
                className="h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm font-medium text-slate-800 outline-none focus:border-[#00A5FF] focus:ring-2 focus:ring-[#00A5FF]"
              />
            </div>
            <div className="mt-1 min-h-4 text-xs text-slate-500">
              {formatDisplayDate(departDate)}
            </div>
          </div>

          {tripType === 'roundtrip' && (
            <div className={dateColumnClass}>
              <label className="mb-2 ml-1 flex h-5 items-center text-xs font-medium text-slate-500">
                返回日期
              </label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={format(addDays(new Date(departDate), 1), 'yyyy-MM-dd')}
                  max={format(addDays(new Date(), 365), 'yyyy-MM-dd')}
                  className="h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm font-medium text-slate-800 outline-none focus:border-[#00A5FF] focus:ring-2 focus:ring-[#00A5FF]"
                />
              </div>
              <div className="mt-1 min-h-4 text-xs text-slate-500">
                {formatDisplayDate(returnDate)}
              </div>
            </div>
          )}

          <div className={buttonColumnClass}>
            <label className="mb-2 hidden h-5 text-xs font-medium text-transparent md:flex">搜索</label>
            <Button
              onClick={handleSearch}
              className="h-12 w-full rounded-xl btn-primary-gradient text-base font-semibold"
            >
              <Search className="h-5 w-5 md:mr-2" />
              <span className="hidden md:inline">搜索</span>
            </Button>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">热门城市：</span>
              <span className="text-xs text-slate-400">选择一个城市，另一端始终是新加坡</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {HOT_CITIES.map((city) => (
                <button
                  key={city}
                  onClick={() => handleCitySelect(city)}
                  className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                    otherCity === city
                      ? 'bg-[#00A5FF] text-white shadow-lg shadow-blue-500/25'
                      : 'bg-[#F5F7FA] text-slate-700 hover:bg-[#00A5FF] hover:text-white'
                  }`}
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
