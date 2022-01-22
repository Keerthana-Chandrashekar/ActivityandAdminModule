import React, { useEffect, useState} from 'react';
import axios from 'axios';
import {
    Box,
} from '@material-ui/core';

export default function AdminProfile() {

    return(
        <Box component="section" sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 40}} >
            <Box sx={{height: 150, borderRadius: 5, background: 'red'}}></Box>
        </Box>
    );
}