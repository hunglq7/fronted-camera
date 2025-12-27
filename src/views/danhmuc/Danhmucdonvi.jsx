import React, { useEffect, useMemo, useState } from 'react';
import { Table, Button, Popconfirm, message, Space, Form, Modal, Row } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import SearchBar from '/src/components/SearchBar';
import ActionBar from '/src/components/ActionBar';
import DonviForm from '/src/sections/donvi/DonviForm';
import { useDonViStore } from '/src/stores/donviStore';

function Danhmucdonvi() {
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  const { donvis, loading, fetchDonVis, createDonVi, updateDonVi, deleteDonVi, deleteManyDonVi } = useDonViStore();

  /** LOAD DATA */
  useEffect(() => {
    fetchDonVis();
  }, [fetchDonVis]);

  const dataSource = useMemo(() => donvis.map((item) => ({ ...item, key: item._id })), [donvis]);

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
      tendv: record.tendv
    });
    setOpenModal(true);
  };

  /** SUBMIT */
  const handleSubmit = async (values) => {
    try {
      if (editing) {
        await updateDonVi(editing._id, values);
        message.success('Cập nhật thành công');
      } else {
        await createDonVi(values);
        message.success('Thêm mới thành công');
      }
      setOpenModal(false);
      fetchDonVis();
    } catch (err) {
      console.error('UPDATE ERROR:', err);
      message.error('Lưu dữ liệu thất bại');
    }
  };

  /** DELETE */
  const handleDelete = async (i) => {
    await deleteDonVi(i);
    fetchDonVis();
    message.success('Xóa thành công');
  };

  /** DELETE MULTIPLE */
  const handleDeleteMultiple = async () => {
    if (!selectedRowKeys.length) {
      message.warning('Chưa chọn bản ghi');
      return;
    }
    await deleteManyDonVi(selectedRowKeys);
    setSelectedRowKeys([]);
    fetchDonVis();
    message.success('Xóa nhiều bản ghi thành công');
  };

  /** EXPORT EXCEL */
  const handleExportExcel = () => {
    const exportData = filteredData.map((item, index) => ({
      STT: index + 1,
      'Tên đơn vị': item.tendv
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Don-Vi');
    XLSX.writeFile(wb, 'Danh-muc-don-vi.xlsx');
  };

  const columns = [
    { title: 'Tên đơn vị', dataIndex: 'tendv' },
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
        rowKey="key"
        loading={loading}
        columns={columns}
        dataSource={filteredData}
        selectedRowKeys={selectedRowKeys}
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
      />

      <Modal
        open={openModal}
        title={editing ? 'Cập nhật đơn vị' : 'Thêm mới đơn vị'}
        footer={null}
        onCancel={() => setOpenModal(false)}
        zIndex={1500}
      >
        <DonviForm form={form} onSubmit={handleSubmit} onCancel={() => setOpenModal(false)} />
      </Modal>
    </>
  );
}

export default Danhmucdonvi;
