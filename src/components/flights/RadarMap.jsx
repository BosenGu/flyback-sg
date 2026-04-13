import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 模拟全球特价机票数据
const MOCK_FLIGHTS = [
  { id: 1, city: '曼谷', x: 70, y: 55, price: 399, originalPrice: 1299, dropRate: 70, country: '泰国' },
  { id: 2, city: '东京', x: 85, y: 35, price: 899, originalPrice: 2199, dropRate: 59, country: '日本' },
  { id: 3, city: '新加坡', x: 72, y: 62, price: 599, originalPrice: 1599, dropRate: 63, country: '新加坡' },
  { id: 4, city: '首尔', x: 82, y: 32, price: 699, originalPrice: 1699, dropRate: 59, country: '韩国' },
  { id: 5, city: '悉尼', x: 88, y: 78, price: 1299, originalPrice: 3999, dropRate: 68, country: '澳大利亚' },
  { id: 6, city: '伦敦', x: 45, y: 25, price: 1999, originalPrice: 5999, dropRate: 67, country: '英国' },
  { id: 7, city: '巴黎', x: 48, y: 28, price: 1899, originalPrice: 4999, dropRate: 62, country: '法国' },
  { id: 8, city: '纽约', x: 25, y: 35, price: 2299, originalPrice: 6999, dropRate: 67, country: '美国' },
  { id: 9, city: '迪拜', x: 58, y: 45, price: 1499, originalPrice: 4299, dropRate: 65, country: '阿联酋' },
  { id: 10, city: '吉隆坡', x: 71, y: 58, price: 499, originalPrice: 1399, dropRate: 64, country: '马来西亚' },
  { id: 11, city: '巴厘岛', x: 75, y: 65, price: 699, originalPrice: 1899, dropRate: 63, country: '印度尼西亚' },
  { id: 12, city: '奥克兰', x: 90, y: 82, price: 1599, originalPrice: 4599, dropRate: 65, country: '新西兰' },
];

// 上海坐标（用户位置）
const USER_LOCATION = { x: 78, y: 38 };

