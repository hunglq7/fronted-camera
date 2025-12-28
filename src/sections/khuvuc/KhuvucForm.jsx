import React from 'react';
import { SaveOutlined } from '@ant-design/icons';
import { Input, Form, Flex, Space, Button } from 'antd';

function KhuvucForm({ onSubmit, form, onCancel }) {
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
      <Form.Item name="tenkv" label="Tên khu vực" rules={[{ required: true, message: 'Tên khu vực không được để trống' }]}>
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

export default KhuvucForm;
