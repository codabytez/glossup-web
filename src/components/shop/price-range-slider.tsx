const MIN_PRICE = 0;
const MAX_PRICE = 400250;
const HISTOGRAM_BARS = [
  14, 11, 7, 14, 9, 6, 4, 14, 4, 10, 17, 21, 25, 26, 32, 36, 43, 47, 58, 65, 78, 78, 83, 88, 88, 88,
  96, 91, 100, 96, 96, 93, 88, 83, 88, 75, 78, 67, 58, 65, 47, 43, 36, 32, 20, 16, 10, 6, 5, 7, 11,
  14, 9, 6, 4, 4, 7, 7,
];

interface PriceRangeSliderProps {
  min: number;
  max: number;
  onMinChange: (v: number) => void;
  onMaxChange: (v: number) => void;
}

export function PriceRangeSlider({ min, max, onMinChange, onMaxChange }: PriceRangeSliderProps) {
  const minPercent = ((min - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
  const maxPercent = ((max - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;

  return (
    <div className="flex flex-col gap-6">
      <div className="w-full px-2">
        {/* Histogram */}
        <div className="flex items-end justify-between overflow-hidden" style={{ height: 100 }}>
          {HISTOGRAM_BARS.map((h, i) => (
            <div
              key={i}
              className="bg-grey-100 w-1 shrink-0 rounded-t-[32px]"
              style={{ height: h }}
            />
          ))}
        </div>

        {/* Track — flush under histogram */}
        <div className="relative h-1 overflow-visible">
          <div className="bg-grey-100 absolute inset-0 rounded-b-[32px]" />

          <div
            className="bg-primary-900 absolute inset-y-0 rounded-[32px]"
            style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
          />

          <input
            type="range"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={1000}
            value={min}
            onChange={(e) => onMinChange(Math.min(Number(e.target.value), max - 1000))}
            className="price-slider absolute inset-x-0 w-full opacity-0"
            style={{ top: -6, height: 16, zIndex: min > MAX_PRICE * 0.95 ? 5 : 3 }}
          />

          <input
            type="range"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={1000}
            value={max}
            onChange={(e) => onMaxChange(Math.max(Number(e.target.value), min + 1000))}
            className="price-slider absolute inset-x-0 w-full opacity-0"
            style={{ top: -6, height: 16, zIndex: 4 }}
          />

          <div
            className="border-primary-900 pointer-events-none absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-white shadow-[0px_4px_6px_rgba(0,0,0,0.1),0px_10px_15px_rgba(0,0,0,0.1)]"
            style={{ left: `${minPercent}%`, zIndex: 6 }}
          />
          <div
            className="border-primary-900 pointer-events-none absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-white shadow-[0px_4px_6px_rgba(0,0,0,0.1),0px_10px_15px_rgba(0,0,0,0.1)]"
            style={{ left: `${maxPercent}%`, zIndex: 6 }}
          />
        </div>
      </div>

      {/* Pill inputs */}
      <div className="flex items-center gap-2">
        <div className="border-grey-200 bg-grey-50 flex min-w-0 flex-1 items-center gap-1 overflow-hidden rounded-full border px-3 py-2">
          <span className="text-grey-700 shrink-0 text-sm">₦</span>
          <input
            type="text"
            value={min.toLocaleString()}
            onChange={(e) => {
              const num = Number(e.target.value.replace(/,/g, ""));
              if (!isNaN(num)) onMinChange(Math.min(num, max - 1000));
            }}
            className="text-grey-800 min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </div>
        <span className="text-grey-400 shrink-0 text-sm">-</span>
        <div className="border-grey-200 bg-grey-50 flex min-w-0 flex-1 items-center gap-1 overflow-hidden rounded-full border px-3 py-2">
          <span className="text-grey-700 shrink-0 text-sm">₦</span>
          <input
            type="text"
            value={max.toLocaleString()}
            onChange={(e) => {
              const num = Number(e.target.value.replace(/,/g, ""));
              if (!isNaN(num)) onMaxChange(Math.max(num, min + 1000));
            }}
            className="text-grey-800 min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </div>
      </div>
    </div>
  );
}
