import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import MuiAlert from '@mui/material/Alert';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import {
    Box,
    Typography,
    Tab,
    Tabs,
    Grid,
    Button,
    Table ,
    TableBody ,
    TableContainer ,
    TableHead ,
    TableRow ,
    Paper ,
    IconButton,
    Avatar,
    Snackbar ,
    Dialog ,
    DialogActions ,
    DialogContent ,
    DialogContentText ,
    DialogTitle ,
    TextField, 
    Input
} from '@material-ui/core';
import { border } from '@mui/system';

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

const StyledAvatar = styled(Avatar)({
    background: 'linear-gradient(to right,  #16222a, #3a6073)',
});

  const StyledTab = styled(Tab)({
    background: 'linear-gradient(to right,  #16222a, #3a6073)',
    color: 'white',
    textTransform: 'none',
    '&:hover': {
        background: 'linear-gradient(to left,  #16222a, #3a6073)',
        color: 'white',
    },
    '&:focus': {
        background: 'linear-gradient(to left,  #16222a, #3a6073)',
        color: 'white',
        textTransform: 'none'
    },
  });

const useStyles = makeStyles({
    tabBtn: {
    background: 'linear-gradient(to right,  #16222a, #3a6073)',
    color: 'white',
    },
    tableHeadStyle: {
        background: 'linear-gradient(to right,  #16222a, #3a6073)',
        color: 'white',
    }
  });

