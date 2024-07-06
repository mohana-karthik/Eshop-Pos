import React, { useEffect } from 'react';
import CustomInput from '../components/CustomInput';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { Button, Table, Select, InputNumber } from 'antd';
import { getProducts } from '../features/product/productSlice';
import {
  createInvoices,
  getAInvoice,
  resetState,
  updateAInvoice,
} from '../features/invoice/invoiceSlice';
import { useFormik } from 'formik';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    padding: 30,
    fontSize: 12,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
    textDecoration: 'underline',
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    padding: 10,
    textDecoration: 'underline',
  },
  clientInfo: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  clientInfoItem: {
    fontSize: 12,
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },
  itemsTable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderBottomStyle: 'solid',
  },
  tableHeader: {
    fontWeight: 'bold',
    fontSize: 12,
    padding: 5,
    backgroundColor: '#f0f0f0',
    textAlign: 'center',
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderBottomStyle: 'solid',
  },
  tableCell: {
    fontSize: 12,
    padding: 5,
    flex: 1,
    textAlign: 'center',
    wordWrap: 'break-word',
  },
  totals: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  totalsItem: {
    fontSize: 14,
    marginRight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#999',
    fontSize: 10,
  },
});
const { Option } = Select;

const schema = yup.object().shape({
  clientName: yup.string().required('Client Name Required'),
  clientEmail: yup.string().email('Invalid email address').required('Client Email Required'),
  clientPhone: yup.string().required('Client Phone Required').matches(/^[0-9]{10}$/, 'Must be a valid phone number'),
  items: yup.array().of(
    yup.object().shape({
      product: yup.string().required('Required'),
      quantity: yup.number().min(1, 'Must be greater than 0').required('Required'),
      price: yup.number().min(0, 'Must be a positive number').required('Required'),
    })
  ),
  taxRate: yup.number().min(0, 'Must be a positive number').required('Required'),
  paymentMethod: yup.string().required('Required'),
});

