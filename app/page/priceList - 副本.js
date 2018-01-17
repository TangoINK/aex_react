import React from 'react';
import axios from 'axios';
import './priceList.scss';
import { btcArr, bitcnyArr, bitusdArr, glb_cny_fixed, glb_btc_fixed, glb_bitcny_fixed, glb_bitusd_fixed } from '../data/coinConfig';


let markets = null;
let timer = null;

function getFixedNum(mkType, coinName) {
    var s = mkType.toLowerCase();
    if (s == "btc") {
        return glb_btc_fixed[coinName.toLowerCase()] ? glb_btc_fixed[coinName.toLowerCase()] : 0;
    }else if(s == "cny"){
        return glb_cny_fixed[coinName.toLowerCase()] ? glb_cny_fixed[coinName.toLowerCase()] : 0;
    }else if(s == "bitcny"){
        return glb_bitcny_fixed[coinName.toLowerCase()] ? glb_bitcny_fixed[coinName.toLowerCase()] : 0;
    }else{
        return glb_bitusd_fixed[coinName.toLowerCase()] ? glb_bitusd_fixed[coinName.toLowerCase()] : 0;
    }
}

let priceList = React.createClass({
    getInitialState() {
        return {
            marketType: 'btc',
            bitcny: 0,
            cny: 0,
            usd: 0,
            market: [],
            isHide: {
            	display:'none'
            }
        }
    },
    componentWillMount() {
        this.getMarketsData();
        timer = setInterval(this.getMarketsData,60000);
    },
    componentWillUnmount() {
    	clearInterval(timer);
    },
    getMarketsData(){
		axios.get('/app/data/markets.json').then((res) => {
            markets = res.data;

            this.setState({
            	bitcny: markets['btc2bitcny'],
            	cny: markets['xchgrate'][0]['rate'],
            	usd: markets['xchgrate'][1]['rate'],
                market: this.makeMarketData(this.state.marketType)
            });
        })
    },
    chooseMarketArea(e) {
        let ele = e.target;
        this.setState({
            marketType: ele.getAttribute('data-markettype'),
            market: this.makeMarketData(ele.getAttribute('data-markettype'))
        });
    },
    formatMarketType() {
        switch (this.state.marketType) {
        case 'btc':
            return 'BTC';
            break;
        case 'bitcny':
            return 'BitCNY';
            break;
        case 'bitusd':
            return 'BitUSD';
            break;
        }
    },
    formatnumber(value, num) {
    	if (isNaN(value)) value = 0;
        var a,b,c,i;
        a = parseFloat(value).toFixed(10).toString();
        b = a.indexOf(".");
        c = a.length;
        if (num == 0) {
            if (b != -1) {
                a = a.substring(0, b);
            }
        } else { //如果没有小数点
            if (b == -1) {
                a = a + ".";
                for (i = 1; i <= num; i++) {
                    a = a + "0";
                }
            } else { //有小数点，超出位数自动截取，否则补0
                a = a.substring(0, b + num + 1);
                for (i = c; i <= b + num; i++) {
                    a = a + "0";
                }
            }
        }
        return a;
    },
    makeMarketData(makretType='btc') {
        let coinList = null;
        let coinName = '';
        switch (makretType) {
        case 'btc':
            coinList = btcArr;
            break;
        case 'bitcny':
            coinList = bitcnyArr;
            break;
        case 'bitusd':
            coinList = bitusdArr;
            break;
        }
        let marketsArr = [];
        for (let coin in coinList) {
            let coinFigure = {};
            let price = markets[`${coin}2${makretType}`] || 0;
            let price24 = markets[`${coin}2${makretType}_24h`] || 0;

            coinFigure.name = coin;
            coinFigure.price = price;
            coinFigure.price24 = price24;
            coinFigure.lowPrice = markets[`${coin}2${makretType}_low`] || 0;
            coinFigure.highPrice = markets[`${coin}2${makretType}_high`] || 0;
            coinFigure.vol = markets[`${coin}2${makretType}_vol`] || 0;

			let per = isNaN((parseFloat((price / price24) - 1) * 100)) ? 0 : parseFloat((price / price24 - 1) * 100);

            coinFigure.per = this.formatnumber(per,1);

            marketsArr.push(coinFigure);
        }
        return marketsArr;
    },
    exchangePrice(price,marketType='btc',name){
    	let rate;
    	switch (marketType) {
        case 'btc':
            rate = this.state.bitcny;
            break;
        case 'bitcny':
            rate = 1;
            break;
        case 'bitusd':
            rate = this.state.cny;
            break;
        }

        return this.formatnumber(price * rate,getFixedNum('cny',name))

    },
	handlerMouseOver(e){
		let exchangePriceEle = e.currentTarget.getElementsByClassName('exchange-price');
		for (var i = 0; i < exchangePriceEle.length; i++) {
			exchangePriceEle[i].style.display='inline';
		}
	},
	handlerMouseOut(e){
		let exchangePriceEle = e.currentTarget.getElementsByClassName('exchange-price');
		for (var i = 0; i < exchangePriceEle.length; i++) {
			exchangePriceEle[i].style.display='none';
		}
	},
    render() {
        return (
            <div className="components-pricelist">
				<div className="nav-wrap">
					<nav className="area-nav container">
						<a href="javascript:;"
			            className={this.state.marketType === 'btc' ? 'active' : ''}
			            data-markettype="btc"
			            onClick={this.chooseMarketArea}>BTC交易区</a>

						<a href="javascript:;"
			            className={this.state.marketType === 'bitcny' ? 'active' : ''}
			            data-markettype="bitcny"
			            onClick={this.chooseMarketArea}>BitCNY交易区</a>

						<a href="javascript:;"
			            className={this.state.marketType === 'bitusd' ? 'active' : ''}
			            data-markettype="bitusd"
			            onClick={this.chooseMarketArea}>BitUSD交易区</a>
					</nav>
				</div>
				<selction>
					<div className="sub-nav-wrap">
						<ul className="sub-nav container">
							<li className="col-1">币种名称</li>
							<li className="col-2">币价（{this.formatMarketType(this.state.marketType)}）</li>
							<li className="col-3">涨跌幅</li>
							<li className="col-4">最低价</li>
							<li className="col-5">最高价</li>
							<li className="col-6">成交额（{this.formatMarketType(this.state.marketType)}）</li>
						</ul>
					</div>
					<div className="coin-list container">
						<ul>
							{this.state.market.map((item, index) => {
                			return <li key={`${item.name}-${index}`} onMouseOver={this.handlerMouseOver} onMouseOut={this.handlerMouseOut}>
									<span className="col-1">
										<i className={`currency-logo-sprite s-s-${item.name}`}></i>
										{item.name.toUpperCase()}<strong>/{this.formatMarketType(this.state.marketType)}</strong>
									</span>
									<span className={`col-2 ${item.per >= 0 ? 'font-color-green' : 'font-color-red'}`}>{this.formatnumber(item.price,getFixedNum(this.state.marketType,item.name))} <span className="exchange-price">/￥{this.exchangePrice(item.price,this.state.marketType,item.name)}</span></span>
									<span className={`col-3 ${item.per >= 0 ? 'font-color-green' : 'font-color-red'}`}>{`${item.per >= 0 ? "+"+item.per : item.per}`}%</span>
									<span className="col-4">{this.formatnumber(item.lowPrice,getFixedNum(this.state.marketType,item.name))} <span className="exchange-price">/￥{this.exchangePrice(item.lowPrice,this.state.marketType,item.name)}</span></span>
									<span className="col-5">{this.formatnumber(item.highPrice,getFixedNum(this.state.marketType,item.name))} <span className="exchange-price">/￥{this.exchangePrice(item.highPrice,this.state.marketType,item.name)}</span></span>
									<span className="col-6">{this.formatnumber(item.vol, 2)}</span>
									<span className="col-7"><a target="_blank" href={`https://www.aex.com/page/trade.html?mk_type=${this.formatMarketType(this.state.marketType)}&trade_coin_name=${item.name.toUpperCase()}`}>交易 <i></i></a></span>
								</li>
            				})}
						</ul>
					</div>
				</selction>
            </div>
        );
    }
})

export default priceList;