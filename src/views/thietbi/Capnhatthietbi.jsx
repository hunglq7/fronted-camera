import React, { useEffect, useMemo, useState } from 'react';
import { Table, Button, Popconfirm, message, Space, Form, Modal, Row, Tag, Badge, Col, Select } from 'antd';
import { EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import SearchBar from '/src/components/SearchBar';
import ActionBar from '/src/components/ActionBar';
import TonghoptbForm from '/src/sections/tonghoptb/TonghoptbForm';
import { useTongHopTbStore } from '/src/stores/tonghoptbStore';
import { useDonViStore } from '/src/stores/donviStore';
import { useThietBiStore } from '/src/stores/thietbiStore';
import { useKhuVucStore } from '/src/stores/khuvucStore';
function Capnhatthietbi() {
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  const { tonghoptbs, loading, fetchTongHopTbs, createTongHopTb, updateTongHopTb, deleteTongHopTb, deleteManyTongHopTb } =
    useTongHopTbStore();
  const { donvis, fetchDonVis } = useDonViStore();
  const { khuvucs, fetchKhuVucs } = useKhuVucStore();
  const { thietbis, fetchThietBis } = useThietBiStore();

  /** LOAD DATA */
  useEffect(() => {
    fetchTongHopTbs();
    fetchDonVis();
    fetchKhuVucs();
    fetchThietBis();
  }, [fetchTongHopTbs, fetchDonVis, fetchKhuVucs, fetchThietBis]);

  const dataSource = useMemo(() => tonghoptbs, [tonghoptbs]);

  /** SEARCH */
  const normalize = (v) => (v ?? '').toString().toLowerCase();
  const filteredData = useMemo(() => {
    if (!searchText) return dataSource;

    const keyword = searchText.toLowerCase();

    return dataSource.filter((item) =>
      [
        item.maql,
        item.thietbi_id?.tentb,
        item.donvi_id?.tendv,
        item.loaitb,
        item.khuvuc_id?.tenkv,
        item.camera_ip,
        item.vitri_lapdat,
        item.ghichu,
        item.trangthai ? 'trực tuyến' : 'ngoại tuyến',
        item.trangthai ? 'Trực tuyến' : 'Ngoại tuyến'
      ]
        .map(normalize)
        .some((v) => v.includes(keyword))
    );
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
      maql: record.maql,
      thietbi_id: record.thietbi_id?._id,
      loaitb: record.loaitb,
      donvi_id: record.donvi_id?._id,
      khuvuc_id: record.khuvuc_id?._id,
      camera_ip: record.camera_ip,
      trangthai: record.trangthai,
      ngaysd: record.ngaysd ? dayjs(record.ngaysd) : null,
      vitri_lapdat: record.vitri_lapdat,
      ghichu: record.ghichu
    });
    setOpenModal(true);
  };

  /** SUBMIT */
  const handleSubmit = async (values) => {
    try {
      if (editing) {
        await updateTongHopTb(editing._id, values);
        message.success('Cập nhật thành công');
      } else {
        await createTongHopTb(values);
        message.success('Thêm mới thành công');
      }
      setOpenModal(false);
      fetchTongHopTbs();
    } catch (err) {
      console.error('UPDATE ERROR:', err);
      message.error('Lưu dữ liệu thất bại');
    }
  };

  /** DELETE */
  const handleDelete = async (i) => {
    await deleteTongHopTb(i);
    fetchTongHopTbs();
    message.success('Xóa thành công');
  };

  /** DELETE MULTIPLE */
  const handleDeleteMultiple = async () => {
    if (!selectedRowKeys.length) return;

    await deleteManyTongHopTb(selectedRowKeys);
    setSelectedRowKeys([]); // 🔥 reset
    fetchTongHopTbs();
    message.success('Xóa nhiều bản ghi thành công');
  };

  /** EXPORT EXCEL */
  const handleExportExcel = () => {
    const exportData = filteredData.map((item, index) => ({
      STT: index + 1,
      'Mã quản lý': item.maql,
      'Tên thiết bị': item.thietbi_id?.tentb,
      'Loại thiết bị': item.loaitb,
      'Đơn vị': item.donvi_id?.tendv,
      'Khu vực': item.khuvuc_id?.tenkv,
      'Địa chỉ Camera': item.camera_ip,
      'Tình trạng': item.trangthai ? 'Trực tuyến' : 'Ngoại tuyến',
      'Ngày SD': item.ngaysd ? dayjs(item.ngaysd).format('DD/MM/YYYY') : '',
      'Vị trí lắp': item.vitri_lapdat,
      'Ghi chú': item.ghichu
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData, {
      header: [
        'STT',
        'Mã quản lý',
        'Tên thiết bị',
        'Loại thiết bị',
        'Đơn vị',
        'Khu vực',
        'Địa chỉ Camera',
        'Tình trạng',
        'Ngày SD',
        'Vị trí lắp',
        'Ghi chú'
      ]
    });
    worksheet['!cols'] = [
      { wch: 3 },
      { wch: 10 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 16 },
      { wch: 16 },
      { wch: 15 },
      { wch: 15 },
      { wch: 22 },
      { wch: 16 }
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tonghopthietbi');
    XLSX.writeFile(workbook, 'Tong-hop-thiet-bi.xlsx');
  };

  const columns = [
    { title: 'Mã quản lý', dataIndex: 'maql', fixed: 'start', width: 100 },
    {
      title: 'Đơn vị',
      fixed: 'start',
      width: 100,
      render: (_, r) => r.donvi_id?.tendv
    },
    {
      title: 'Tên thiết bị',
      render: (_, r) => r.thietbi_id?.tentb
    },
    {
      title: 'Loại thiết bị',
      render: (_, r) => {
        if (r.loaitb === 'camera_thuong') return 'Camera thường';
        if (r.loaitb === 'camera_ai') return 'Camera AI';
        return r.loaitb;
      }
    },

    {
      title: 'Khu vực',
      render: (_, r) => r.khuvuc_id?.tenkv
    },
    { title: 'IP Camera', dataIndex: 'camera_ip' },

    {
      title: 'Ngày lắp ',
      dataIndex: 'ngaysd',
      key: 'ngaysd',
      render: (value) => (value ? dayjs(value).format('DD/MM/YYYY') : '')
    },
    { title: 'Vị trí lắp', dataIndex: 'vitri_lapdat' },
    {
      title: 'Tình trạng',
      render: (_, r) => (
        <Tag
          variant="solid"
          icon={r.trangthai ? <CheckCircleOutlined /> : <CloseCircleOutlined spin />}
          color={r.trangthai ? 'green' : 'red'}
        >
          {r.trangthai ? 'Trực tuyến' : 'Ngoại tuyến'}
        </Tag>
      )
    },
    { title: 'Ghi chú', dataIndex: 'ghichu' },
    {
      title: 'Thao tác',
      key: 'operation',
      fixed: 'end',
      width: 100,
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
      <Row gutter={{ xs: 6, md: 8 }} style={{ marginBottom: 12, marginTop: 12 }}>
        <SearchBar onSearch={setSearchText} />

        <ActionBar
          handleOpenAdd={handleOpenAdd}
          onDeleteMultiple={handleDeleteMultiple}
          disabledDelete={!selectedRowKeys.length}
          handleExportExcel={handleExportExcel}
        />
      </Row>

      <Row style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Tag variant="outlined" color="blue">
            Tổng số: {filteredData.length} thiết bị
          </Tag>
        </Col>
      </Row>

      <Table
        rowKey="_id"
        loading={loading}
        columns={columns}
        dataSource={filteredData}
        selectedRowKeys={selectedRowKeys}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => {
            setSelectedRowKeys(keys);
          }
        }}
      />

      <Modal
        open={openModal}
        title={editing ? 'Cập nhật thiết bị' : 'Thêm mới thiết bị'}
        footer={null}
        onCancel={() => setOpenModal(false)}
        zIndex={1500}
      >
        <TonghoptbForm
          form={form}
          donviList={donvis}
          khuvucList={khuvucs}
          thietbiList={thietbis}
          existingList={tonghoptbs}
          editing={editing}
          onSubmit={handleSubmit}
          onCancel={() => setOpenModal(false)}
        />
      </Modal>
    </>
  );
}

export default Capnhatthietbi;
