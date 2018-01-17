import React from 'react';
import './priceList.scss';
import CoinPriceList from '../components/coinPriceList.js';
import { Router, Route, hashHistory, IndexRouter } from 'react-router';

let priceList = React.createClass({
    getInitialState() {
        return {
            marketType: 'btc',
            rangType: null, //排序类型
            rangDesc: true //默认降序排序
        }
    },
    
    chooseMarketArea(e) {
        let ele = e.currentTarget;
        this.setState({
            marketType: ele.getAttribute('data-markettype'),
            rangType: null,
            rangDesc: true
        });
    },
    formatMarketType(marketType) {
        switch (marketType) {
        case 'btc':
            return 'BTC';
            break;
        case 'bitcny':
            return 'BitCNY';
            break;
        case 'bitusd':
            return 'BitUSD';
            break;
        case 'bitjpy':
            return 'BitJPY';
            break;
        case 'bitkrw':
            return 'BitKRW';
            break;
        }
    },
    handleClickRankType(e){
        let ele = e.currentTarget;
        let type = ele.getAttribute('data-rangtype');
        let oldDesc = this.state.rangDesc;
        if (this.state.rangType) {
            oldDesc = !oldDesc;
            //console.log(this.state.rangType,type);
            if (this.state.rangType != type) {
                oldDesc = true
            }
        }

        this.setState({
            rangType: type,
            rangDesc: oldDesc
        })
    },
    
    render() {
        return (
            <div className="components-pricelist">
				<div className="nav-wrap">
					<nav className="area-nav container">
						<a href="javascript:;"
    			            className={this.state.marketType === 'btc' ? 'active' : ''}
    			            data-markettype="btc"
    			            onClick={this.chooseMarketArea}
                        >BTC交易区</a>
						<a href="javascript:;"
    			            className={this.state.marketType === 'bitcny' ? 'active' : ''}
    			            data-markettype="bitcny"
    			            onClick={this.chooseMarketArea}
                        >BitCNY交易区</a>
						<a href="javascript:;"
    			            className={this.state.marketType === 'bitusd' ? 'active' : ''}
    			            data-markettype="bitusd"
    			            onClick={this.chooseMarketArea}
                        >BitUSD交易区</a>
                        <a href="javascript:;"
                            className={this.state.marketType === 'bitjpy' ? 'active' : ''}
                            data-markettype="bitjpy"
                            onClick={this.chooseMarketArea}
                        >BitJPY交易区</a>
                        <a href="javascript:;"
                            className={this.state.marketType === 'bitkrw' ? 'active' : ''}
                            data-markettype="bitkrw"
                            onClick={this.chooseMarketArea}
                        >BitKRW交易区</a>
					</nav>
				</div>
				<div>
					<div className="sub-nav-wrap">
						<ul className="sub-nav container">
							<li className="col-1">币种名称</li>
							<li className="col-2">币价（{this.formatMarketType(this.state.marketType)}）</li>
							<li 
                                className={`col-3 ${this.state.rangType === "percent" ? 'active' : ''}`} 
                                data-rangtype="percent"
                                onClick={this.handleClickRankType}
                                >涨跌幅<em><i className={`up ${this.state.rangType === 'percent' && this.state.rangDesc ? 'up-active' : ''}`}></i><i  className={`down ${this.state.rangType === 'percent' && !this.state.rangDesc ? 'down-active' : ''}`}></i></em></li>
							<li className="col-4">最低价</li>
							<li className="col-5">最高价</li>
							<li 
                                className={`col-6 ${this.state.rangType === "volume" ? 'active' : ''}`} 
                                data-rangtype="volume"
                                onClick={this.handleClickRankType}
                                >成交额（{this.formatMarketType(this.state.marketType)}）<em><i className={`up ${this.state.rangType === 'volume' && this.state.rangDesc ? 'up-active' : ''}`}></i><i className={`down ${this.state.rangType === 'volume' && !this.state.rangDesc ? 'down-active' : ''}`}></i></em></li>
						</ul>
					</div>
					<div className="coin-list container">				
                        <CoinPriceList 
                            marketType={this.state.marketType} 
                            formatMarketType={this.formatMarketType}
                            rangType={this.state.rangType}
                            rangDesc={this.state.rangDesc}
                        >
                        </CoinPriceList>
					</div>
				</div>
            </div>
        );
    }
})

export default priceList;