import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import FormControls from 'sections/form-element/FormControls';
import FormMayxuc from '../../../sections/form-element/FormMayxuc';
export default function FormAdvan() {
  function themmoi() {
    alert('Thêm mới');
  }
  return (
    <>
      <Row>
        <Col xs={12}>
          <FormMayxuc
            title="Cập nhật máy xúc"
            email="Hộp thư"
            password="Mật khẩu"
            donvi="Đơn vị"
            noidung={'Nội dung'}
            onThemmoi={themmoi}
          />
        </Col>
      </Row>
    </>
  );
}
