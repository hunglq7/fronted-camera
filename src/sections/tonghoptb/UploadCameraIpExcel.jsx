import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useTongHopTbStore } from '/src/stores/tonghoptbStore';

export default function UploadCameraIpExcel() {
  const { uploadCameraIpExcel } = useTongHopTbStore();

  return (
    <Upload
      accept=".xlsx,.xls"
      showUploadList={false}
      customRequest={async ({ file, onSuccess, onError }) => {
        try {
          const res = await uploadCameraIpExcel(file);
          message.success(res.message);
          onSuccess();
        } catch (err) {
          message.error('Upload thất bại');
          onError(err);
        }
      }}
    >
      <Button icon={<UploadOutlined />}>Upload Excel đối chiếu Camera IP</Button>
    </Upload>
  );
}
