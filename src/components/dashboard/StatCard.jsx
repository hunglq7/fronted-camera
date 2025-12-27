import { Card, Statistic } from 'antd';
import { VideoCameraAddOutlined, VideoCameraOutlined } from '@ant-design/icons';
export default function StatCard({ title, value, color }) {
  return (
    <Card>
      <Statistic prefix={<VideoCameraOutlined />} title={title} value={value} styles={color} />
    </Card>
  );
}
