// ==============================|| MENU ITEMS - FORM ||============================== //

const formComponents = {
  id: 'forms',
  title: 'Forms',
  type: 'group',
  children: [
    {
      id: 'form-elements',
      title: 'Form Elements',
      type: 'collapse',
      icon: <i className="ph ph-textbox" />,
      children: [
        {
          id: 'form-basic',
          title: 'Form Basic',
          type: 'item',
          url: '/forms/form-elements/basic'
        },
        {
          id: 'form-avan',
          title: 'Form Avan',
          type: 'item',
          url: '/forms/form-elements/advan'
        }
      ]
    }
  ]
};

export default formComponents;
