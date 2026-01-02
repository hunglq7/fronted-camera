import React, { useEffect, useMemo, useState } from 'react';
import { Table, Button, Popconfirm, message, Space, Form, Modal, Row } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import SearchBar from '/src/components/SearchBar';
import ActionBar from '/src/components/ActionBar';
import KhuvucForm from '/src/sections/khuvuc/KhuvucForm';
import { useKhuVucStore } from '/src/stores/khuvucStore';

function Danhmuckhuvuc() {
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  const { khuvucs, loading, fetchKhuVucs, createKhuVuc, updateKhuVuc, deleteKhuVuc, deleteManyKhuVuc } = useKhuVucStore();

  /** LOAD DATA */
  useEffect(() => {
    fetchKhuVucs();
  }, [fetchKhuVucs]);

  const dataSource = useMemo(() => khuvucs.map((item) => ({ ...item, key: item._id })), [khuvucs]);
  console.log('Khu vực', dataSource);
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
    console.log(record);
    setEditing(record);
    form.setFieldsValue({
      tenkv: record.tenkv
    });
    setOpenModal(true);
  };

  /** SUBMIT */
  const handleSubmit = async (values) => {
    try {
      if (editing) {
        await updateKhuVuc(editing._id, values);
        message.success('Cập nhật thành công');
      } else {
        await createKhuVuc(values);
        message.success('Thêm mới thành công');
      }
      setOpenModal(false);
      fetchKhuVucs();
    } catch (err) {
      console.error('UPDATE ERROR:', err);
      message.error('Lưu dữ liệu thất bại');
    }
  };

  /** DELETE */
  const handleDelete = async (i) => {
    console.log(i);
    await deleteKhuVuc(i);
    fetchKhuVucs();
    message.success('Xóa thành công');
  };

  /** DELETE MULTIPLE */
  const handleDeleteMultiple = async () => {
    if (!selectedRowKeys.length) {
      message.warning('Chưa chọn bản ghi');
      return;
    }
    await deleteManyKhuVuc(selectedRowKeys);
    setSelectedRowKeys([]);
    fetchKhuVucs();
    message.success('Xóa nhiều bản ghi thành công');
  };

  /** EXPORT EXCEL */
  const handleExportExcel = () => {
    const exportData = filteredData.map((item, index) => ({
      STT: index + 1,
      'Tên khu vực': item.tenkv
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Khu-Vuc');
    XLSX.writeFile(wb, 'Danh-muc-khu-vuc.xlsx');
  };

  const columns = [
    { title: 'Tên khu vực', dataIndex: 'tenkv' },
    {
      title: 'Thao tác',
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
        title={editing ? 'Cập nhật khu vực' : 'Thêm mới khu vực'}
        footer={null}
        onCancel={() => setOpenModal(false)}
        zIndex={1500}
      >
        <KhuvucForm form={form} onSubmit={handleSubmit} onCancel={() => setOpenModal(false)} />
      </Modal>
    </>
  );
}

export default Danhmuckhuvuc;
