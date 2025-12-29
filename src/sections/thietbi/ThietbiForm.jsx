import React from 'react';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Input, Form, Space, Button } from 'antd';
const { TextArea } = Input;

function ThietbiForm({ onSubmit, form, onCancel }) {
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 17 }
    }
  };

  return (
    <Form form={form} onFinish={onSubmit} {...formItemLayout} initialValues={{ remember: true }}>
      <Form.Item name="tentb" label="Tên thiết bị" rules={[{ required: true, message: 'Tên thiết bị không được để trống' }]}>
        <Input />
      </Form.Item>

      <Form.Item name="hangsx" label="Hãng sản xuất" rules={[{ required: true, message: 'Hãng sản xuất không được để trống' }]}>
        <Input />
      </Form.Item>

      <Form.Item name="namsx" label="Năm sản xuất" rules={[{ required: true, message: 'Năm sản xuất không được để trống' }]}>
        <Input />
      </Form.Item>

      <Form.Item name="nuocsx" label="Nước sản xuất" rules={[{ required: true, message: 'Nước sản xuất không được để trống' }]}>
        <Input />
      </Form.Item>

      <Form.Item name="thongsokt" label="Thông số KT" rules={[{ required: true, message: 'Thông số kỹ thuật không được để trống' }]}>
        <TextArea />
      </Form.Item>

      <Form.Item name="ghichu" label="Ghi chú">
        <Input />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6 }}>
        <Space>
          <Button
            type="primary"
            htmlType="submit" // 👈 gọi handleSubmit
            icon={<SaveOutlined />}
          >
            Lưu
          </Button>

          <Button
            color="danger"
            variant="outlined"
            icon={<CloseOutlined />}
            onClick={() => {
              form.resetFields(); // optional
              onCancel?.(); // 👈 đóng form
            }}
          >
            Hủy
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default ThietbiForm;
