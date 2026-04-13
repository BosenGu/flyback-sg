export const STORAGE_KEYS = {
  posts: 'flyback-sg-community-posts',
  messages: 'flyback-sg-flight-messages',
};

export const SCHOOLS = ['NUS', 'NTU', 'SIM', 'SMU', 'SUTD', 'Other'];

export const COMMUNITY_POSTS = [
  {
    id: 'post-1',
    school: 'NUS',
    direction: '回国',
    flightNo: 'SQ830',
    route: 'SIN → PVG',
    date: '2026-05-30',
    pickupPoint: 'UTown / Kent Ridge MRT',
    dropoffPoint: 'Changi Airport T3',
    seats: 2,
    timeWindow: '06:30 - 07:00',
    note: '两个人两个 28 寸箱，希望拼 Grab XL，优先 NUS 同学。',
    contactPreference: 'Telegram',
    createdAt: '2026-04-12T11:20:00+08:00',
    interested: 4,
  },
  {
    id: 'post-2',
    school: 'NTU',
    direction: '回国',
    flightNo: 'TR188',
    route: 'SIN → HGH',
    date: '2026-06-02',
    pickupPoint: 'NTU North Spine',
    dropoffPoint: 'Changi Airport T1',
    seats: 1,
    timeWindow: '13:30 - 14:00',
    note: '想找一起去机场的人，可以顺路接 Pioneer MRT。',
    contactPreference: '微信',
    createdAt: '2026-04-12T15:45:00+08:00',
    interested: 2,
  },
  {
    id: 'post-3',
    school: 'SIM',
    direction: '到坡',
    flightNo: 'MU567',
    route: 'PVG → SIN',
    date: '2026-07-18',
    pickupPoint: 'Changi Airport T3',
    dropoffPoint: 'SIM / Clementi',
    seats: 2,
    timeWindow: '21:00 - 21:40',
    note: '新生第一次到坡，想拼车去学校附近，也可以一起买 SIM 卡。',
    contactPreference: 'Telegram',
    createdAt: '2026-04-13T09:10:00+08:00',
    interested: 6,
  },
];

export const FLIGHT_MESSAGES = {
  'SQ830-2026-05-30-SIN-PVG': [
    {
      id: 'msg-1',
      author: 'NUS Yilin',
      school: 'NUS',
      text: '我也是 SQ830，T3 早上集合的话可以一起拼车。',
      createdAt: '09:18',
    },
    {
      id: 'msg-2',
      author: 'SMU Kai',
      school: 'SMU',
      text: '我有两个箱子，Grab XL 比较稳，有人一起吗？',
      createdAt: '09:24',
    },
  ],
  'TR188-2026-06-02-SIN-HGH': [
    {
      id: 'msg-3',
      author: 'NTU Wen',
      school: 'NTU',
      text: 'TR188 飞杭州，下午两点左右从西边出发，想找 1-2 人拼。',
      createdAt: '14:02',
    },
  ],
};

export const ARRIVAL_CHECKLIST = [
  { title: '入境文件', desc: '护照、IPA/STP、录取通知、住宿地址截图提前放在一个文件夹。' },
  { title: '机场到校', desc: '落地后先确认行李，再选择 Grab、出租车或同校拼车。' },
  { title: '通讯与支付', desc: '准备临时 SIM / eSIM、银行卡预约、PayNow/GrabPay 设置。' },
  { title: '报到与住宿', desc: '确认宿舍 check-in 时间、学校报到地点和第一周 orientation。' },
];
