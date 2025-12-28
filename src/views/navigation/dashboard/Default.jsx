// react-bootstrap
import React, { useEffect, useMemo, useState } from 'react';
import { Select } from 'antd';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useTongHopTbStore } from '/src/stores/tonghoptbStore';
import StatCard from '/src/components/dashboard/StatCard';
import RecentDeviceTable from '/src/components/dashboard/RecentDeviceTable';
import DeviceByDonViChart from '/src/components/dashboard/DeviceByDonViChart';
import DeviceByNgaySDChart from '/src/components/dashboard/DeviceByNgaySDChart';
import DeviceByKhuVucChart from '/src/components/dashboard/DeviceByKhuVucChart';
import StatusPieChart from '/src/components/dashboard/StatusPieChart';
import dayjs from 'dayjs';

export default function DefaultPage() {
  const { tonghoptbs, fetchTongHopTbs } = useTongHopTbStore();

  // ===============================|| BIỂU ĐỒ THEO ĐƠN VỊ ||============================== //
  const donviStats = useMemo(() => {
    const map = {};

    tonghoptbs.forEach((i) => {
      const name = i.donvi_id?.tendv || 'Khác';
      map[name] = (map[name] || 0) + 1;
    });

    return Object.entries(map).map(([name, value]) => ({
      name,
      value // Giữ giá trị tuyệt đối (tổng số thiết bị theo đơn vị)
    }));
  }, [tonghoptbs]);

  // ===============================|| BIỂU ĐỒ THEO NGÀY SỬ DỤNG ||============================== //
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

  // ===============================|| BIỂU ĐỒ THEO KHU VỰC ||============================== //
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

  /** LOAD DATA */
  useEffect(() => {
    fetchTongHopTbs();
  }, [fetchTongHopTbs]);
  const total = tonghoptbs.length;

  const statusStats = useMemo(() => {
    const map = { 'Trực tuyến': 0, 'Ngoại tuyến': 0 };

    tonghoptbs.forEach((i) => {
      i.trangthai ? map['Trực tuyến']++ : map['Ngoại tuyến']++;
    });

    return Object.entries(map).map(([name, value]) => ({
      name,
      value
    }));
  }, [tonghoptbs]);
  return (
    <Row>
      <Row gutter={16}>
        <Col span={6}>
          <StatCard title="Tổng thiết bị" value={total} color={{ content: { color: '#0000FF' } }} />
        </Col>
        <Col span={6}>
          <StatCard title="Trực tuyến" value={statusStats[0]?.value} color={{ content: { color: '#3f8600' } }} />
        </Col>
        <Col span={6}>
          <StatCard title="Ngoại tuyến" value={statusStats[1]?.value} color={{ content: { color: '#FF9900' } }} />
        </Col>
        <Col span={6}>
          <StatCard
            title="Tỷ lệ thiết bị trực tuyến"
            value={`${Math.round((statusStats[0]?.value / total) * 100 || 0)}%`}
            color={{ content: { color: '#0000FF' } }}
          />
        </Col>
      </Row>

      <Row className="mt-3">
        <Col span={12}>
          <RecentDeviceTable data={tonghoptbs} />
        </Col>
        <Col span={12}>
          <DeviceByDonViChart data={donviStats} />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col span={{ xs: 24, md: 12 }}>
          <StatusPieChart data={statusStats} />
        </Col>
        <Col span={{ xs: 24, md: 12 }}>
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
      <Row>
        <Col span={24}>
          <DeviceByKhuVucChart data={khuvucStats} />
        </Col>
      </Row>
    </Row>
  );
}
