import { motion } from 'framer-motion';

const COLORS = ['#3b82f6','#8b5cf6','#10b981','#f59e0b'];

export const RepartitionChart = ({ data = [] }) => {
  const total = data.reduce((s,d) => s + (d.count||0), 0);
  if (!total) return (
    <div className="flex items-center justify-center h-40 text-slate-400 text-sm">Aucune donnée</div>
  );

  // Build donut arcs
  let cumul = 0;
  const arcs = data.map((d, i) => {
    const pct = (d.count || 0) / total;
    const start = cumul;
    cumul += pct;
    return { ...d, pct, start, color: COLORS[i % COLORS.length] };
  });

  const polarToXY = (angle, r) => {
    const rad = (angle - 0.25) * Math.PI * 2;
    return { x: 50 + r * Math.cos(rad), y: 50 + r * Math.sin(rad) };
  };

  const arcPath = (start, pct, r, ir) => {
    const end = start + pct;
    const s = polarToXY(start, r), e = polarToXY(end, r);
    const si = polarToXY(start, ir), ei = polarToXY(end, ir);
    const large = pct > 0.5 ? 1 : 0;
    return `M${s.x},${s.y} A${r},${r} 0 ${large},1 ${e.x},${e.y} L${ei.x},${ei.y} A${ir},${ir} 0 ${large},0 ${si.x},${si.y} Z`;
  };

  return (
    <div className="flex items-center gap-6">
      {/* Donut SVG */}
      <div className="relative flex-shrink-0">
        <svg viewBox="0 0 100 100" className="w-36 h-36">
          {arcs.map((arc, i) => (
            <motion.path
              key={i}
              d={arcPath(arc.start, arc.pct, 44, 28)}
              fill={arc.color}
              initial={{ opacity:0, scale:0.8 }}
              animate={{ opacity:1, scale:1 }}
              transition={{ delay: i*0.1, type:'spring', damping:15 }}
              className="origin-center cursor-pointer hover:opacity-80 transition-opacity"
            />
          ))}
          {/* Center */}
          <text x="50" y="47" textAnchor="middle" className="fill-slate-800 dark:fill-white" fontSize="12" fontWeight="bold">{total}</text>
          <text x="50" y="57" textAnchor="middle" className="fill-slate-400" fontSize="6">total</text>
        </svg>
      </div>

      {/* Legend */}
      <div className="space-y-2 flex-1 min-w-0">
        {arcs.map((arc, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background:arc.color }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-300 truncate capitalize">{arc.label || arc.type}</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-2">{arc.count}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 mt-1">
                <motion.div
                  initial={{ width:0 }}
                  animate={{ width:`${arc.pct*100}%` }}
                  transition={{ delay:i*0.1+0.3, duration:0.6 }}
                  className="h-1.5 rounded-full"
                  style={{ background:arc.color }}
                />
              </div>
            </div>
            <span className="text-xs text-slate-400 flex-shrink-0">{(arc.pct*100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
