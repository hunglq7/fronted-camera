import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useThietBiStore } from '../../stores/thietbiStore';

export default function ThietbiUpload() {
  const { uploadExcel } = useThietBiStore();

  const props = {
    name: 'excelFile',
    accept: '.xlsx,.xls',
    beforeUpload: (file) => {
      const isExcel =
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel';
      if (!isExcel) {
        message.error('Chỉ chấp nhận file Excel!');
        return false;
      }
      return true;
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        await uploadExcel(file);
        message.success('Upload thành công!');
        onSuccess();
      } catch (error) {
        message.error('Upload thất bại!');
        onError(error);
      }
    },
    showUploadList: false
  };

  return (
    <Upload {...props}>
      <Button icon={<UploadOutlined />}>Upload Excel</Button>
    </Upload>
  );
}
