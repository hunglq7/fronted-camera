import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { Card } from 'antd';
import MainCard from '/src/components/MainCard';
export default function DeviceByDonViChart({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  return (
    <MainCard title="Thiết bị theo đơn vị">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis domain={[0, total]} allowDecimals={false} />
          <Tooltip formatter={(value) => `${value} thiết bị`} />
          <Bar dataKey="value" fill="#1890ff">
            <LabelList dataKey="value" position="top" formatter={(v) => `${v} thiết bị`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </MainCard>
  );
}
