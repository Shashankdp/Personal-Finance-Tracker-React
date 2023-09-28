import React from "react";
import {
  Card,
  Col,
  Row,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
} from "antd";

function AddIncomeModal({ isIncomeModalVisible, handleIncomeCancel, onFinish, }) {
  const [form] = Form.useForm();  // Form.useForm() is a hook that creates a form instance. This form instance represents a form in your React component and provides various methods and properties for working with form fields, validation, and submission.
  
  return (
    // <Modal> Component: This is the Ant Design modal component that is used to create a modal dialog box.
    <Modal style={{ fontWeight: 600 }} title="Add Income" visible={isIncomeModalVisible} onCancel={handleIncomeCancel} footer={null} >  

      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onFinish(values, "income");
          form.resetFields();
        }}
      >

      <Form.Item
        style={{ fontWeight: 600 }}
        label="Name"
        name="name"
        rules={[
          {
            required: true,
            message: "Please input the name of the transaction!",
          },
        ]}
      >

         <Input type="text" className="custom-input" />

      </Form.Item>

      <Form.Item
        style={{ fontWeight: 600 }}
        label="Amount"
        name="amount"
        rules={[
          { required: true, message: "Please input the income amount!" },
        ]}
      >

         <Input type="number" className="custom-input" />

      </Form.Item>

      <Form.Item
        style={{ fontWeight: 600 }}
        label="Date"
        name="date"
        rules={[
          { required: true, message: "Please select the income date!" },
        ]}
      >

        <DatePicker format="YYYY-MM-DD" className="custom-input" />

      </Form.Item>
 
      <Form.Item
        style={{ fontWeight: 600 }}
        label="Tag"
        name="tag"
        rules={[{ required: true, message: "Please select a tag!" }]}
      >
          <Select className="select-input-2">
            <Select.Option value="salary">Salary</Select.Option>
            <Select.Option value="freelance">Freelance</Select.Option>
            <Select.Option value="investment">Investment</Select.Option>
            <Select.Option value="bonus/allowances">Bonus/Allowances</Select.Option>
            <Select.Option value="taxReturns">TaxReturns</Select.Option>
          
            {}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button className="btn btn-blue" type="primary" htmlType="submit">
            Add Income
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddIncomeModal;
