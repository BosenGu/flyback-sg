const createBookingOptions = (basePrice, airlineUrl) => [
  {
    providerId: 'airline-official',
    providerName: '航司官网',
    type: 'official',
    price: basePrice + 80,
    currency: 'CNY',
    studentFriendly: false,
    features: ['官方出票', '退改规则清晰', '会员里程'],
    bookingUrl: airlineUrl,
  },
  {
    providerId: 'trip-ctrip',
    providerName: 'Trip.com / 携程',
    type: 'ota',
    price: basePrice,
    currency: 'CNY',
    studentFriendly: true,
    features: ['中文客服', '学生优惠提示', '行李政策聚合'],
    bookingUrl: 'https://www.trip.com/flights/',
  },
  {
    providerId: 'fliggy',
    providerName: '飞猪旅行',
    type: 'ota',
    price: basePrice + 35,
    currency: 'CNY',
    studentFriendly: true,
    features: ['会员券包', '信用支付', '学生专享活动'],
    bookingUrl: 'https://www.fliggy.com',
  },
  {
    providerId: 'qunar',
    providerName: '去哪儿网',
    type: 'ota',
    price: basePrice + 58,
    currency: 'CNY',
    studentFriendly: false,
    features: ['多平台比价', '低价日历', '极速出票'],
    bookingUrl: 'https://www.qunar.com',
  },
  {
    providerId: 'studentuniverse',
    providerName: 'StudentUniverse',
    type: 'student',
    price: Math.max(basePrice - 70, 499),
    currency: 'CNY',
    studentFriendly: true,
    features: ['学生身份折扣', '海外平台', '适合留学生'],
    bookingUrl: 'https://www.studentuniverse.com',
  },
  {
    providerId: 'skyscanner',
    providerName: 'Skyscanner',
    type: 'meta',
    price: basePrice + 20,
    currency: 'CNY',
    studentFriendly: false,
    features: ['元搜索比价', '价格提醒', '灵活日期'],
    bookingUrl: 'https://www.skyscanner.com.sg',
  },
  {
    providerId: 'google-flights',
    providerName: 'Google Flights',
    type: 'meta',
    price: basePrice + 45,
    currency: 'CNY',
    studentFriendly: false,
    features: ['趋势追踪', '日期网格', '跳转官网'],
    bookingUrl: 'https://www.google.com/travel/flights',
  },
  {
    providerId: 'kayak',
    providerName: 'KAYAK',
    type: 'meta',
    price: basePrice + 65,
    currency: 'CNY',
    studentFriendly: false,
    features: ['价格预测', '组合航班', '筛选丰富'],
    bookingUrl: 'https://www.kayak.sg/flights',
  },
];

export const AIRLINE_OPTIONS = [
  { id: 'singapore', name: '新加坡航空', prefix: 'SQ', url: 'https://www.singaporeair.com', baggage: '30kg', priceOffset: 520 },
  { id: 'scoot', name: '酷航', prefix: 'TR', url: 'https://www.flyscoot.com', baggage: '20kg', priceOffset: -260 },
  { id: 'airchina', name: '国航', prefix: 'CA', url: 'https://www.airchina.com', baggage: '23kg', priceOffset: 120 },
  { id: 'chinaeastern', name: '东航', prefix: 'MU', url: 'https://www.ceair.com', baggage: '23kg', priceOffset: 40 },
  { id: 'chinacs', name: '南航', prefix: 'CZ', url: 'https://www.csair.com', baggage: '23kg', priceOffset: 20 },
  { id: 'xiamenair', name: '厦航', prefix: 'MF', url: 'https://www.xiamenair.com', baggage: '23kg', priceOffset: -80 },
  { id: 'shenzhenair', name: '深航', prefix: 'ZH', url: 'https://www.shenzhenair.com', baggage: '23kg', priceOffset: -20 },
  { id: 'cathay', name: '国泰', prefix: 'CX', url: 'https://www.cathaypacific.com', baggage: '23kg', priceOffset: 180 },
  { id: 'juneyao', name: '吉祥航空', prefix: 'HO', url: 'https://www.juneyaoair.com', baggage: '23kg', priceOffset: -90 },
];

const CITY_PROFILES = [
  { city: '北京', code: 'PEK', basePrice: 1510, durationMinutes: 375, note: '华北方向适合寒暑假回国与北京中转。' },
  { city: '上海', code: 'PVG', basePrice: 1390, durationMinutes: 335, note: '华东方向选择多，适合江浙沪同学。' },
  { city: '广州', code: 'CAN', basePrice: 1180, durationMinutes: 245, note: '华南方向航程短，适合珠三角回家。' },
  { city: '深圳', code: 'SZX', basePrice: 1220, durationMinutes: 255, note: '深圳和大湾区方向适合假期短途往返。' },
  { city: '成都', code: 'CTU', basePrice: 1620, durationMinutes: 310, note: '西南方向旺季波动更明显，适合提前关注。' },
  { city: '西安', code: 'XIY', basePrice: 1540, durationMinutes: 330, note: '西北方向多经停组合，适合灵活日期比价。' },
  { city: '杭州', code: 'HGH', basePrice: 1260, durationMinutes: 320, note: '杭州方向低价较多，适合江浙沪同学。' },
  { city: '厦门', code: 'XMN', basePrice: 1120, durationMinutes: 260, note: '福建方向航程适中，学生票价常有惊喜。' },
  { city: '香港', code: 'HKG', basePrice: 1080, durationMinutes: 240, note: '香港可作为目的地，也适合作为回国中转。' },
];

