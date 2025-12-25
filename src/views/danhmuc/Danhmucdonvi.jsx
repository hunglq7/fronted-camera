import React, { useEffect, useMemo, useState } from 'react';
import { Table, Form, Input, Button, Space, Popconfirm, message, Row } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

import SearchBar from '/src/components/SearchBar';
import ActionBar from '/src/components/ActionBar';
import { useDonViStore } from '/src/stores/donviStore';

/* ================= Editable Cell ================= */
const EditableCell = ({ editing, dataIndex, record, children, ...rest }) => (
  <td {...rest}>
    {editing ? (
      <Form.Item name={[record.key, dataIndex]} rules={[{ required: true, message: 'Không được để trống' }]} style={{ margin: 0 }}>
        <Input />
      </Form.Item>
    ) : (
      children
    )}
  </td>
);

export default function Danhmucdonvi() {
  const { donvis, fetchDonVis, createDonVi, updateDonVi, deleteDonVi, deleteMany, loading } = useDonViStore();

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    fetchDonVis();
  }, []);

  /* ================= DATASOURCE ================= */
  const dataSource = useMemo(
    () =>
      donvis.map((i) => ({
        ...i,
        key: i.key ?? i.id
      })),
    [donvis]
  );

  /* ================= EDIT ================= */
  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      // [record.key]: { tendv: record.tendv }
      tendv: record.tendv
    });
    setEditingKey(record.key);
  };

  // ================= CANCEL =================

  const cancel = () => setEditingKey('');

  // ================= SAVE =================
  const save = async (key) => {
    try {
      const values = await form.validateFields();
      const row = values[key];
      if (!row) return;

      const record = dataSource.find((i) => i.key === key);

      if (record.isNew) {
        await createDonVi(row);
        message.success('Thêm thành công');
      } else {
        await updateDonVi(record.id, row);
        message.success('Cập nhật thành công');
      }

      setEditingKey('');
      fetchDonVis();
    } catch {
      message.error('Lưu thất bại');
    }
  };

  /* ================= ADD ================= */
  const handleAdd = () => {
    if (editingKey) return message.warning('Đang chỉnh sửa dòng khác');

    const key = `new_${Date.now()}`;
    const newRow = {
      key,
      id: null,
      tendv: '',
      isNew: true
    };

    useDonViStore.setState({
      donvis: [newRow, ...donvis]
    });

    form.setFieldsValue({
      [key]: { tendv: '' }
    });

    setEditingKey(key);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (record) => {
    if (record.isNew) {
      useDonViStore.setState({
        donvis: donvis.filter((i) => i.key !== record.key)
      });
      return;
    }
    await deleteDonVi(record.id);
    message.success('Đã xóa');
  };

  /* ================= DELETE MANY ================= */
  const handleDeleteMultiple = async () => {
    if (!selectedRowKeys.length) {
      return message.warning('Chưa chọn dòng nào');
    }

    const ids = dataSource
      .filter((i) => selectedRowKeys.includes(i.key))
      .map((i) => i.id)
      .filter(Boolean);

    await deleteMany(ids);
    setSelectedRowKeys([]);
    message.success(`Đã xóa ${ids.length} dòng`);
  };

  /* ================= SEARCH ================= */
  const filteredData = useMemo(() => {
    if (!searchText) return dataSource;
    return dataSource.filter((i) => i.tendv?.toLowerCase().includes(searchText.toLowerCase()));
  }, [dataSource, searchText]);

  /* ================= EXPORT ================= */
  const handleExportExcel = () => {
    const data = filteredData.map((i, idx) => ({
      STT: idx + 1,
      'Tên đơn vị': i.tendv
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = [{ wch: 5 }, { wch: 30 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DanhMucDonVi');
    XLSX.writeFile(wb, 'Danh_muc_don_vi.xlsx');
  };

  /* ================= COLUMNS ================= */
  const mergedColumns = [
    {
      title: 'Tên đơn vị',
      dataIndex: 'tendv',
      editable: true
    },
    {
      title: 'Hành động',
      width: 150,
      render: (_, record) =>
        isEditing(record) ? (
          <Space>
            <Button type="primary" icon={<SaveOutlined />} onClick={() => save(record.key)} />
            <Button icon={<CloseOutlined />} onClick={cancel} />
          </Space>
        ) : (
          <Space>
            <Button icon={<EditOutlined />} disabled={!!editingKey} onClick={() => edit(record)} />
            <Popconfirm title="Xóa?" onConfirm={() => handleDelete(record)}>
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        )
    }
  ].map((col) =>
    col.editable
      ? {
          ...col,
          onCell: (record) => ({
            record,
            dataIndex: col.dataIndex,
            editing: isEditing(record)
          })
        }
      : col
  );

  return (
    <Form form={form} component={false} preserve={false}>
      <Row gutter={8} style={{ marginBottom: 12 }}>
        <SearchBar onSearch={setSearchText} />
        <ActionBar
          handleOpenAdd={handleAdd}
          onDeleteMultiple={handleDeleteMultiple}
          disabledDelete={!selectedRowKeys.length}
          handleExportExcel={handleExportExcel}
        />
      </Row>

      <Table
        rowKey="key"
        components={{ body: { cell: EditableCell } }}
        bordered
        loading={loading}
        dataSource={filteredData}
        columns={mergedColumns}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys
        }}
        pagination={{ pageSize: 10 }}
      />
    </Form>
  );
}
