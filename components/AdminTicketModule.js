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
    tabBtn: {
    background: 'linear-gradient(to right,  #16222a, #3a6073)',
    color: 'white',
    },
    tableHeadStyle: {
        background: 'linear-gradient(to right,  #16222a, #3a6073)',
        color: 'white',
    }
  });

// for snack bar
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Table columns
const columns = ['Ticket Id','User Name','User Phone','Date of booking','Activity Name','BillAmount']

// Get tickets URL
const baseURL = `http://localhost:8080/api/`
const getTicketURL = `http://localhost:8080/api/getAllTickets`;


export default function AdminTicketModule() {

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

    // All ticket related methods :
    // Get list of tickets
    const [tickets, setTickets] = useState([]);
    useEffect( () => {
        axios.get(getTicketURL).then( response => {
            setTickets(response.data);
        })
    }, []);

    // For adding a ticket
    const [bill, setBill] = useState();
    const [dateTime, setDateTime] = useState();
    const [activity, setActivity] = useState({});
    const [customer, setCustomer] = useState({});

    // For Add ticket dialog box
    const [openDialog, setDialogOpen] = React.useState(false);

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const data = {bill, dateTime, activity, customer};
    const ticketHandler = (e) => {
        insertTicketDetails(data);
        console.log(data);
        e.preventDefault();
    };

    const insertTicketDetails = (data) => {
        axios.post(`http://localhost:8080/api/insertTicket`, data).then(
            (response) => {
                setDialogOpen(false);
                setOpen(true);
                axios.get(getTicketURL).then( response => {
                    setTickets(response.data);
                })
            },
            (error) => {
                console.log(error);
                console.log("Error");
            }
        )
    }

    // For Edit ticket dialog box
    const [openEditDialog, setEditDialogOpen] = React.useState(false);

    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
    };

    // For updating ticket
    // To load the details of activity to edit : get by id
    const [ticketToEdit, setTicketToEdit] = React.useState({});
    //  Get ticket by id
    const getTicketById = (id) => {
        axios.get(`${baseURL}/getTicketById/${id}`).then( response => {
            setTicketToEdit(response.data);
            setEditDialogOpen(true);
        })
    };

    // For deleting a ticket
    const deleteTicket = (id) => {
        axios.delete(`${baseURL}/deleteTicketById/${id}`).then( res => {
            setOpen(true);
            axios.get(getTicketURL).then( response => {
                setTickets(response.data);
            })
        });
    }

    return (
        <Box >
        {/* Ticket booking table */}
            <StyledAddButton sx={{float:'right'}} variant="contained" onClick={handleDialogOpen}>Add Ticket</StyledAddButton>
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead className={classes.tableHeadStyle}>
                <TableRow>
                    {
                        columns.map( (name,index) => {
                            return (
                                <StyledTableCell key={index}>{name}</StyledTableCell>
                            )
                        })
                    }
                    
                <StyledTableCell align="center" colSpan={2}>Action</StyledTableCell>
                </TableRow>
                </TableHead>
                
                <TableBody>
                {tickets.map((ticket, index) => (
                    <TableRow
                    key={ticket.ticketId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell component="th">{ticket.ticketId}</TableCell>
                    <TableCell align="left">{ticket.customer.username}</TableCell>
                    <TableCell align="left">{ticket.customer.mobileNumber}</TableCell>
                    <TableCell align="left">{ticket.dateTime}</TableCell>
                    <TableCell align="left">{ticket.activity.activityName}</TableCell>
                    <TableCell align="left">{ticket.bill}/-</TableCell>
                    <TableCell align="left">
                        <Button variant='outlined' size="small" color="primary" onClick={() => getTicketById(ticket.ticketId)}>Edit</Button>
                    </TableCell>
                    <TableCell align="left">
                        <Button variant="outlined" size="small" color="secondary" onClick={() => deleteTicket(ticket.ticketId)}>Delete</Button>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>

        {/* Add Ticket dialog box */}
        <Dialog open={openDialog} onClose={handleDialogClose}>
            <DialogTitle>ADD TICKET</DialogTitle>
            <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                label='Bill'
                type='number'
                fullWidth
                variant="outlined"
                size="small"
                onChange={ (e) => {
                    setBill(e.target.value)
                }}
            />
            <TextField
                autoFocus
                margin="dense"
                type='datetime-local'
                rows={4}
                fullWidth
                variant="outlined"
                size="small"
                onChange={ (e) => {
                    setDateTime(e.target.value)
                }}
            />
            <TextField
                autoFocus
                margin="dense"
                label="Activity ID"
                type="number"
                fullWidth
                variant="outlined"
                size="small"
                onChange={ (e) => {
                    setActivity({...activity, activityId:e.target.value})
                }}
            />
            <TextField
                autoFocus
                margin="dense"
                label='User Id'
                type='number'
                fullWidth
                variant="outlined"
                size="small"
                onChange={ (e) => {
                    setCustomer({...customer, userId:e.target.value})
                }}
            />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogClose}>Cancel</Button>
                <Button onClick={ticketHandler}>ADD</Button>
            </DialogActions>
      </Dialog>

      {/* edit Ticket dialog box */}
      <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
            <DialogTitle>UPDATE TICKET</DialogTitle>
            <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                label='Bill'
                type='number'
                fullWidth
                variant="outlined"
                size="small"
            />
            <TextField
                autoFocus
                margin="dense"
                type='datetime-local'
                rows={4}
                fullWidth
                variant="outlined"
                size="small"
            />
            <TextField
                autoFocus
                margin="dense"
                label="Activity ID"
                type="number"
                fullWidth
                variant="outlined"
                size="small"
            />
            <TextField
                autoFocus
                margin="dense"
                label='User Id'
                type='number'
                fullWidth
                variant="outlined"
                size="small"
            />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleEditDialogClose}>Cancel</Button>
                <Button onClick={ticketHandler}>UPDATE</Button>
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