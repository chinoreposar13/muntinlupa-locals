import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import './adminBranches.css';
import { Button, Col, Row } from "react-bootstrap";
import { CreateIcon, DeleteIcon } from '../../../assets/icon-assets';
import { Link } from 'react-router-dom';

const columns = [
  { id: 'id', label: 'ID', minWidth: 100 },
  { id: 'code', label: 'Code', minWidth: 100 },
  { id: 'name', label: 'Name', minWidth: 200 },
  { id: 'location', label: 'Location', minWidth: 300 },
  { id: 'actions', label: 'Actions', minWidth: 100 }
];

function createData(id, code, name, location) {
   let actions = "";
  actions = <span><CreateIcon /><DeleteIcon /></span>
  return { id, code, name, location, actions};
}

const rows = [
  createData(1, 'tunasanBranch', 'Tunasan Branch', 'Tunasan, Muntinlupa'),
  createData(2,'putatanBranch', 'Putatan Branch', 'Putatan, Muntinlupa')
];

export default function AdminBranchesComponent() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className="admin-branches-container">
        <h1>Branches</h1>
        <Row>
            <Col sm={12} className="mb-4 right"><Link to="/admin/branches/new"><Button variant="dark" size="lg">Create New</Button></Link></Col>
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
    </div>
    
  );
}