const RadarMap = ({ onSelectFlight, selectedFlight, filterBudget, filterMonth }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [flights, setFlights] = useState(MOCK_FLIGHTS);
  const [animatingFlight, setAnimatingFlight] = useState(null);
  const [lineProgress, setLineProgress] = useState(0);

  // 雷达扫描动画
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let scanAngle = 0;
    let scanRadius = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = (USER_LOCATION.x / 100) * canvas.width;
      const centerY = (USER_LOCATION.y / 100) * canvas.height;

      // 绘制雷达网格圆环
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (canvas.width * 0.15) * i, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 245, 255, ${0.1 - i * 0.02})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 绘制雷达扫描线
      scanAngle += 0.02;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, canvas.width * 0.6, scanAngle, scanAngle + 0.3);
      ctx.lineTo(centerX, centerY);
      ctx.fillStyle = 'rgba(0, 245, 255, 0.08)';
      ctx.fill();

      // 绘制扫描圆环扩散效果
      scanRadius += 2;
      if (scanRadius > canvas.width * 0.5) scanRadius = 0;
      ctx.beginPath();
      ctx.arc(centerX, centerY, scanRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 245, 255, ${Math.max(0, 0.3 - scanRadius / (canvas.width * 0.5))})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // 筛选逻辑
  useEffect(() => {
    let filtered = MOCK_FLIGHTS;
    if (filterBudget) {
      filtered = filtered.filter(f => f.price <= filterBudget);
    }
    setFlights(filtered);
  }, [filterBudget, filterMonth]);

  // 抛物线航线动画
  const handleFlightClick = useCallback((flight) => {
    setAnimatingFlight(flight);
    setLineProgress(0);

    // 模拟航线飞行动画
    let progress = 0;
    const animateLine = () => {
      progress += 0.03;
      if (progress >= 1) {
        setLineProgress(1);
        setTimeout(() => {
          onSelectFlight(flight);
          setAnimatingFlight(null);
          setLineProgress(0);
        }, 200);
        return;
      }
      setLineProgress(progress);
      requestAnimationFrame(animateLine);
    };
    animateLine();
  }, [onSelectFlight]);

  // 计算抛物线点
  const getParabolaPoint = (t, x1, y1, x2, y2) => {
    const x = x1 + (x2 - x1) * t;
    const baseY = y1 + (y2 - y1) * t;
    // 添加抛物线高度
    const height = Math.sin(t * Math.PI) * 15;
    const y = baseY - height;
    return { x, y };
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0D0D0D]">
      {/* 世界地图背景 */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* 简化的世界地图轮廓 */}
        <path
          d="M20,30 Q25,25 30,30 T40,35 Q45,30 50,35 T60,30 Q65,35 70,30 T80,35 Q85,30 90,35 L90,70 Q85,75 80,70 T70,75 Q65,70 60,75 T50,70 Q45,75 40,70 T30,75 Q25,70 20,75 Z"
          fill="none"
          stroke="#00F5FF"
          strokeWidth="0.2"
        />
        {/* 亚洲轮廓 */}
        <path
          d="M60,25 Q70,20 80,25 T90,35 Q85,45 80,50 T70,55 Q65,50 60,45 T55,35 Q58,30 60,25"
          fill="rgba(0, 245, 255, 0.05)"
          stroke="#00F5FF"
          strokeWidth="0.15"
        />
        {/* 欧洲轮廓 */}
        <path
          d="M45,20 Q50,18 55,20 T58,30 Q55,35 50,33 T45,30 Q43,25 45,20"
          fill="rgba(0, 245, 255, 0.05)"
          stroke="#00F5FF"
          strokeWidth="0.15"
        />
        {/* 北美洲轮廓 */}
        <path
          d="M10,20 Q20,15 30,20 T35,35 Q30,45 25,40 T15,35 Q12,28 10,20"
          fill="rgba(0, 245, 255, 0.05)"
          stroke="#00F5FF"
          strokeWidth="0.15"
        />
        {/* 澳洲轮廓 */}
        <path
          d="M75,70 Q85,68 90,72 T88,82 Q82,85 75,82 T70,75 Q72,72 75,70"
          fill="rgba(0, 245, 255, 0.05)"
          stroke="#00F5FF"
          strokeWidth="0.15"
        />
      </svg>

      {/* 雷达扫描 Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* 用户位置标记（上海） */}
      <motion.div
        className="absolute w-4 h-4 -ml-2 -mt-2"
        style={{ left: `${USER_LOCATION.x}%`, top: `${USER_LOCATION.y}%` }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-full h-full bg-[#00FF41] rounded-full shadow-[0_0_20px_#00FF41]" />
        <div className="absolute inset-0 bg-[#00FF41] rounded-full animate-ping opacity-50" />
      </motion.div>
      <div
        className="absolute text-[#00FF41] text-xs font-mono whitespace-nowrap"
        style={{ left: `${USER_LOCATION.x + 2}%`, top: `${USER_LOCATION.y - 2}%` }}
      >
        上海 (当前位置)
      </div>

      {/* 航线动画层 */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {animatingFlight && lineProgress > 0 && (
          <>
            {/* 抛物线航线 */}
            <path
              d={`M ${USER_LOCATION.x} ${USER_LOCATION.y} Q ${(USER_LOCATION.x + animatingFlight.x) / 2} ${Math.min(USER_LOCATION.y, animatingFlight.y) - 15} ${animatingFlight.x} ${animatingFlight.y}`}
              fill="none"
              stroke="#00F5FF"
              strokeWidth="0.3"
              strokeDasharray="2,2"
              style={{
                strokeDashoffset: 100 - lineProgress * 100,
              }}
              className="opacity-80"
            />
            {/* 飞行中的飞机图标 */}
            <motion.circle
              cx={getParabolaPoint(lineProgress, USER_LOCATION.x, USER_LOCATION.y, animatingFlight.x, animatingFlight.y).x}
              cy={getParabolaPoint(lineProgress, USER_LOCATION.x, USER_LOCATION.y, animatingFlight.x, animatingFlight.y).y}
              r="1"
              fill="#00F5FF"
              className="shadow-[0_0_10px_#00F5FF]"
            />
          </>
        )}
      </svg>

      {/* 特价城市光点 */}
      <AnimatePresence>
        {flights.map((flight) => (
          <motion.button
            key={flight.id}
            className={`absolute rounded-full transition-all duration-300 ${selectedFlight?.id === flight.id ? 'z-20' : 'z-10'}`}
            style={{
              left: `${flight.x}%`,
              top: `${flight.y}%`,
              width: `${Math.max(12, flight.dropRate / 3)}px`,
              height: `${Math.max(12, flight.dropRate / 3)}px`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: selectedFlight?.id === flight.id ? 1.5 : [1, 1.1, 1],
              opacity: 1,
            }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.3 }}
            onClick={() => handleFlightClick(flight)}
            transition={{
              scale: {
                duration: selectedFlight?.id === flight.id ? 0.3 : 2,
                repeat: selectedFlight?.id === flight.id ? 0 : Infinity,
                ease: "easeInOut"
              }
            }}
          >
            {/* 光点核心 */}
            <div
              className={`w-full h-full rounded-full shadow-[0_0_15px_currentColor] ${flight.dropRate >= 65 ? 'bg-[#00FF41] text-[#00FF41]' : 'bg-[#00F5FF] text-[#00F5FF]'}`}
            />
            {/* 呼吸光环 */}
            <div className={`absolute inset-0 rounded-full animate-ping opacity-40 ${flight.dropRate >= 65 ? 'bg-[#00FF41]' : 'bg-[#00F5FF]'}`} />

            {/* 价格标签 */}
            <motion.div
              className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="text-xs font-mono font-bold text-white bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm border border-[#00F5FF]/30">
                ¥{flight.price}
              </span>
            </motion.div>
          </motion.button>
        ))}
      </AnimatePresence>

      {/* 图例 */}
      <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md rounded-lg p-3 border border-[#00F5FF]/20">
        <div className="text-xs font-mono text-[#00F5FF] mb-2">情报图例</div>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-[#00FF41] rounded-full" />
            <span>大幅降价 (&gt;65%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-[#00F5FF] rounded-full" />
            <span>一般优惠</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadarMap;
