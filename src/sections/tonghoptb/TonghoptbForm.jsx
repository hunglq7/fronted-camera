import { Form, Input, Select, DatePicker, Switch, Button, Space } from 'antd';
import dayjs from 'dayjs';
import { SaveOutlined } from '@ant-design/icons';

const { TextArea } = Input;

export default function TonghoptbForm({ form, onSubmit, onCancel, thietbiList = [], donviList = [], khuvucList = [] }) {
  return (
    <Form form={form} layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 17 }} onFinish={onSubmit}>
      <Form.Item name="thietbi_id" label="Thiết bị" rules={[{ required: true }]}>
        <Select placeholder="Chọn thiết bị" allowClear>
          {thietbiList.map((i) => (
            <Select.Option key={i._id} value={i._id}>
              {i.tentb}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="donvi_id" label="Đơn vị" rules={[{ required: true }]}>
        <Select placeholder="Chọn đơn vị" allowClear>
          {donviList.map((i) => (
            <Select.Option key={i._id} value={i._id}>
              {i.tendv}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="khuvuc_id" label="Khu vực" rules={[{ required: true }]}>
        <Select placeholder="Chọn khu vực" allowClear>
          {khuvucList.map((i) => (
            <Select.Option key={i._id} value={i._id}>
              {i.tenkv}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="camera_ip" label="IP Camera">
        <Input />
      </Form.Item>

      <Form.Item name="ngaysd" label="Ngày sử dụng">
        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
      </Form.Item>

      <Form.Item name="vitri_lapdat" label="Vị trí lắp">
        <Input />
      </Form.Item>

      <Form.Item name="trangthai" label="Tình trạng" valuePropName="checked">
        <Switch checkedChildren="Trực tuyến" unCheckedChildren="Ngoại tuyến" />
      </Form.Item>

      <Form.Item name="ghichu" label="Ghi chú">
        <TextArea rows={3} />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 6 }}>
        <Space>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
            Lưu
          </Button>
          <Button onClick={onCancel}>Hủy</Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
