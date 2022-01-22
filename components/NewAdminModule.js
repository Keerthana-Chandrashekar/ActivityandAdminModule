import React from 'react';
import { makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import {
    Box,
    Typography,
    Tab,
    Tabs,
    Grid,
} from '@material-ui/core';
import AdminTicketModule from './AdminTicketModule';
import AdminActivityModule from './AdminActivityModule';
import AdminCustomerModule from './AdminCustomerModule';
import AdminDashboard from './AdminDashboard';

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

export default function NewAdminModule() {

    // For side nav bar
    const [value, setValue] = React.useState(0);

    // For custom styling
    const classes = useStyles();

    // For side nav bar
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

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
            <AdminDashboard/>
        </TabPanel>

        {/* Customer List Table */}
        <TabPanel value={value} index={1}>
            <AdminCustomerModule/>
        </TabPanel>

        {/* Ticket booking table */}
        <TabPanel value={value} index={2}>
            <AdminTicketModule/>
        </TabPanel>

        {/* Activities List Table */}
        <TabPanel value={value} index={3}>
            <AdminActivityModule/>
        </TabPanel>
        </Grid>
        </Grid>
    </Box>
    );
}