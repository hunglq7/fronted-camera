import { Card, Statistic } from 'antd';
import MainCard from '/src/components/MainCard';
export default function StatCard({ title, value, color }) {
  return (
    <Card>
      <Statistic title={title} value={value} style={{ color }} />
    </Card>
  );
}
