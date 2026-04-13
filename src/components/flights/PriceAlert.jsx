import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Mail, X, Sparkles, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const PriceAlert = ({ route = '新加坡 → 上海' }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) {
      toast.error('请输入有效的邮箱地址');
      return;
    }
    
    setIsSubmitting(true);
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success('订阅成功！降价时我们将第一时间通知您');
    
    // 3秒后关闭
    setTimeout(() => {
      setIsVisible(false);
    }, 3000);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 max-w-md w-full mx-4"
      >
        <div className="relative bg-white rounded-2xl shadow-2xl shadow-slate-300/50 border border-slate-200 overflow-hidden">
          {/* 装饰背景 */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00A5FF]/10 to-[#FF8A2C]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          
          {/* 关闭按钮 */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-6 relative">
            {!isSuccess ? (
              <>
                {/* 头部 */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00A5FF] to-[#FF8A2C] flex items-center justify-center flex-shrink-0">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">没找到满意的价格？</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      订阅 <span className="text-[#00A5FF] font-medium">{route}</span> 降价提醒
                    </p>
                  </div>
                </div>

                {/* 功能亮点 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-green-50 text-green-600 rounded-full">
                    <TrendingDown className="w-3 h-3" />
                    智能监测最低价
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    实时邮件通知
                  </span>
                </div>

                {/* 输入区 */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                      className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl focus:border-[#00A5FF] focus:ring-[#00A5FF]"
                    />
                  </div>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="btn-accent-gradient h-11 px-5 rounded-xl font-medium"
                  >
                    {isSubmitting ? '提交中...' : '开启监控'}
                  </Button>
                </div>

                <p className="text-xs text-slate-400 mt-3 text-center">
                  随时可以取消订阅 · 我们不会发送垃圾邮件
                </p>
              </>
            ) : (
              /* 成功状态 */
              <div className="py-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center"
                >
                  <Bell className="w-8 h-8 text-green-600" />
                </motion.div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">订阅成功！</h3>
                <p className="text-sm text-slate-500">
                  降价提醒已发送至 {email}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PriceAlert;
