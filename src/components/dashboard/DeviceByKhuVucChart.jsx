import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import MainCard from '/src/components/MainCard';
export default function DeviceByKhuVucChart({ data }) {
  return (
    <MainCard title="Thiết bị theo khu vực">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip formatter={(value, name) => name === 'value' ? `${value} thiết bị` : `${value}%`} />
          <Bar dataKey="value" fill="#722ed1">
            <LabelList 
              dataKey="percentage" 
              position="top" 
              formatter={(v) => `${v}%`} 
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </MainCard>
  );
}
