import { Table, Tag, Card } from 'antd';
import dayjs from 'dayjs';

export default function RecentDeviceTable({ data }) {
  const columns = [
    { title: 'Thiết bị', render: (_, r) => r.thietbi_id?.tentb },
    { title: 'Đơn vị', render: (_, r) => r.donvi_id?.tendv },
    {
      title: 'Trạng thái',
      render: (_, r) => <Tag color={r.trangthai ? 'green' : 'orange'}>{r.trangthai ? 'Đang dùng' : 'Dự phòng'}</Tag>
    },
    {
      title: 'Ngày SD',
      render: (_, r) => (r.ngaysd ? dayjs(r.ngaysd).format('DD/MM/YYYY') : '')
    }
  ];

  return (
    <Card title="Thiết bị gần đây">
      <Table rowKey="_id" columns={columns} dataSource={data.slice(0, 5)} pagination={false} />
    </Card>
  );
}
