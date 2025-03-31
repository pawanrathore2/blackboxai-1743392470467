import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFees, deleteFee } from '../../store/slices/feeSlice';
import { Table, Spin, Alert, Button, Space, Input, Select, DatePicker, Modal } from 'antd';
import { SearchOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import FeeForm from './FeeForm';

const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;

const FeeList = () => {
  const dispatch = useDispatch();
  const { fees, loading, error, pagination } = useSelector(state => state.fees);
  const [searchParams, setSearchParams] = useState({
    page: 1,
    pageSize: 10,
    sortField: 'name',
    sortOrder: 'ascend'
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentFee, setCurrentFee] = useState(null);

  useEffect(() => {
    dispatch(fetchFees(searchParams));
  }, [dispatch, searchParams]);

  const showDeleteConfirm = (id) => {
    confirm({
      title: 'Are you sure you want to delete this fee?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        dispatch(deleteFee(id))
          .then(() => dispatch(fetchFees(searchParams)));
      }
    });
  };

  const handleFormSuccess = () => {
    setIsModalVisible(false);
    dispatch(fetchFees(searchParams));
  };

  const columns = [
    {
      title: 'Fee Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true
    },
    {
      title: 'Course',
      dataIndex: 'course',
      key: 'course',
      filters: [
        { text: 'Computer Science', value: 'CS' },
        { text: 'Business', value: 'BUS' },
        { text: 'Engineering', value: 'ENG' }
      ]
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      sorter: true,
      render: (amount) => `$${amount.toFixed(2)}`
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      sorter: true,
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link"
            onClick={() => {
              setCurrentFee(record);
              setIsModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Button 
            type="link" 
            danger
            onClick={() => showDeleteConfirm(record.id)}
          >
            Delete
          </Button>
        </Space>
      )
    }
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    setSearchParams({
      ...searchParams,
      page: pagination.current,
      pageSize: pagination.pageSize,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters
    });
  };

  if (error) return <Alert message="Error loading fees" type="error" showIcon />;

  return (
    <div className="fee-list-container">
      <div className="fee-list-header">
        <h2>Fee Management</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => {
            setCurrentFee(null);
            setIsModalVisible(true);
          }}
        >
          Add New Fee
        </Button>
      </div>

      <Modal
        title={currentFee ? "Edit Fee" : "Create New Fee"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <FeeForm 
          fee={currentFee} 
          onSuccess={handleFormSuccess}
          onCancel={() => setIsModalVisible(false)}
        />
      </Modal>
      
      <div className="fee-list-filters">
        <Search
          placeholder="Search fees"
          allowClear
          enterButton={<SearchOutlined />}
          onSearch={(value) => setSearchParams({...searchParams, search: value})}
        />
        <Select
          placeholder="Filter by status"
          allowClear
          style={{ width: 200 }}
          onChange={(value) => setSearchParams({...searchParams, status: value})}
        >
          <Option value="active">Active</Option>
          <Option value="inactive">Inactive</Option>
        </Select>
      </div>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={fees}
          rowKey="id"
          pagination={{
            current: searchParams.page,
            pageSize: searchParams.pageSize,
            total: pagination.totalItems,
            showSizeChanger: true
          }}
          onChange={handleTableChange}
        />
      </Spin>
    </div>
  );
};

export default FeeList;