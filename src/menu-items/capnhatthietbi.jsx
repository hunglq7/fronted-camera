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
          id: 'vattu',
          title: 'Danh mục vật tư',
          type: 'item',
          url: '/danhmuc/danhmucvattu'
        }
      ]
    },
    {
      id: 'thietbi',
      title: 'Thiết bị',
      type: 'collapse',
      icon: <i className="ph ph-map-trifold" />,
      children: [
        {
          id: 'camera',
          title: 'Cập nhật máy cào',
          type: 'item',
          url: '/thietbi/capnhatcamera'
        }
      ]
    }
  ]
};

export default capnhatthietbi;
