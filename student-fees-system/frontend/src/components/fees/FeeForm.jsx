import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, DatePicker, Button, message } from 'antd';
import feeService from '../../services/feeService';

const { Option } = Select;

const FeeForm = ({ fee, onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (fee) {
      form.setFieldsValue({
        ...fee,
        dueDate: fee.dueDate ? moment(fee.dueDate) : null
      });
    }
  }, [fee, form]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const feeData = {
        ...values,
        dueDate: values.dueDate ? values.dueDate.toISOString() : null
      };

      if (fee) {
        await feeService.updateFee(fee.id, feeData);
        message.success('Fee updated successfully');
      } else {
        await feeService.createFee(feeData);
        message.success('Fee created successfully');
      }
      
      onSuccess();
    } catch (error) {
      message.error(error.response?.data?.message || 'An error occurred');
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
        status: 'active'
      }}
    >
      <Form.Item
        name="name"
        label="Fee Name"
        rules={[{ required: true, message: 'Please enter fee name' }]}
      >
        <Input placeholder="Enter fee name" />
      </Form.Item>

      <Form.Item
        name="course"
        label="Course"
        rules={[{ required: true, message: 'Please select course' }]}
      >
        <Select placeholder="Select course">
          <Option value="Computer Science">Computer Science</Option>
          <Option value="Business Administration">Business Administration</Option>
          <Option value="Engineering">Engineering</Option>
          <Option value="Medicine">Medicine</Option>
          <Option value="Arts">Arts</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="amount"
        label="Amount"
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
        name="dueDate"
        label="Due Date"
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="status"
        label="Status"
      >
        <Select>
          <Option value="active">Active</Option>
          <Option value="inactive">Inactive</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {fee ? 'Update Fee' : 'Create Fee'}
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={onCancel}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FeeForm;