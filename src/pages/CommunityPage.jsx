import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Car, GraduationCap, Plane, Plus, Sparkles, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ARRIVAL_CHECKLIST, COMMUNITY_POSTS, SCHOOLS, STORAGE_KEYS } from '@/data/community';
import { MOCK_FLIGHTS } from '@/data/flights';

const initialForm = {
  school: 'NUS',
  direction: '回国',
  flightNo: 'SQ830',
  route: 'SIN → PVG',
  date: '2026-05-30',
  pickupPoint: '',
  dropoffPoint: '',
  seats: 1,
  timeWindow: '',
  note: '',
  contactPreference: 'Telegram',
};

const readStoredPosts = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.posts) || '[]');
  } catch {
    return [];
  }
};

const CommunityPage = () => {
  const [schoolFilter, setSchoolFilter] = useState('全部');
  const [directionFilter, setDirectionFilter] = useState('全部');
  const [flightFilter, setFlightFilter] = useState('全部');
  const [posts, setPosts] = useState(COMMUNITY_POSTS);
  const [form, setForm] = useState(initialForm);
  const [interestedIds, setInterestedIds] = useState([]);

  useEffect(() => {
    setPosts([...readStoredPosts(), ...COMMUNITY_POSTS]);
  }, []);

  const flights = useMemo(() => {
    return MOCK_FLIGHTS.map((flight) => ({
      value: flight.flightNo,
      label: `${flight.flightNo} · ${flight.originCode} → ${flight.destCode}`,
      route: `${flight.originCode} → ${flight.destCode}`,
      date: flight.date,
    }));
  }, []);

  const filteredPosts = posts.filter((post) => {
    const schoolMatched = schoolFilter === '全部' || post.school === schoolFilter;
    const directionMatched = directionFilter === '全部' || post.direction === directionFilter;
    const flightMatched = flightFilter === '全部' || post.flightNo === flightFilter;
    return schoolMatched && directionMatched && flightMatched;
  });

  const updateForm = (field, value) => {
    if (field === 'flightNo') {
      const selectedFlight = flights.find((flight) => flight.value === value);
      setForm((prev) => ({
        ...prev,
        flightNo: value,
        route: selectedFlight?.route || prev.route,
        date: selectedFlight?.date || prev.date,
      }));
      return;
    }
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextPost = {
      ...form,
      id: `post-${Date.now()}`,
      seats: Number(form.seats) || 1,
      createdAt: new Date().toISOString(),
      interested: 0,
    };
    const storedPosts = readStoredPosts();
    const nextStoredPosts = [nextPost, ...storedPosts];
    localStorage.setItem(STORAGE_KEYS.posts, JSON.stringify(nextStoredPosts));
    setPosts([nextPost, ...posts]);
    setForm(initialForm);
  };

  const toggleInterested = (id) => {
    setInterestedIds((prev) => (
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    ));
  };

  return (
    <div className="min-h-screen bg-travel-page">
      <section className="relative overflow-hidden px-4 pb-12 pt-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(0,165,255,0.18),transparent_28%),radial-gradient(circle_at_82%_8%,rgba(255,138,44,0.16),transparent_26%)]" />
        <div className="relative mx-auto max-w-7xl">
          <nav className="mb-10 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => { window.location.href = '/#/'; }}
              className="text-slate-600 hover:bg-white/70 hover:text-slate-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回首页
            </Button>
            <span className="rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-[#0088DD] shadow-soft">
              FlyBack SG 生态圈
            </span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/80 px-4 py-2 text-sm font-semibold text-[#0088DD] shadow-soft">
                <Users className="h-4 w-4" />
                同航班 · 同学校 · 同方向
              </div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
                找同路人，
                <span className="text-gradient-orange"> 拼车去机场</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
                面向 NUS、NTU、SIM、SMU 等新加坡留学生，围绕回国和到坡两个场景组织航班、学校与拼车信息。
              </p>
            </motion.div>

            <div className="travel-card p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#00A5FF]/10 p-3 text-[#00A5FF]">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">到坡 Checklist</h2>
                  <p className="text-sm text-slate-500">给第一次来新加坡的同学一点确定感。</p>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {ARRIVAL_CHECKLIST.map((item) => (
                  <div key={item.title} className="rounded-2xl bg-sky-50/70 p-4">
                    <h3 className="font-semibold text-slate-800">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 lg:grid-cols-[360px_1fr]">
        <aside className="travel-card h-fit p-5">
          <div className="mb-5 flex items-center gap-2">
            <Plus className="h-5 w-5 text-[#FF6B00]" />
            <h2 className="text-lg font-bold text-slate-900">发布拼车帖</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1 text-xs font-semibold text-slate-500">
                学校
                <select value={form.school} onChange={(e) => updateForm('school', e.target.value)} className="travel-input">
                  {SCHOOLS.map((school) => <option key={school}>{school}</option>)}
                </select>
              </label>
              <label className="space-y-1 text-xs font-semibold text-slate-500">
                方向
                <select value={form.direction} onChange={(e) => updateForm('direction', e.target.value)} className="travel-input">
                  <option>回国</option>
                  <option>到坡</option>
                </select>
              </label>
            </div>
            <label className="space-y-1 text-xs font-semibold text-slate-500">
              航班
              <select value={form.flightNo} onChange={(e) => updateForm('flightNo', e.target.value)} className="travel-input">
                {flights.map((flight) => <option key={flight.value} value={flight.value}>{flight.label}</option>)}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1 text-xs font-semibold text-slate-500">
                日期
                <input value={form.date} onChange={(e) => updateForm('date', e.target.value)} className="travel-input" />
              </label>
              <label className="space-y-1 text-xs font-semibold text-slate-500">
                人数
                <input type="number" min="1" max="6" value={form.seats} onChange={(e) => updateForm('seats', e.target.value)} className="travel-input" />
              </label>
            </div>
            <label className="space-y-1 text-xs font-semibold text-slate-500">
              上车点
              <input value={form.pickupPoint} onChange={(e) => updateForm('pickupPoint', e.target.value)} placeholder="例如 NUS UTown / Changi T3" className="travel-input" required />
            </label>
            <label className="space-y-1 text-xs font-semibold text-slate-500">
              下车点
              <input value={form.dropoffPoint} onChange={(e) => updateForm('dropoffPoint', e.target.value)} placeholder="例如 Changi Airport / NTU Hall" className="travel-input" required />
            </label>
            <label className="space-y-1 text-xs font-semibold text-slate-500">
              时间窗口
              <input value={form.timeWindow} onChange={(e) => updateForm('timeWindow', e.target.value)} placeholder="例如 06:30 - 07:00" className="travel-input" required />
            </label>
            <label className="space-y-1 text-xs font-semibold text-slate-500">
              备注
              <textarea value={form.note} onChange={(e) => updateForm('note', e.target.value)} placeholder="行李数量、希望集合点、是否可顺路..." className="travel-input min-h-24 resize-none" />
            </label>
            <Button type="submit" className="btn-accent-gradient w-full rounded-xl">
              发布到生态圈
            </Button>
          </form>
        </aside>

        <section className="space-y-5">
          <div className="travel-card p-4">
            <div className="flex flex-wrap gap-2">
              {['全部', ...SCHOOLS].map((item) => (
                <button key={item} onClick={() => setSchoolFilter(item)} className={`travel-chip ${schoolFilter === item ? 'travel-chip-active' : ''}`}>
                  {item}
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {['全部', '回国', '到坡'].map((item) => (
                <button key={item} onClick={() => setDirectionFilter(item)} className={`travel-chip ${directionFilter === item ? 'travel-chip-active' : ''}`}>
                  {item}
                </button>
              ))}
              <select value={flightFilter} onChange={(e) => setFlightFilter(e.target.value)} className="travel-input max-w-xs py-2">
                <option>全部</option>
                {flights.map((flight) => <option key={flight.value} value={flight.value}>{flight.label}</option>)}
              </select>
            </div>
          </div>

          {filteredPosts.map((post, index) => {
            const interested = interestedIds.includes(post.id);
            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="travel-card p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#00A5FF]/10 px-3 py-1 text-xs font-bold text-[#0088DD]">{post.school}</span>
                      <span className="rounded-full bg-[#FF8A2C]/10 px-3 py-1 text-xs font-bold text-[#FF6B00]">{post.direction}</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">{post.flightNo}</span>
                    </div>
                    <h3 className="mt-3 text-xl font-bold text-slate-900">{post.route} · {post.date}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{post.note}</p>
                  </div>
                  <Button onClick={() => toggleInterested(post.id)} className={interested ? 'bg-green-500 text-white hover:bg-green-600' : 'btn-primary-gradient'}>
                    {interested ? '已感兴趣' : '我感兴趣'}
                  </Button>
                </div>
                <div className="mt-5 grid gap-3 text-sm text-slate-600 md:grid-cols-4">
                  <div className="rounded-2xl bg-sky-50 p-3"><Car className="mb-1 h-4 w-4 text-[#00A5FF]" />{post.pickupPoint}</div>
                  <div className="rounded-2xl bg-orange-50 p-3"><Plane className="mb-1 h-4 w-4 text-[#FF6B00]" />{post.dropoffPoint}</div>
                  <div className="rounded-2xl bg-slate-50 p-3"><Users className="mb-1 h-4 w-4 text-slate-500" />{post.seats} 人 · {post.timeWindow}</div>
                  <div className="rounded-2xl bg-slate-50 p-3"><GraduationCap className="mb-1 h-4 w-4 text-slate-500" />{post.contactPreference} · {(post.interested || 0) + (interested ? 1 : 0)} 人关注</div>
                </div>
              </motion.article>
            );
          })}
        </section>
      </main>
    </div>
  );
};

export default CommunityPage;
