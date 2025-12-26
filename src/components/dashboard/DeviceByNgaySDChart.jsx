import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { Card, Typography } from 'antd';
import MainCard from '/src/components/MainCard';
export default function DeviceByNgaySDChart({ data }) {
  const total = data.reduce((sum, i) => sum + i.value, 0);

  return (
    <MainCard>
      <Typography.Title level={5}>Thiết bị theo thời gian sử dụng (Tổng: {total})</Typography.Title>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip formatter={(v) => [`${v} thiết bị`, 'Số lượng']} />

          <Bar dataKey="value" fill="#13c2c2">
            <LabelList dataKey="value" position="top" formatter={(v) => `${v} thiết bị`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </MainCard>
  );
}
