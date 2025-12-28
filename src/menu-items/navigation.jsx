const icons = { dashboard: <i className="ph ph-house-line" />, layouts: <i className="ph ph-house-line" /> };

const navigation = {
  id: 'group-dashboard-loading-unique',
  title: 'quản lý thiết bị',
  type: 'group',
  icon: icons.dashboard,
  children: [
    {
      id: 'dashboard',
      title: 'Bảng điều khiển',
      type: 'item',
      icon: icons.dashboard,
      url: '/'
    }
  ]
};

export default navigation;
