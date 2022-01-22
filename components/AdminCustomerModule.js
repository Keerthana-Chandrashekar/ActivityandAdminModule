import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { makeStyles } from '@mui/styles';
import { styled } from '@mui/material/styles';
import MuiAlert from '@mui/material/Alert';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import {
    Box,
    Button,
    Table ,
    TableBody ,
    TableContainer ,
    TableHead ,
    TableRow ,
    Paper ,
    Snackbar ,
    Dialog ,
    DialogActions ,
    DialogContent ,
    DialogTitle ,
    TextField, 
} from '@material-ui/core';

// Custom styles
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      color: theme.palette.common.white,
    },
  }));

const StyledAddButton = styled(Button)({
    background: 'linear-gradient(to right,  #16222a, #3a6073)',
    color: 'white',
    marginBottom: 15,
  '&:hover': {
        background: 'linear-gradient(to left,  #16222a, #3a6073)',
        color: 'white',
  },
  });

const useStyles = makeStyles({
    tableHeadStyle: {
        background: 'linear-gradient(to right,  #16222a, #3a6073)',
        color: 'white',
    }
  });

// for snack bar
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Get customer URL
const baseURL = `http://localhost:8080/api/`
const getCustomerURL = `${baseURL}/getAllCustomers`;


export default function AdminCustomerModule() {

    // For custom styling
    const classes = useStyles();

    // For snack bar - open
    const [open, setOpen] = React.useState(false);

    // For snack bar - close
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    // All customer related methods :
    // Get list of customers
    const [customers, setCustomers] = useState([]);
    useEffect( () => {
        axios.get(getCustomerURL).then( response => {
            setCustomers(response.data);
        })
    }, []);

    //  For Add customer dialog box
    const [openCDialog, setCDialogOpen] = React.useState(false);

    const handleCustDialogOpen = () => {
        setCDialogOpen(true);
    };

    const handleCustDialogClose = () => {
        setCDialogOpen(false);
    };

    // Add customer
    const [customerDetails, setCustomerDetails] = useState({});

    const custHandler = (e) => {
        addCustomer(customerDetails);
        e.preventDefault();
    }
    const addCustomer = (data) => {
        axios.post(`http://localhost:8080/api/addCustomer`,
            data
    ).then(res => {
            setCDialogOpen(false);
            setOpen(true);
            axios.get(getCustomerURL).then( response => {
                setCustomers(response.data);
            })
        });
    }

    //  For Add customer dialog box
    const [openCEditDialog, setCEditDialogOpen] = React.useState(false);

    const handleCustEditDialogClose = () => {
        setCEditDialogOpen(false);
    };

    // To load the details of customer to edit : get by id
    const [customerToEdit, setCustomerToEdit] = React.useState({});

    const getCustomerById = (id) => {
        axios.get(`${baseURL}/getCustomerById/${id}`).then( response => {
            setCustomerToEdit(response.data);
            setCEditDialogOpen(true);
        })
    };

    const updateCustHandler = (e) => {
        const id = customerToEdit.userId;
        updateCustomerDetails(id,customerToEdit);
        e.preventDefault();
    }

    const updateCustomerDetails = (id,details) => {
        console.log(details);
        console.log(id);
        axios.put(`${baseURL}/updateCustomerById/${id}`,
        details).then( res => {
            setCEditDialogOpen(false);
            setOpen(true);
                axios.get(getCustomerURL).then( response => {
                    setCustomers(response.data);
                })
        })
    }

    // Delete customer
    const deleteCustomer = (id) => {
        axios.delete(`${baseURL}/deleteCustomerById/${id}`).then( res => {
            setOpen(true);
            axios.get(getCustomerURL).then( response => {
                setCustomers(response.data);
            })
        });
    }
    
    return (
        <Box>
        <StyledAddButton sx={{float:'right'}} variant="contained" onClick={handleCustDialogOpen}>Add Customer</StyledAddButton>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead className={classes.tableHeadStyle}>
                    <TableRow>
                        <StyledTableCell>Customer Id</StyledTableCell>
                        <StyledTableCell>User Name</StyledTableCell>
                        <StyledTableCell align="left">First Name</StyledTableCell>
                        <StyledTableCell align="left">Last Name</StyledTableCell>
                        <StyledTableCell align="left">Mobile Number</StyledTableCell>
                        <StyledTableCell align="left">Email</StyledTableCell>
                        <StyledTableCell align="left">Password</StyledTableCell>
                        <StyledTableCell align="center" colSpan={2}>Action</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {customers.map((customer,index) => (
                    <TableRow
                    key={customer.userId}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell component="th">{customer.userId}</TableCell>
                    <TableCell align="left">{customer.username}</TableCell>
                    <TableCell align="left">{customer.firstName}</TableCell>
                    <TableCell align="left">{customer.lastName}</TableCell>
                    <TableCell align="left">{customer.mobileNumber}</TableCell>
                    <TableCell align="left">{customer.email}</TableCell>
                    <TableCell align="left">{customer.password}</TableCell>
                    <TableCell align="left">
                        <Button variant='outlined' size="small" color="primary" onClick={() => getCustomerById(customer.userId)}>Edit</Button>
                    </TableCell>
                    <TableCell align="left">
                        <Button variant="outlined" size="small" color="secondary" onClick={() => deleteCustomer(customer.userId)}>Delete</Button>
                    </TableCell>
                    </TableRow>
                ))}
                    </TableBody>
                </Table>
            </TableContainer>

      {/* Add Customer dialog box */}
      <Dialog open={openCDialog} onClose={handleCustDialogClose}>
            <DialogTitle>ADD Customer</DialogTitle>
            <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                label="User Name"
                type="text"
                fullWidth
                variant="outlined"
                size="small"
                onChange={(e) => setCustomerDetails({...customerDetails, username :e.target.value})}
            />
            <TextField
                autoFocus
                margin="dense"
                label="First Name"
                fullWidth
                variant="outlined"
                size="small"
                onChange={(e) => setCustomerDetails({...customerDetails, firstName :e.target.value})}
            />
            <TextField
                autoFocus
                margin="dense"
                label="Last Name"
                type="text"
                fullWidth
                variant="outlined"
                size="small"
                onChange={(e) => setCustomerDetails({...customerDetails, lastName :e.target.value})}
            />
            <TextField
                autoFocus
                margin="dense"
                label="Email"
                type="text"
                fullWidth
                variant="outlined"
                size="small"
                onChange={(e) => setCustomerDetails({...customerDetails, email :e.target.value})}
            />
            <TextField
                autoFocus
                margin="dense"
                label="Mobile Number"
                type="text"
                fullWidth
                variant="outlined"
                size="small"
                onChange={(e) => setCustomerDetails({...customerDetails, mobileNumber :e.target.value})}
            />
            <TextField
                autoFocus
                margin="dense"
                label="Password"
                type="text"
                fullWidth
                variant="outlined"
                size="small"
                onChange={(e) => setCustomerDetails({...customerDetails,password :e.target.value})}
            />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCustDialogClose}>Cancel</Button>
                <Button onClick={custHandler}>ADD</Button>
            </DialogActions>
      </Dialog>

    {/* Update Customer dialog box */}
    <Dialog open={openCEditDialog} onClose={handleCustEditDialogClose}>
      <DialogTitle>Update Customer</DialogTitle>
      <DialogContent>
        <TextField
            autoFocus
            margin="dense"
            label="User Name"
            type="text"
            fullWidth
            variant="outlined"
            size="small"
            defaultValue={customerToEdit.username}
            onChange={(e) => setCustomerToEdit({...customerToEdit, username :e.target.value})}
        />
        <TextField
            autoFocus
            margin="dense"
            label="First Name"
            fullWidth
            variant="outlined"
            size="small"
            defaultValue={customerToEdit.firstName}
            onChange={(e) => setCustomerToEdit({...customerToEdit, firstName :e.target.value})}
        />
        <TextField
            autoFocus
            margin="dense"
            label="Last Name"
            type="text"
            fullWidth
            variant="outlined"
            size="small"
            defaultValue={customerToEdit.lastName}
            onChange={(e) => setCustomerToEdit({...customerToEdit, lastName :e.target.value})}
        />
        <TextField
            autoFocus
            margin="dense"
            label="Email"
            type="text"
            fullWidth
            variant="outlined"
            size="small"
            defaultValue={customerToEdit.email}
            onChange={(e) => setCustomerToEdit({...customerToEdit, email :e.target.value})}
        />
        <TextField
            autoFocus
            margin="dense"
            label="Mobile Number"
            type="text"
            fullWidth
            variant="outlined"
            size="small"
            defaultValue={customerToEdit.mobileNumber}
            onChange={(e) => setCustomerToEdit({...customerToEdit, mobileNumber :e.target.value})}
        />
        <TextField
            autoFocus
            margin="dense"
            label="Password"
            type="text"
            fullWidth
            variant="outlined"
            size="small"
            defaultValue={customerToEdit.password}
            onChange={(e) => setCustomerToEdit({...customerToEdit,password :e.target.value})}
        />
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCustEditDialogClose}>Cancel</Button>
            <Button onClick={updateCustHandler}>Update</Button>
        </DialogActions>
        </Dialog>

        {/* Alert snack bar */}
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Action successfull !!
            </Alert>
      </Snackbar>
    </Box>
    );
}