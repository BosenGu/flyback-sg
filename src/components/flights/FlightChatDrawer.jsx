import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, Send, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FLIGHT_MESSAGES, SCHOOLS, STORAGE_KEYS } from '@/data/community';

const getFlightKey = (flight) => {
  if (!flight) return '';
  const route = `${flight.originCode || 'SIN'}-${flight.destCode || 'CN'}`;
  return `${flight.flightNo}-${flight.date || 'flex'}-${route}`;
};

const getStoredMessages = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.messages) || '{}');
  } catch {
    return {};
  }
};

const FlightChatDrawer = ({ flight, isOpen, onClose }) => {
  const [messagesByFlight, setMessagesByFlight] = useState({});
  const [message, setMessage] = useState('');
  const [school, setSchool] = useState('NUS');

  const flightKey = useMemo(() => getFlightKey(flight), [flight]);
  const messages = messagesByFlight[flightKey] || FLIGHT_MESSAGES[flightKey] || [];

  useEffect(() => {
    setMessagesByFlight(getStoredMessages());
  }, []);

  const persistMessages = (next) => {
    setMessagesByFlight(next);
    localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(next));
  };

  const handleSend = () => {
    if (!message.trim() || !flightKey) return;

    const nextMessage = {
      id: `msg-${Date.now()}`,
      author: `${school} 同学`,
      school,
      text: message.trim(),
      createdAt: new Date().toLocaleTimeString('zh-SG', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    const next = {
      ...messagesByFlight,
      [flightKey]: [...messages, nextMessage],
    };
    persistMessages(next);
    setMessage('');
  };

  if (!flight) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="absolute right-0 top-0 h-full w-full max-w-xl overflow-hidden bg-white shadow-2xl"
          >
            <div className="flex h-full flex-col">
              <div className="bg-gradient-to-r from-[#00A5FF] to-[#0088DD] p-6 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Same flight circle</p>
                    <h2 className="mt-2 text-2xl font-bold">同航班聊天室</h2>
                    <p className="mt-1 text-sm text-white/80">
                      {flight.flightNo} · {flight.originCode} → {flight.destCode} · {flight.date || '灵活日期'}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-full bg-white/15 p-2 text-white transition hover:bg-white/25"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white/15 p-3 text-sm">
                  <Users className="h-4 w-4" />
                  <span>{Math.max(messages.length + 8, 9)} 位同学关注这班航班，聊天为 demo 本地模拟。</span>
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto bg-[#F6FBFF] p-5">
                {messages.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-sky-100 bg-white p-4 shadow-sm">
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{item.author}</span>
                      <span className="rounded-full bg-[#00A5FF]/10 px-2 py-0.5 text-[#0088DD]">{item.school}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600">{item.text}</p>
                    <div className="mt-2 text-right text-xs text-slate-400">{item.createdAt}</div>
                  </div>
                ))}
              </div>

              <div className="border-t border-sky-100 bg-white p-4">
                <div className="mb-3 flex gap-2 overflow-x-auto">
                  {SCHOOLS.map((item) => (
                    <button
                      key={item}
                      onClick={() => setSchool(item)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        school === item
                          ? 'bg-[#00A5FF] text-white shadow-md shadow-blue-500/20'
                          : 'bg-slate-100 text-slate-500 hover:bg-sky-50 hover:text-[#0088DD]'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyDown={(event) => event.key === 'Enter' && handleSend()}
                    placeholder="问问有没有人一起去机场、托运行李、落地拼车..."
                    className="min-w-0 flex-1 rounded-xl border border-sky-100 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#00A5FF] focus:bg-white focus:ring-2 focus:ring-[#00A5FF]/20"
                  />
                  <Button onClick={handleSend} className="btn-primary-gradient rounded-xl px-4">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                  <MessageCircle className="h-3 w-3" />
                  当前版本不会发送真实联系方式，适合作品集演示。
                </p>
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FlightChatDrawer;
