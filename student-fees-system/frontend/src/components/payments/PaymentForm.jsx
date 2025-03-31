import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, Button, message, DatePicker } from 'antd';
import paymentService from '../../services/paymentService';
import feeService from '../../services/feeService';

const { Option } = Select;

const PaymentForm = ({ studentId, onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fees, setFees] = useState([]);

  useEffect(() => {
    const loadFees = async () => {
      try {
        const response = await feeService.getAllFees({ studentId });
        setFees(response.data);
      } catch (err) {
        message.error('Failed to load fees');
      }
    };
    loadFees();
  }, [studentId]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const paymentData = {
        ...values,
        studentId,
        paymentDate: values.paymentDate.toISOString()
      };
      await paymentService.createPayment(paymentData);
      message.success('Payment recorded successfully');
      onSuccess();
    } catch (error) {
      message.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        amount: 0,
        paymentDate: new Date()
      }}
    >
      <Form.Item
        name="feeId"
        label="Fee"
        rules={[{ required: true, message: 'Please select a fee' }]}
      >
        <Select placeholder="Select fee to pay">
          {fees.map(fee => (
            <Option key={fee.id} value={fee.id}>
              {fee.name} (${fee.amount.toFixed(2)})
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="amount"
        label="Amount Paid"
        rules={[{ required: true, message: 'Please enter amount' }]}
      >
        <InputNumber
          min={0}
          formatter={value => `$ ${value}`}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        name="paymentDate"
        label="Payment Date"
        rules={[{ required: true, message: 'Please select date' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="paymentMethod"
        label="Payment Method"
        rules={[{ required: true, message: 'Please select method' }]}
      >
        <Select placeholder="Select payment method">
          <Option value="cash">Cash</Option>
          <Option value="card">Credit/Debit Card</Option>
          <Option value="bank_transfer">Bank Transfer</Option>
          <Option value="check">Check</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="reference"
        label="Reference Number"
      >
        <Input placeholder="Enter reference number" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Record Payment
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={onCancel}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PaymentForm;