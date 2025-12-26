import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from 'recharts';
import MainCard from '/src/components/MainCard';
import { Card } from 'antd';

const COLORS = ['#52c41a', '#faad14'];

export default function StatusPieChart({ data }) {
  return (
    <MainCard title="Thiết bị theo trạng thái">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" label>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </MainCard>
  );
}
