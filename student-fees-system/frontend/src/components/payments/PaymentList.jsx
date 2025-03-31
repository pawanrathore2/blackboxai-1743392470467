import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPayments } from '../../store/slices/paymentSlice';
import { Table, Spin, Alert, Button, Modal, Tag } from 'antd';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';
import PaymentForm from './PaymentForm';
import Receipt from './Receipt';

const PaymentList = () => {
  const dispatch = useDispatch();
  const { payments, loading, error } = useSelector(state => state.payments);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    dispatch(fetchPayments());
  }, [dispatch]);

  const handleFormSuccess = () => {
    setIsModalVisible(false);
    dispatch(fetchPayments());
  };

  const columns = [
    {
      title: 'Student ID',
      dataIndex: 'studentId',
      key: 'studentId',
    },
    {
      title: 'Fee',
      dataIndex: 'fee',
      key: 'fee',
      render: (fee) => fee.course
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `$${amount.toFixed(2)}`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Payment Date',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button type="link">View Details</Button>
      )
    }
  ];

  if (error) return <Alert message="Error loading payments" type="error" showIcon />;

  return (
    <div className="payment-list-container">
      <div className="payment-list-header">
        <h2>Payment Management</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Record Payment
        </Button>
      </div>

      <Modal
        title="Record New Payment"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <PaymentForm 
          onSuccess={handleFormSuccess}
          onCancel={() => setIsModalVisible(false)}
        />
      </Modal>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={payments}
          rowKey="id"
        />
      </Spin>
    </div>
  );
};

export default PaymentList;