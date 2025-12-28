// ==============================|| MENU ITEMS - CHARTS & MAPS ||============================== //

const capnhatthietbi = {
  id: 'capnhatthietbi',
  title: 'Cập nhật thiết bị',
  type: 'group',
  children: [
    {
      id: 'danhmuc',
      title: 'Danh mục',
      type: 'collapse',
      icon: <i className="ph ph-chart-donut" />,
      children: [
        {
          id: 'donvi',
          title: 'Danh mục đơn vị',
          type: 'item',
          url: '/danhmuc/danhmucdonvi'
        },
        {
          id: 'thietbi',
          title: 'Danh mục thiết bị',
          type: 'item',
          url: '/danhmuc/danhmucthietbi'
        },
        {
          id: 'khuvuc',
          title: 'Danh mục khu vực',
          type: 'item',
          url: '/danhmuc/danhmuckhuvuc'
        }
      ]
    },
    {
      id: 'thietbi',
      title: 'Cập nhật thiết bị',
      type: 'collapse',
      icon: <i className="ph ph-map-trifold" />,
      children: [
        {
          id: 'camera',
          title: 'Cập nhật Camera',
          type: 'item',
          url: '/thietbi/capnhatthietbi'
        }
      ]
    }
  ]
};

export default capnhatthietbi;
