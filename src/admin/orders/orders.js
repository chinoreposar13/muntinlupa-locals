import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import './orders.css';
import { Button, Col, Row } from "react-bootstrap";
import { RemoveRedEyeIcon } from '../../assets/icon-assets';
import { Link } from 'react-router-dom';
import FbFunctions from '../../firebase/funtions';
import { useState } from 'react';
import { SessionUser } from '../../public/session';
import LoadingComponent from '../../loading/loading';
import {convertCurrencyFormat, deliveryStatus, userTypes} from '../../public/models';

const columns = [
  { id: 'transactionNumber', label: 'Transaction No.', minWidth: 100 },
  { id: 'name', label: 'Name', minWidth: 100 },
  { id: 'address', label: 'Address', minWidth: 200 },
  { id: 'delivery_man', label: 'Rider Name', minWidth: 100 },
  { id: 'delivery_status', label: 'Del. Status', minWidth: 200 },
  { id: 'total_amount', label: 'Total Amount', minWidth: 100 },
  { id: 'order_date', label: 'Date Order', minWidth: 200 },
  { id: 'actions', label: 'Actions', minWidth: 100 }
];

function createData(transactionNumber, name, address, delivery_man, delStatus, total_amount, order_date) {
   let actions = "";
   let delivery_status = "";
   let statusColor = 'text-danger';
   
   switch (delStatus) {
     case deliveryStatus.pending:
        //default red
        console.log(deliveryStatus.pending);
       break;
     case deliveryStatus.transit:
      statusColor = 'text-warning';
       break;
      case deliveryStatus.delivered:
       statusColor = 'text-success';
        break;
   }
   delivery_status = <span className={statusColor}>{delStatus}</span>;
   actions = <span><Link to={"/admin/orders/"+transactionNumber}><RemoveRedEyeIcon /></Link></span>;
  return { transactionNumber, name, address, delivery_man, delivery_status, total_amount, order_date, actions};
}


var getAllOrdersByBranchCode = async () => {
  
  let searchParams = userSessionData().adminBranch;
  let orders = await FbFunctions.fbGetAllCheckOutOrders();
  let newOrders = orders.filter((o) => {
    o.shop_codes = JSON.parse(o.shop_codes);
    o.cartItems = JSON.parse(o.cartItems);
    if (userSessionData().userType === userTypes.admin) {
      if (o.shop_codes.some((sc) => sc.branchCode === userSessionData().adminBranch)) {
        return o;
      }
    } else {
      if (o.delivery_man_id === userSessionData().username) {
        return o;
      }
    }
  });
  return newOrders;
}
var userSessionData = () => {
  return SessionUser.getUserData();
}
export default function OrdersComponent() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [orders, setOrders] = useState([]);
  const [onloadState, setonloadState] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  if (onloadState === 1) {
    getAllOrdersByBranchCode().then((o) => {
      let rowItems = [];
      o.sort((firstOrder, secondOrder) => 
       Number(secondOrder.transactionNumber.substring(8, secondOrder.transactionNumber.length)) -
        Number(firstOrder.transactionNumber.substring(8, firstOrder.transactionNumber.length))
      ).forEach((order) => {
        rowItems.push(
          createData(order.transactionNumber, 
          order.fullname || '', 
          order.delivery_address || '', 
          order.delivery_man, 
          order.delivery_status, 
          'P ' +convertCurrencyFormat(order.total),
          order.transaction_date_time)
        );
      });
      setRows(rowItems);
      setOrders(orders);
      setIsLoading(false);
      setonloadState(2);
    });
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className="admin-orders-container">
        <h1>Orders</h1>
        {(() => {
          if (isLoading) {
            return (<LoadingComponent />)
          } else {
            return ( //RETURN START
              <Row>
              <Col sm={12} className="mb-4 right"></Col>
              <Col sm={12}>
              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                  <TableContainer sx={{ maxHeight: 440 }}>
                      <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                          <TableRow>
                          {columns.map((column) => (
                              <TableCell
                              key={column.id}
                              align={column.align}
                              style={{ minWidth: column.minWidth }}
                              >
                              {column.label}
                              </TableCell>
                          ))}
                          </TableRow>
                      </TableHead>
                      <TableBody>
                          {rows
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row) => {
                              return (
                              <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                  {columns.map((column) => {
                                  const value = row[column.id];
                                  return (
                                      <TableCell key={column.id} align={column.align}>
                                      {column.format && typeof value === 'number'
                                          ? column.format(value)
                                          : value}
                                      </TableCell>
                                  );
                                  })}
                              </TableRow>
                              );
                          })}
                      </TableBody>
                      </Table>
                  </TableContainer>
                  <TablePagination
                      rowsPerPageOptions={[10, 25, 100]}
                      component="div"
                      count={rows.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                  />
              </Paper>
              </Col>
          </Row>
          ) //RETURN END
          }
        })()}
       
    </div>
    
  );
}