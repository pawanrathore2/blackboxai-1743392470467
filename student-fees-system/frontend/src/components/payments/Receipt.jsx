import { Button, Descriptions, Modal } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';

const Receipt = ({ payment, visible, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      title="Payment Receipt"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="print" icon={<PrinterOutlined />} onClick={handlePrint}>
          Print Receipt
        </Button>,
        <Button key="close" onClick={onClose}>
          Close
        </Button>
      ]}
      width={700}
    >
      <div className="receipt-container">
        <h2 style={{ textAlign: 'center' }}>PAYMENT RECEIPT</h2>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Receipt Number">{payment?.receiptNumber}</Descriptions.Item>
          <Descriptions.Item label="Date">{new Date(payment?.paymentDate).toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="Student ID">{payment?.studentId}</Descriptions.Item>
          <Descriptions.Item label="Fee">{payment?.fee?.name}</Descriptions.Item>
          <Descriptions.Item label="Amount Paid">${payment?.amount?.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="Payment Method">{payment?.paymentMethod}</Descriptions.Item>
          <Descriptions.Item label="Reference">{payment?.reference || 'N/A'}</Descriptions.Item>
        </Descriptions>
      </div>
    </Modal>
  );
};

export default Receipt;