const InvoiceForm = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const invoiceId = location.pathname.split('/')[3];
  const newInvoice = useSelector((state) => state.invoice) || {};
  const {
    isSuccess,
    isError,
    isLoading,
    clientName,
    clientPhone,
    clientEmail,
    taxRate,
    paymentMethod,
    createdInvoice,
    updatedInvoice,
  } = newInvoice;

  useEffect(() => {
    dispatch(getProducts());
    if (invoiceId) {
      dispatch(getAInvoice(invoiceId));
    } else {
      dispatch(resetState());
    }
  }, [dispatch, invoiceId]);

  useEffect(() => {
    if (isSuccess && createdInvoice) {
      toast.success('Invoice Added Successfully!');
    }
    if (isSuccess && updatedInvoice) {
      toast.success('Invoice Updated Successfully!');
      navigate('/admin/invoice-list');
    }
    if (isError) {
      toast.error('Something Went Wrong!');
    }
  }, [isSuccess, isError, isLoading, createdInvoice, updatedInvoice, navigate]);

  const productState = useSelector((state) => state.product.products) || [];

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      clientName: clientName || '',
      clientEmail: clientEmail || '',
      clientPhone: clientPhone || '',
      taxRate: taxRate || '',
      paymentMethod: paymentMethod || '',
      items: [{ product: '', quantity: 1, price: 0, total: 0, }],
      totalPrice: 0,
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (invoiceId !== undefined) {
        const data = { id: invoiceId, invoiceData: values };
        dispatch(updateAInvoice(data));
        dispatch(resetState());
      } else {
        dispatch(createInvoices(values));
        formik.resetForm();
        setTimeout(() => {
          dispatch(resetState());
        }, 300);
      }
    },
  });

  const handleProductChange = (value, index, setFieldValue) => {
    const selectedProduct = productState.find(product => product._id === value);
    if (selectedProduct) {
      const updatedItems = [...formik.values.items];
      updatedItems[index] = {
        ...updatedItems[index],
        product: selectedProduct._id,
        price: selectedProduct.price,
        total: selectedProduct.price * updatedItems[index].quantity,
      };
      setFieldValue('items', updatedItems);
    }
  };

  const handleQuantityChange = (value, index, setFieldValue) => {
    const updatedItems = [...formik.values.items];
    updatedItems[index] = {
      ...updatedItems[index],
      quantity: parseInt(value, 10),
      total: value * updatedItems[index].price,
    };
    setFieldValue('items', updatedItems);
  };

  const handleDeleteItem = (index, setFieldValue) => {
    const newItems = [...formik.values.items];
    newItems.splice(index, 1);
    setFieldValue('items', newItems);
  };

  const handleAddItem = (setFieldValue) => {
    setFieldValue('items', [
      ...formik.values.items,
      { product: '', quantity: 1, price: 0, total: 0 },
    ]);
  };

  const calculateSubtotal = () => {
    return formik.values.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  };

  const totalPrice = () => {
    const subtotal = calculateSubtotal();
    const tax = (subtotal * (formik.values.taxRate || 0)) / 100;
    const totalPrice = subtotal + tax;

  
    formik.setFieldValue('totalPrice', totalPrice.toFixed(2));

    return totalPrice;
  };

  // Call totalPrice when formik.values changes
  useEffect(() => {
    totalPrice();
  }, [formik.values]);
  const generatePDF = () => (
    <Document>
    <Page size="A4" style={styles.page}>
      <View>
        <Text style={styles.header}>E-shop Invoice</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Client Information</Text>
        <View style={styles.clientInfo}>
          <Text style={styles.clientInfoItem}>Client Name: {formik.values.clientName}</Text>
          <Text style={styles.clientInfoItem}>Client Email: {formik.values.clientEmail}</Text>
          <Text style={styles.clientInfoItem}>Client Phone: {formik.values.clientPhone}</Text>
        </View>
        <Text style={styles.clientInfoItem}>Payment Method: {formik.values.paymentMethod}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Invoice Details</Text>
        <View style={styles.itemsTable}>
          <Text style={styles.tableHeader}>S.No</Text>
          <Text style={styles.tableHeader}>Product</Text>
          <Text style={styles.tableHeader}>Quantity</Text>
          <Text style={styles.tableHeader}>Price</Text>
          <Text style={styles.tableHeader}>Total</Text> 
        </View>
        {formik.values.items.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={styles.tableCell}>{index + 1}</Text>
            <Text style={styles.tableCell}>{productState.find(p => p._id === item.product)?.title}</Text>
            <Text style={styles.tableCell}>{item.quantity}</Text>
            <Text style={styles.tableCell}>₹ {item.price.toFixed(2)}</Text>
            <Text style={styles.tableCell}>₹ {(item.quantity * item.price).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.totals}>
        <Text style={styles.totalsItem}>Subtotal: ₹ {calculateSubtotal().toFixed(2)}</Text>
        <Text style={styles.totalsItem}>Tax: ₹ {((calculateSubtotal() * formik.values.taxRate) / 100).toFixed(2)}</Text>
        <Text style={styles.totalsItem}>Total: ₹ {formik.values.totalPrice}</Text>
      </View>

      <View style={styles.footer}>
        <Text>Thank you for your business!</Text>
      </View>
    </Page>
  </Document>
  );
  return (
    <div>
      <h3 className="mb-4 title">{invoiceId ? 'Edit Invoice' : 'Add Invoice'}</h3>
      <form action="" onSubmit={formik.handleSubmit} className="d-flex gap-3 flex-column">
        <CustomInput
          type="text"
          label="Enter Client Name"
          name="clientName"
          onCh={formik.handleChange("clientName")}
          onBlr={formik.handleBlur("clientName")}
          val={formik.values.clientName}
          id="clientName"
        />
        {formik.touched.clientName && formik.errors.clientName && (
          <div className="error">{formik.errors.clientName}</div>
        )}

        <CustomInput
          type="text"
          label="Enter Client Email"
          name="clientEmail"
          onCh={formik.handleChange("clientEmail")}
          onBlr={formik.handleBlur("clientEmail")}
          val={formik.values.clientEmail}
          id="clientEmail"
        />
        {formik.touched.clientEmail && formik.errors.clientEmail && (
          <div className="error">{formik.errors.clientEmail}</div>
        )}

        <CustomInput
          type="text"
          label="Enter Client Phone"
          name="clientPhone"
          onCh={formik.handleChange("clientPhone")}
          onBlr={formik.handleBlur("clientPhone")}
          val={formik.values.clientPhone}
          id="clientPhone"
        />
        {formik.touched.clientPhone && formik.errors.clientPhone && (
          <div className="error">{formik.errors.clientPhone}</div>
        )}

        <CustomInput
          type="number"
          label="Enter Tax Rate (%)"
          name="taxRate"
          onCh={formik.handleChange("taxRate")}
          onBlr={formik.handleBlur("taxRate")}
          val={formik.values.taxRate}
          id="taxRate"
        />
        {formik.touched.taxRate && formik.errors.taxRate && (
          <div className="error">{formik.errors.taxRate}</div>
        )}

        <Select
          name="paymentMethod"
          onChange={(value) => formik.setFieldValue('paymentMethod', value)}
          onBlur={formik.handleBlur}
          value={formik.values.paymentMethod}
          className="form-control py-3 mb-3"
          id="paymentMethod"
        >
          <Option value="">Select Payment Method</Option>
          <Option value="Cash">Cash</Option>
          <Option value="Card">Card</Option>
        </Select>
        {formik.touched.paymentMethod && formik.errors.paymentMethod && (
          <div className="error">{formik.errors.paymentMethod}</div>
        )}

        <Table
          dataSource={formik.values.items}
          rowKey={(record, index) => index}
          pagination={false}
        >
          <Table.Column
            title="Product"
            dataIndex="product"
            key="product"
            render={(text, record, index) => (
              <Select
                style={{ width: '100%' }}
                onChange={(value) => handleProductChange(value, index, formik.setFieldValue)}
                value={formik.values.items[index].product}
              >
                {productState.map((product) => (
                  <Option key={product._id} value={product._id}>
                    {product.title}
                  </Option>
                ))}
              </Select>
            )}
          />
          <Table.Column
            title="Quantity"
            dataIndex="quantity"
            key="quantity"
            render={(text, record, index) => (
              <InputNumber
                min={1}
                value={record.quantity}
                onChange={(value) => handleQuantityChange(value, index, formik.setFieldValue)}
              />
            )}
          />
          <Table.Column
            title="Price"
            dataIndex="price"
            key="price"
            render={(text, record) => (
              <span>₹ {record.price.toFixed(2)}</span>
            )}
          />
          <Table.Column
            title="Total"
            dataIndex="total"
            key="total"
            render={(text, record) => (
              <span> ₹ {(record.quantity * record.price).toFixed(2)}</span>
            )}
          />
          <Table.Column
            title="Action"
            key="action"
            render={(text, record, index) => (
              <Button type="link" danger onClick={() => handleDeleteItem(index, formik.setFieldValue)}>
                Delete
              </Button>
            )}
          />
        </Table>

        <Button onClick={() => handleAddItem(formik.setFieldValue)}>Add Item</Button>

        <div style={{ marginTop: '20px', borderTop: '1px solid #e8e8e8', paddingTop: '20px' }}>
          <div style={{ textAlign: 'right', fontSize: '30px' }}>
            <p>Subtotal: ₹ {calculateSubtotal().toFixed(2)}</p>
            <p>Tax: ₹ {((calculateSubtotal() * formik.values.taxRate) / 100).toFixed(2)}</p>
            <p>Total: ₹ {formik.values.totalPrice}</p>
          </div>
          <Button
            type="primary"
            htmlType="submit"
            className="btn btn-success border-0 rounded-3 my-5"
          >
            {invoiceId ? 'Update Invoice' : 'Add Invoice'}
          </Button>
         
        </div>
      </form>
      <PDFViewer style={{ width: '100%', height: '600px', marginTop: '20px' }}>
        {generatePDF()}
      </PDFViewer>
    </div>
  );
};

export default InvoiceForm;