const DEPARTURE_TIMES = ['01:45', '07:25', '09:30', '12:30', '14:20', '16:45', '19:10', '22:55'];
const TREND_SEQUENCE = ['low', 'stable', 'high', 'low', 'stable'];
const TRANSFER_POINTS = ['香港', '曼谷', '吉隆坡', '厦门', '广州'];

const pad = (value) => String(value).padStart(2, '0');

const addMinutesToTime = (time, minutes) => {
  const [hour, minute] = time.split(':').map(Number);
  const total = (hour * 60 + minute + minutes) % (24 * 60);
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
};

const formatDuration = (minutes) => `${Math.floor(minutes / 60)}h ${pad(minutes % 60)}m`;

const buildFlightNumber = (airline, city, cityIndex, variantIndex) => {
  if (airline.prefix === 'SQ' && city.city === '上海' && variantIndex === 0) return 'SQ830';
  if (airline.prefix === 'TR' && city.city === '杭州' && variantIndex === 0) return 'TR188';

  const numeric = 800 + cityIndex * 18 + variantIndex * 7;
  return `${airline.prefix}${numeric}`;
};

const buildFlightDate = (airline, city, cityIndex, airlineIndex, variantIndex) => {
  if (airline.prefix === 'SQ' && city.city === '上海' && variantIndex === 0) return '2026-05-30';
  if (airline.prefix === 'TR' && city.city === '杭州' && variantIndex === 0) return '2026-06-02';
  return `2026-${pad(5 + ((cityIndex + variantIndex) % 4))}-${pad(18 + ((cityIndex * 2 + airlineIndex + variantIndex) % 10))}`;
};

const generateMockFlights = () => CITY_PROFILES.flatMap((city, cityIndex) =>
  AIRLINE_OPTIONS.flatMap((airline, airlineIndex) =>
    [0, 1].map((variantIndex) => {
      const stops = variantIndex === 0 ? 0 : 1;
      const departureTime = DEPARTURE_TIMES[(cityIndex + airlineIndex + variantIndex) % DEPARTURE_TIMES.length];
      const durationMinutes = city.durationMinutes + stops * 70 + ((airlineIndex % 3) * 10) + variantIndex * 15;
      const price = Math.max(
        690,
        city.basePrice + airline.priceOffset + variantIndex * 140 + ((cityIndex + airlineIndex) % 4) * 35
      );

      return {
        id: 1000 + cityIndex * 100 + airlineIndex * 10 + variantIndex,
        airline: airline.name,
        flightNo: buildFlightNumber(airline, city, cityIndex, variantIndex),
        departureTime,
        arrivalTime: addMinutesToTime(departureTime, durationMinutes),
        originCode: 'SIN',
        destCode: city.code,
        arrivalCity: city.city,
        duration: formatDuration(durationMinutes),
        durationMinutes,
        stops,
        isDirect: stops === 0,
        price,
        originalPrice: price + 360 + variantIndex * 120,
        trend: TREND_SEQUENCE[(cityIndex + airlineIndex + variantIndex) % TREND_SEQUENCE.length],
        baggage: airline.baggage,
        departureHour: Number(departureTime.slice(0, 2)),
        date: buildFlightDate(airline, city, cityIndex, airlineIndex, variantIndex),
        routeType: 'return-home',
        sourceNote: `${city.note} Demo 估算价，${stops === 0 ? '直飞优先' : `经${TRANSFER_POINTS[(cityIndex + airlineIndex) % TRANSFER_POINTS.length]}中转`}，实际以出票平台为准。`,
        bookingOptions: createBookingOptions(price, airline.url),
      };
    })
  )
);

export const MOCK_FLIGHTS = generateMockFlights();

export const AIRLINE_MAP = {
  '酷航': 'scoot',
  '国航': 'airchina',
  '新航': 'singapore',
  '新加坡航空': 'singapore',
  '亚航': 'asia',
  '东航': 'chinaeastern',
  '捷星': 'jetstar',
  '南航': 'chinacs',
  '厦航': 'xiamenair',
  '深航': 'shenzhenair',
  '国泰': 'cathay',
  '吉祥航空': 'juneyao',
};

export const CITY_CODE_MAP = {
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