// For creating avatar using name initials
function stringAvatar(name) {
    return {
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

//  for side vertical nav bar
function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

// for snack bar
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Get activity URL
const getActivityURL = `http://localhost:8080/api/getAllActivities`;

// Get customer URL
const getCustomerURL = `http://localhost:8080/api/getAllCustomers`;
  
export default function AdminModule() {

    // For side nav bar
    const [value, setValue] = React.useState(0);

    // For custom styling
    const classes = useStyles();

    // For snack bar - open
    const [open, setOpen] = React.useState(false);
    const handleClick = () => {
        setOpen(true);
    };

    // For snack bar - close
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    // For side nav bar
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // For Add activity dialog box
    const [openDialog, setDialogOpen] = React.useState(false);

    const handleEditDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setDialogOpen(false);
    };
 
    // All Activity Related methods :
    // Get list of activities
    const [activity, setActivity] = useState([]);
    useEffect( () => {
        axios.get(getActivityURL).then( response => {
            setActivity(response.data);
        })
    }, []);

    // Add activity
    const[activityName, setActivityName] = useState('');
    const[description, setActivityDescription] = useState('');
    const[charges, setActivityCharges] = useState(0);
    const addActivity = () => {
        axios.post(`http://localhost:8080/api/insertActivity`, {
            activityName,
            description,
            charges
        }).then(res => {
            setDialogOpen(false);
            setOpen(true);
            axios.get(getActivityURL).then( response => {
                setActivity(response.data);
            })
        });
    }

    // Delete activity
    const deleteActivity = (id) => {
        axios.delete(`http://localhost:8080/api/deleteActivityById/${id}`).then( res => {
            setOpen(true);
            axios.get(getActivityURL).then( response => {
            setActivity(response.data);
            })
        });
    }

    // Edit activity
    const [enableActEdit,setActEdit] = useState(true);
    const [activityToEdit,setActivityToEdit] = useState({});
    const handleActivityToEdit = (act) => {
        setActivityToEdit(act);
        console.log('activity to edit',activityToEdit);
        console.log('edited name:',activityName);
    }
    const handleEnableActEdit = () => {
        setActEdit(false);
    }

    const handleCancelAct = () => {
        axios.get(getActivityURL).then( response => {
            setActivity(response.data);
        })
        setActEdit(true);
        setActivityName('');
        
    }

    // For Add customer dialog box
    const [openCDialog, setCDialogOpen] = React.useState(false);

    const handleCustDialogOpen = () => {
        setCDialogOpen(true);
    };

    const handleCustDialogClose = () => {
        setCDialogOpen(false);
    };

    // All customer related methods :
    // Get list of customers
    const [customers, setCustomers] = useState([]);
    useEffect( () => {
        axios.get(getCustomerURL).then( response => {
            setCustomers(response.data);
        })
    }, []);

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

    // Delete customer
    const deleteCustomer = (id) => {
        axios.delete(`http://localhost:8080/api/deleteCustomerById/${id}`).then( res => {
            setOpen(true);
            axios.get(getCustomerURL).then( response => {
                setCustomers(response.data);
            })
        });
    }
    

    return (
        <Box style={{ height: '90vh' }}
            sx={{ flexGrow: 1, bgcolor: 'white', display: 'flex' }}
        >
        <Grid container>
        <Grid item xs={2} className={classes.tabBtn}>

        {/* Side Nav Bar */}
        <Tabs 
            orientation="vertical"
            variant="fullWidth"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            TabIndicatorProps={{style: {background:'none'}}}
        >
            <StyledTab label="Dashboard" {...a11yProps(0)} />
            <StyledTab label="Customers" {...a11yProps(1)} />
            <StyledTab label="Ticket Booking" {...a11yProps(2)} />
            <StyledTab label="Activities" {...a11yProps(3)} />
        </Tabs>
        </Grid>
        <Grid item xs={10}>
            
        {/* Dashboard */}
        <TabPanel value={value} index={0}>
            Dashboard
        </TabPanel>

        {/* Customer List Table */}
        <TabPanel value={value} index={1}>
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
                    <TableCell align="left">
                        <TextField disabled value={customer.password}></TextField>
                    </TableCell>
                    <TableCell align="left">
                        <Button variant='outlined' size="small" color="primary">Edit</Button>
                    </TableCell>
                    <TableCell align="left">
                        <Button variant="outlined" size="small" color="secondary" onClick={() => deleteCustomer(customer.userId)}>Delete</Button>
                    </TableCell>
                    </TableRow>
                ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </TabPanel>

        {/* Ticket booking table */}
        <TabPanel value={value} index={2}>
            Ticket Booking List
        </TabPanel>

        {/* Activities List Table */}
        <TabPanel value={value} index={3}>
            <StyledAddButton sx={{float:'right'}} variant="contained" onClick={handleEditDialogOpen}>Add Activity</StyledAddButton>
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead className={classes.tableHeadStyle}>
                <TableRow>
                    <StyledTableCell>Activity Id</StyledTableCell>
                    <StyledTableCell align="left">Activity Name</StyledTableCell>
                    <StyledTableCell align="left">Description</StyledTableCell>
                    <StyledTableCell align="left">Charges</StyledTableCell>
                    <StyledTableCell align="center" colSpan={2}>Action</StyledTableCell>
                </TableRow>
                </TableHead>
                
                <TableBody>
                {activity.map((act, index) => (
                    <TableRow
                    key={act.activityId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell component="th">{act.activityId}</TableCell>
                    <TableCell align="left">
                    <IconButton sx={{ p: 0 }}>
                        {/* <StyledAvatar {...stringAvatar(act.activityName)}></StyledAvatar> */}
                    </IconButton>
                        <Input 
                            defaultValue={act.activityName}
                            onChange={(e) => setActivityName(e.target.value)}
                            readOnly={false}
                            disabled={enableActEdit && activityToEdit.activityId == act.activityId ? false : true}
                            disableUnderline={enableActEdit && activityToEdit.activityId == act.activityId ? false : true}
                        ></Input>
                    </TableCell>
                    <TableCell align="left">{act.description}</TableCell>
                    <TableCell align="left">{act.charges}/-</TableCell>
                    <TableCell align="left">
                        <Button variant='outlined' size="small" color="primary" onClick={enableActEdit ? () => {handleActivityToEdit(act);handleEnableActEdit();} : handleCancelAct}>{enableActEdit && activityToEdit.activityId == act.activityId ? 'Cancel' : 'Edit'}</Button>
                        <Button variant='outlined' size="small" color="inherit" sx={{ml: 4}}>Save</Button>
                    </TableCell>
                    <TableCell align="left">
                        <Button variant="outlined" size="small" color="secondary" onClick={() => deleteActivity(act.activityId)}>Delete</Button>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
        </TabPanel>
        </Grid>
        </Grid>

        {/* Add Activity dialog box */}
        <Dialog open={openDialog} onClose={handleEditDialogClose}>
            <DialogTitle>ADD ACTIVITY</DialogTitle>
            <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Activity Name"
                type="text"
                fullWidth
                variant="outlined"
                size="small"
                onChange={(e) => setActivityName(e.target.value)}
            />
            <TextField
                autoFocus
                margin="dense"
                id="desc"
                label="Activity Description"
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                size="small"
                onChange={(e) => setActivityDescription(e.target.value)}
            />
            <TextField
                autoFocus
                margin="dense"
                id="amt"
                label="Activity Charges"
                type="text"
                fullWidth
                variant="outlined"
                size="small"
                onChange={(e) => setActivityCharges(e.target.value)}
            />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleEditDialogClose}>Cancel</Button>
                <Button onClick={addActivity}>ADD</Button>
            </DialogActions>
      </Dialog>

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

        {/* Alert snack bar */}
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Action successfull !!
            </Alert>
      </Snackbar>
    </Box>
    );
}