import React, { useEffect, useMemo, useState } from 'react';
import { Table, Button, Popconfirm, message, Space, Form, Modal, Row, Tag, Badge, Col, Select } from 'antd';
import { EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import StatCard from '/src/components/dashboard/StatCard';
import StatusPieChart from '/src/components/dashboard/StatusPieChart';
import DeviceByDonViChart from '/src/components/dashboard/DeviceByDonViChart';
import RecentDeviceTable from '/src/components/dashboard/RecentDeviceTable';
import DeviceByKhuVucChart from '/src/components/dashboard/DeviceByKhuVucChart';
import DeviceByNgaySDChart from '/src/components/dashboard/DeviceByNgaySDChart';

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
  }, []);

  const dataSource = useMemo(() => tonghoptbs, [tonghoptbs]);

  //Recharts
  // 1️⃣ Tổng số
  const total = tonghoptbs.length;

  // 2️⃣ Theo trạng thái

  const statusStats = useMemo(() => {
    const map = { 'Trực tuyến': 0, 'Ngoại tuyến': 0 };

    tonghoptbs.forEach((i) => {
      i.trangthai ? map['Trực tuyến']++ : map['Ngoại tuyến']++;
    });

    return Object.entries(map).map(([name, value]) => ({
      name,
      value // Giữ giá trị tuyệt đối (tổng số thiết bị)
    }));
  }, [tonghoptbs]);

  // 3️⃣ Theo đơn vị
  const donviStats = useMemo(() => {
    const map = {};

    tonghoptbs.forEach((i) => {
      const name = i.donvi_id?.tendv || 'Khác';
      map[name] = (map[name] || 0) + 1;
    });

    return Object.entries(map).map(([name, value]) => ({
      name,
      value  // Giữ giá trị tuyệt đối (tổng số thiết bị theo đơn vị)
    }));
  }, [tonghoptbs]);

  // Theo Khu vực
  const khuvucStats = useMemo(() => {
    const map = {};

    tonghoptbs.forEach((i) => {
      const name = i.khuvuc_id?.tenkv || 'Chưa phân khu';
      map[name] = (map[name] || 0) + 1;
    });

    const statsArray = Object.entries(map).map(([name, value]) => ({
      name,
      value // Giữ giá trị tuyệt đối cho Y-axis
    }));

    // Tính % của mỗi khu vực so với tổng thiết bị theo khu vực
    const totalByKhuvuc = statsArray.reduce((sum, item) => sum + item.value, 0);
    return statsArray.map((item) => ({
      ...item,
      percentage: totalByKhuvuc > 0 ? Math.round((item.value / totalByKhuvuc) * 100) : 0
    }));
  }, [tonghoptbs]);

  //Biểu đồ theo năm sử dụng
  //2️⃣ State năm đang chọn
  const currentYear = dayjs().year();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  //3️⃣ Danh sách năm (tự động sinh)
  const yearOptions = useMemo(() => {
    const years = new Set();

    tonghoptbs.forEach((i) => {
      if (i.ngaysd) {
        years.add(dayjs(i.ngaysd).year());
      }
    });

    return Array.from(years).sort((a, b) => b - a);
  }, [tonghoptbs]);

  const ngaysdStats = useMemo(() => {
    const map = {};

    tonghoptbs.forEach((i) => {
      if (!i.ngaysd) return;

      const year = dayjs(i.ngaysd).year();
      if (year !== selectedYear) return; // 🔥 FILTER NĂM

      const key = dayjs(i.ngaysd).format('MM/YYYY');
      map[key] = (map[key] || 0) + 1;
    });

    return Object.entries(map)
      .map(([name, value]) => ({
        name,
        value // Giữ giá trị tuyệt đối (tổng số thiết bị theo tháng trong năm)
      }))
      .sort((a, b) => {
        const [m1, y1] = a.name.split('/');
        const [m2, y2] = b.name.split('/');
        return new Date(y1, m1 - 1) - new Date(y2, m2 - 1);
      });
  }, [tonghoptbs, selectedYear]);

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
      'Tên thiết bị': item.tentb,
      'Đơn vị': item.tendv,
      'Khu vực': item.tenkv,
      'Địa chỉ Camera': item.camera_ip,
      'Tình trạng': item.trangthai,
      'Ngày SD': item.ngaysd,
      'Vị trí lắp': item.vitri_lapdat,
      'Ghi chú': item.ghichu
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tong-Hop_Thiet_Bi');
    XLSX.writeFile(wb, 'Tong-hop-thiet-bi.xlsx');
  };

  const columns = [
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
    { title: 'Mã quản lý', dataIndex: 'maql' },
    {
      title: 'Tên thiết bị',
      render: (_, r) => r.thietbi_id?.tentb
    },
    {
      title: 'Đơn vị',
      render: (_, r) => r.donvi_id?.tendv
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
    { title: 'Ghi chú', dataIndex: 'ghichu' },
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
      {/* KPI */}
      <Row gutter={16}>
        <Col span={6}>
          <StatCard title="Tổng thiết bị" value={total} />
        </Col>
        <Col span={6}>
          <StatCard title="Trực tuyến" value={statusStats[0]?.value} color={{ content: { color: '#3f8600' } }} />
        </Col>
        <Col span={6}>
          <StatCard title="Ngoại tuyến" value={statusStats[1]?.value} color={{ content: { color: '#cf1322' } }} />
        </Col>
        <Col span={6}>
          <StatCard title="Tỷ lệ thiết bị trực tuyến" value={`${Math.round((statusStats[0]?.value / total) * 100 || 0)}%`} />
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={12}>
          <StatusPieChart data={statusStats} />
        </Col>
        <Col span={12}>
          <DeviceByDonViChart data={donviStats} />
        </Col>
        <Col span={12}>
          <DeviceByKhuVucChart data={khuvucStats} />
        </Col>
        <Col span={12}>
          <Row justify="end" style={{ marginBottom: 12 }}>
            <Col>
              <Select
                value={selectedYear}
                onChange={setSelectedYear}
                style={{ width: 120 }}
                options={yearOptions.map((y) => ({
                  label: `Năm ${y}`,
                  value: y
                }))}
              />
            </Col>
          </Row>
          <DeviceByNgaySDChart data={ngaysdStats} />
        </Col>
      </Row>

      {/* Table */}
      {/* <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <RecentDeviceTable data={tonghoptbs} />
        </Col>
      </Row> */}

      <Row gutter={8} style={{ marginBottom: 12, marginTop: 12 }}>
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
