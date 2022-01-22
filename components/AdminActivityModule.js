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

// Get activity URL
const baseURL = `http://localhost:8080/api/`
const getActivityURL = `${baseURL}/getAllActivities`;



export default function AdminActivityModule() {

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
 
    // All Activity Related methods :
    // Get list of activities
    const [activity, setActivity] = useState([]);
    useEffect( () => {
        axios.get(getActivityURL).then( response => {
            setActivity(response.data);
        })
    }, []);
    
    // For Add activity dialog box
    const [openDialog, setDialogOpen] = React.useState(false);

    const handleEditDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setDialogOpen(false);
    };

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

    // For edit activity 
    // To open the dit dialog box
    const [openActEditDialog, setActDialogOpen] = React.useState(false);
    const handleActEditDialogClose = () => {
        setActDialogOpen(false);
    };
    // To load the details of activity to edit : get by id
    const [activityToEdit, setActivityToEdit] = React.useState({});

    const getActivityById = (id) => {
        axios.get(`http://localhost:8080/api/getActivityById/${id}`).then( response => {
            setActivityToEdit(response.data);
            setActDialogOpen(true);
        })
    };

    const updateActHandler = (e) => {
        const id = activityToEdit.activityId;
        updateActivityDetails(id,activityToEdit);
        e.preventDefault();
    }
    const updateActivityDetails = (id,data) => {
        axios.put(`${baseURL}/updateActivityById/${id}`,
        data).then( res => {
            setActDialogOpen(false);
            setOpen(true);
            axios.get(getActivityURL).then( response => {
                setActivity(response.data);
            })
        })
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
    
    return (
        <Box>
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
                            {act.activityName}
                        </TableCell>
                        <TableCell align="left">{act.description}</TableCell>
                        <TableCell align="left">{act.charges}/-</TableCell>
                        <TableCell align="left">
                            <Button variant='outlined' size="small" color="primary" onClick={() => getActivityById(act.activityId)}>Edit</Button>
                        </TableCell>
                        <TableCell align="left">
                            <Button variant="outlined" size="small" color="secondary" onClick={() => deleteActivity(act.activityId)}>Delete</Button>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>

        {/* Add Activity dialog box */}
        <Dialog open={openDialog} onClose={handleEditDialogClose}>
            <DialogTitle>ADD ACTIVITY</DialogTitle>
            <DialogContent>
            <TextField
                autoFocus
                margin="dense"
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

      {/* Edit Activity dialog box */}
      <Dialog open={openActEditDialog} onClose={handleActEditDialogClose}>
            <DialogTitle>Update Activity</DialogTitle>
                <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Activity Name"
                    type="email"
                    fullWidth
                    variant="standard"
                    defaultValue={activityToEdit.activityName}
                    onChange={(e) => setActivityToEdit({...activityToEdit, activityName :e.target.value})}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Activity Description"
                    type="email"
                    fullWidth
                    variant="standard"
                    defaultValue={activityToEdit.description}
                    onChange={(e) => setActivityToEdit({...activityToEdit, description :e.target.value})}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Activity Charge"
                    type="email"
                    fullWidth
                    variant="standard"
                    defaultValue={activityToEdit.charges}
                    onChange={(e) => setActivityToEdit({...activityToEdit, charges :e.target.value})}
            />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleActEditDialogClose}>Cancel</Button>
                    <Button onClick={updateActHandler}>Update</Button>
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