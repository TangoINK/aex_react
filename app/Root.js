import React from 'react';
import PriceList from './page/priceList.js';
import { Router, Route, hashHistory, IndexRouter } from 'react-router';
let Root = React.createClass({
    render() {
        return (
            <div className="container-wrap">
				<PriceList/>
            </div>
        );
    }
})

export default Root;