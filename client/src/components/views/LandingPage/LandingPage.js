import React, { useEffect } from 'react';
import axios from 'axios';

function LandingPage(props) {

    useEffect(() => {
        axios.get('/api/landing')
        .then(rep => console.log(rep.data))
    }, [])
    

    return (
        <div>
            LandingPage
        </div>
    );
}

export default LandingPage;