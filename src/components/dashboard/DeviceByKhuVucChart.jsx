import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import MainCard from '/src/components/MainCard';
export default function DeviceByKhuVucChart({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  return (
    <MainCard title="Thiết bị theo khu vực">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis domain={[0, total]} allowDecimals={false} />
          <Tooltip formatter={(value, name) => (name === 'value' ? `${value} thiết bị` : `${value}%`)} />
          <Bar dataKey="value" fill="#722ed1">
            <LabelList dataKey="value" position="top" formatter={(v) => `${v} thiết bị`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </MainCard>
  );
}
