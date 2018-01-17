import React from 'react';
import axios from 'axios';
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

let coinPriceList = React.createClass({
	getInitialState() {
        return {
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
    componentWillReceiveProps(nextProps){
    	let rangType = nextProps.rangType;
    	let rangDesc = nextProps.rangDesc;
    	let marketType = nextProps.marketType;
    	if (this.props.marketType !== marketType || this.props.rangType !== rangType || this.props.rangDesc !== rangDesc) {
    		//console.log(nextProps.marketType,' next:',this.props.marketType);
			this.setState({
	        	marketType:nextProps.marketType,
	        	market: this.makeMarketData(marketType,rangType,rangDesc)
	        })
    	}
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
    makeMarketData(makretType='btc',rangType,rangDesc) {
    	//console.log(this.props.rangType,this.props.rangDesc);
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

        if (rangType === 'percent') {
        	if (rangDesc) {
        		marketsArr = marketsArr.sort(function(x, y) {
                    return y['per'] - x['per'];
                });
        	}else{
        		marketsArr = marketsArr.sort(function(x, y) {
                    return x['per'] - y['per'];
                });
        	}
        }

        if (rangType === 'volume') {
        	if (rangDesc) {
        		marketsArr = marketsArr.sort(function(x, y) {
                    return y['vol'] - x['vol'];
                });
        	}else{
        		marketsArr = marketsArr.sort(function(x, y) {
                    return x['vol'] - y['vol'];
                });
        	}
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
	returnCoinList(){
		let market = this.state.market;
		if (market.length) {
			return(
				<ul>
				{
					market.map((item, index) => {
						let name = item.name;
						let marketType = this.props.marketType;
						let per = item.per;
						let price = item.price;
						let lowPrice = item.lowPrice;
						let highPrice = item.highPrice;
					return <li key={`${item.name}-${index}`} onMouseOver={this.handlerMouseOver} onMouseOut={this.handlerMouseOut}>
							<span className="col-1"><i className={`currency-logo-sprite s-s-${name}`}></i>{name.toUpperCase()}<strong>/{this.props.formatMarketType(marketType)}</strong></span>
							<span className={`col-2 ${per >= 0 ? 'font-color-green' : 'font-color-red'}`}>{this.formatnumber(price,getFixedNum(marketType,name))} <span className="exchange-price">/￥{this.exchangePrice(price,marketType,name)}</span></span>
							<span className={`col-3 ${per >= 0 ? 'font-color-green' : 'font-color-red'}`}>{`${per >= 0 ? "+"+per : per}`}%</span>
							<span className="col-4">{this.formatnumber(lowPrice,getFixedNum(marketType,name))} <span className="exchange-price">/￥{this.exchangePrice(lowPrice,marketType,name)}</span></span>
							<span className="col-5">{this.formatnumber(highPrice,getFixedNum(marketType,name))} <span className="exchange-price">/￥{this.exchangePrice(highPrice,marketType,name)}</span></span>
							<span className="col-6">{this.formatnumber(item.vol, 2)}</span>
							<span className="col-7"><a target="_blank" href={`https://www.aex.com/page/trade.html?mk_type=${this.props.formatMarketType(marketType)}&trade_coin_name=${name}`}>交易 <i></i></a></span>
						</li>
					})
				}
				</ul>
			)
		}else{
			return(
				<div>
					<ul>
						<li className="over">
							<span className="col-1"><i className="currency-logo-sprite s-s-bcc"></i>BCC<strong>/{this.props.formatMarketType(this.props.marketType)}</strong></span>
							<span className="col-2">---</span>
							<span className="col-3">---</span>
							<span className="col-4">---</span>
							<span className="col-5">---</span>
							<span className="col-6">---</span>
							<span className="col-7"><a target="_blank" href="javascript:;">交易 <i></i></a></span>
						</li>
					</ul>
					<div className="waitting-trade"><p>等待开放</p></div>
				</div>
			)
		}
	},
    render() {
        return(
        	<div>{this.returnCoinList()}</div>
        )
    }
})

export default coinPriceList;
