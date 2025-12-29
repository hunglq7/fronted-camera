import React, { useEffect, useMemo, useState } from 'react';
import { Table, Button, Popconfirm, message, Space, Form, Modal, Row, Flex } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import ThietbiUpload from '../../sections/thietbi/ThietbiUpload';
import SearchBar from '/src/components/SearchBar';
import ActionBar from '/src/components/ActionBar';
import ThietbiForm from '/src/sections/thietbi/ThietbiForm';
import { useThietBiStore } from '/src/stores/thietbiStore';

function DanhmucThietbi() {
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  const { thietbis, loading, fetchThietBis, createThietBi, updateThietBi, deleteThietBi, deleteManyThietBi } = useThietBiStore();

  /** LOAD DATA */
  useEffect(() => {
    fetchThietBis();
  }, [fetchThietBis]);

  const dataSource = useMemo(() => thietbis.map((item) => ({ ...item, key: item._id })), [thietbis]);

  /** SEARCH */
  const filteredData = useMemo(() => {
    if (!searchText) return dataSource;
    return dataSource.filter((item) => Object.values(item).join(' ').toLowerCase().includes(searchText.toLowerCase()));
  }, [dataSource, searchText]);

  /** ADD */
  const handleOpenAdd = () => {
    setEditing(null);
    form.resetFields();
    setOpenModal(true);
  };

  /** EDIT */
  const handleOpenEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      tentb: record.tentb,
      hangsx: record.hangsx,
      namsx: record.namsx,
      nuocsx: record.nuocsx,
      thongsokt: record.thongsokt,
      ghichu: record.ghichu
    });
    setOpenModal(true);
  };

  /** SUBMIT */
  const handleSubmit = async (values) => {
    try {
      if (editing) {
        await updateThietBi(editing._id, values);
        message.success('Cập nhật thành công');
      } else {
        await createThietBi(values);
        message.success('Thêm mới thành công');
      }
      setOpenModal(false);
      fetchThietBis();
    } catch (err) {
      console.error('UPDATE ERROR:', err);
      message.error('Lưu dữ liệu thất bại');
    }
  };

  /** DELETE */
  const handleDelete = async (i) => {
    await deleteThietBi(i);
    fetchThietBis();
    message.success('Xóa thành công');
  };

  /** DELETE MULTIPLE */
  const handleDeleteMultiple = async () => {
    if (!selectedRowKeys.length) {
      message.warning('Chưa chọn bản ghi');
      return;
    }
    await deleteManyThietBi(selectedRowKeys);
    setSelectedRowKeys([]);
    fetchThietBis();
    message.success('Xóa nhiều bản ghi thành công');
  };

  /** EXPORT EXCEL */
  const handleExportExcel = () => {
    const exportData = filteredData.map((item, index) => ({
      STT: index + 1,
      'Tên thiết bị': item.tentb,
      'Hãng SX': item.hangsx,
      'Năm SX': item.namsx,
      'Nước SX': item.nuocsx,
      'Thông số KT': item.thongsokt,
      'Ghi chú': item.ghichu
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ThietBi');
    XLSX.writeFile(wb, 'Danh-muc-thiet-bi.xlsx');
  };

  const columns = [
    { title: 'Tên thiết bị', dataIndex: 'tentb', fixed: 'start' },
    { title: 'Hãng SX', dataIndex: 'hangsx', fixed: 'start' },
    { title: 'Năm SX', dataIndex: 'namsx' },
    { title: 'Nước SX', dataIndex: 'nuocsx' },
    { title: 'Thông số KT', dataIndex: 'thongsokt' },
    { title: 'Ghi chú', dataIndex: 'ghichu' },
    {
      title: 'Thao tác',
      fixed: 'end',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleOpenEdit(record)} />
          <Popconfirm title="Xóa bản ghi?" onConfirm={() => handleDelete(record._id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <>
      <Row gutter={8} style={{ marginBottom: 12 }}>
        <SearchBar onSearch={setSearchText} />
        <ActionBar
          handleOpenAdd={handleOpenAdd}
          onDeleteMultiple={handleDeleteMultiple}
          selectedRowKeys={selectedRowKeys}
          disabledDelete={!selectedRowKeys.length}
          handleExportExcel={handleExportExcel}
          uploadComponent={<ThietbiUpload />}
        />
      </Row>

      <Table
        rowKey="_id"
        loading={loading}
        columns={columns}
        dataSource={filteredData}
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
      />

      <Modal
        open={openModal}
        title={editing ? 'Cập nhật thiết bị' : 'Thêm mới thiết bị'}
        footer={null}
        onCancel={() => setOpenModal(false)}
        zIndex={1500}
      >
        <ThietbiForm form={form} onSubmit={handleSubmit} onCancel={() => setOpenModal(false)} />
      </Modal>
    </>
  );
}

export default DanhmucThietbi;
