import { Button, Col, Popconfirm } from 'antd';

import { PlusOutlined, DownloadOutlined, DeleteFilled, UploadOutlined } from '@ant-design/icons';

export default function ActionBar({
  handleOpenAdd,
  onDeleteMultiple,
  selectedRowKeys = [],
  disabledDelete,
  handleExportExcel,
  uploadComponent,
  uploadCameraIpExcel
}) {
  // Determine count and disabled state. Support legacy `disabledDelete` boolean prop.
  const count = Array.isArray(selectedRowKeys) ? selectedRowKeys.length : undefined;
  const disabled = typeof disabledDelete === 'boolean' ? disabledDelete : count === undefined ? true : count === 0;
  const title = typeof count === 'number' ? `Bạn có chắc muốn xóa ${count} bản ghi đã chọn?` : 'Bạn có chắc muốn xóa các bản ghi đã chọn?';

  return (
    <>
      <Col>
        <Button icon={<PlusOutlined />} type="primary" onClick={handleOpenAdd}>
          Thêm mới
        </Button>
      </Col>

      <Col>
        <Popconfirm title={title} onConfirm={onDeleteMultiple} okText="Có" cancelText="Không" disabled={disabled}>
          <Button danger icon={<DeleteFilled />} disabled={disabled}>
            Xóa đã chọn
          </Button>
        </Popconfirm>
      </Col>

      <Col>
        <Button color="primary" variant="outlined" icon={<DownloadOutlined />} onClick={handleExportExcel}>
          Xuất Excel
        </Button>
      </Col>

      {uploadComponent && <Col>{uploadComponent}</Col>}
      {uploadCameraIpExcel && <Col>{uploadCameraIpExcel}</Col>}
    </>
  );
}
