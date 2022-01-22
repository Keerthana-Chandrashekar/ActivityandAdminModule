import React, { useEffect, useState} from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import MuiAlert from '@mui/material/Alert';
import {
    Box,
    Grid,
    Paper,
    Snackbar ,
    Dialog ,
    DialogActions ,
    DialogContent ,
    DialogTitle ,
    TextField, 
} from '@material-ui/core';
import { styled } from '@mui/material/styles';


const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.subtitle1,
    elevation:0 ,
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    boxShadow: 'none',
    color: 'black'
  }));
  
const CustomerStyle = styled(Paper)(({ theme }) => ({
    ...theme.typography.subtitle2,
    elevation:0 ,
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    boxShadow: 'none',
    gutterBottom: true
  }));


// for snack bar
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
  
// Get customer URL
const getCustomerURL = `http://localhost:8080/api/getCustomerById/3`;


export default function AdminProfile() {

    
    // For snack bar - open
    const [open, setOpen] = React.useState(false);

    // For snack bar - close
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    // Get list of customers
    const [customer, setCustomers] = useState([]);
    useEffect( () => {
        axios.get(getCustomerURL).then( response => {
            setCustomers(response.data);
        })
    }, []);

    const [openCEditDialog, setCEditDialogOpen] = React.useState(false);
    const handleCustEditDialogClose = () => {
        setCEditDialogOpen(false);
    };
    const handleCustEditDialogOpen = () => {
        setCEditDialogOpen(true);
    };

    return(
        <Box component="section" sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 40}} >
            <Box component="Image" sx={{height: 170, borderRadius: 15}}>
                <img alt='profileImg' style={{height: 170, width: '100%', borderRadius: 15}} src='https://t3.ftcdn.net/jpg/04/69/86/12/360_F_469861288_q3h0bejmNAtDX3OZUJ2U3vy7StRn8EKd.jpg' />
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                <img alt='Activity' style={{height: 150, width: 150, borderRadius: 5, marginTop: -60, border: '2px solid white', marginLeft: 40}} src='data:image/png;base64,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' />
                <h4 style={{marginLeft: 40}}>{customer.firstName} {customer.lastName}</h4>
            </Box>
            <Box sx={{ flexGrow: 1, marginTop: 40 ,boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px;', padding: 15, borderRadius: 10}}>
                <Grid container spacing={2}>

                    <Grid item xs={3}>
                        <Item>Customer Id</Item>
                    </Grid>
                    <Grid item xs={1}>
                        <Item>:</Item>
                    </Grid>
                    <Grid item xs={8}>
                        <CustomerStyle>{customer.userId}</CustomerStyle>
                    </Grid>

                    <Grid item xs={3}>
                        <Item>User Name</Item>
                    </Grid>
                    <Grid item xs={1}>
                        <Item>:</Item>
                    </Grid>
                    <Grid item xs={8}>
                        <CustomerStyle>{customer.username}</CustomerStyle>
                    </Grid>
                    
                    <Grid item xs={3}>
                        <Item>First Name</Item>
                    </Grid>
                    <Grid item xs={1}>
                        <Item>:</Item>
                    </Grid>
                    <Grid item xs={8}>
                        <CustomerStyle>{customer.firstName}</CustomerStyle>
                    </Grid>
                    
                    <Grid item xs={3}>
                        <Item>Last Name</Item>
                    </Grid>
                    <Grid item xs={1}>
                        <Item>:</Item>
                    </Grid>
                    <Grid item xs={8}>
                        <CustomerStyle>{customer.lastName}</CustomerStyle>
                    </Grid>
                    
                    <Grid item xs={3}>
                        <Item>Mobile Number</Item>
                    </Grid>
                    <Grid item xs={1}>
                        <Item>:</Item>
                    </Grid>
                    <Grid item xs={8}>
                        <CustomerStyle>{customer.mobileNumber}</CustomerStyle>
                    </Grid>
                    
                    <Grid item xs={3}>
                        <Item>Email</Item>
                    </Grid>
                    <Grid item xs={1}>
                        <Item>:</Item>
                    </Grid>
                    <Grid item xs={8}>
                        <CustomerStyle>{customer.email}</CustomerStyle>
                    </Grid>
                    
                    <Grid item xs={3}>
                        <Item>Password</Item>
                    </Grid>
                    <Grid item xs={1}>
                        <Item>:</Item>
                    </Grid>
                    <Grid item xs={8}>
                        <CustomerStyle>{customer.password}</CustomerStyle>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{display: 'flex', justifyContent: 'flex-end', marginTop: 20}}>
                <Button variant="contained" disableElevation  color="success" onClick={handleCustEditDialogOpen}>Edit</Button>
            </Box>

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
        />
        <TextField
            autoFocus
            margin="dense"
            label="First Name"
            fullWidth
            variant="outlined"
            size="small"
            
        />
        <TextField
            autoFocus
            margin="dense"
            label="Last Name"
            type="text"
            fullWidth
            variant="outlined"
            size="small"
            
        />
        <TextField
            autoFocus
            margin="dense"
            label="Email"
            type="text"
            fullWidth
            variant="outlined"
            size="small"
            
        />
        <TextField
            autoFocus
            margin="dense"
            label="Mobile Number"
            type="text"
            fullWidth
            variant="outlined"
            size="small"
            
        />
        <TextField
            autoFocus
            margin="dense"
            label="Password"
            type="text"
            fullWidth
            variant="outlined"
            size="small"
            
        />
        </DialogContent>
        <DialogActions>
            <Button>Cancel</Button>
            <Button>Update</Button>
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
