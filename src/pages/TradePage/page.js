import React from 'react';
import { browserHistory } from 'react-router';
import Button from 'muicss/lib/react/button';
import Modal from '../../common/components/Modal/Modal';
import styles from './style.css';
import stocks from "../../common/utils/Data"

export default class TradePage extends React.Component {

  constructor() {
      super();
      this.state = {
          isModalOpen : false,
          tradePrice:0,
          accountBalance:0,
          selectedStock:{},
          units:0
      }
      this.userName = "";
  }

  componentDidMount() {
     this.userName = window.location.hash.split("#/")[1];
     if(!this.userName){
         this.userName = localStorage.getItem("userName");
     }
     fetch("api/user/"+this.userName).then((response) => {
        return response.json();
     }).then((json) => {
         let balance = json.bal;
         json.buy.forEach(buyShare => {
             balance-=buyShare.bitShare;
         } )
         this.setState({
             accountBalance:balance
         })
     });
   }

  closeModal = () => {
      this.setState({
          isModalOpen: false,
          tradePrice: 0,
          units: 0
      });
  }

  openModal = (stock) => {
    return () => {
        this.setState({
          isModalOpen: true,
          selectedStock:stock
        });
    };
  }

  onSliderChange = (newPrice) => {
      let units = newPrice && newPrice/this.state.selectedStock.price;
      units = Math.round(units*100)/100;

      this.setState({
          tradePrice: newPrice,
          units: units
      });
  }

  onBuy = () => {
      var data = {
          "name":this.userName,
          "shareId" : this.state.selectedStock.name,
          "bitShare" : this.state.tradePrice,
          "shareAmount" : this.state.selectedStock.price,
          "sharePoints": this.state.units
      };

      fetch("/api/buy",{
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
             }
           }).then(() => {
            this.setState({
                isModalOpen: false,
                tradePrice: 0,
                units: 0
            });
        });
  }



  render() {
    return (
        <div className={styles.stockList}>
            <div className={styles.header}>
                <div className={styles.name}>Stocks</div>
                <div> Price</div>
                <div>Buy</div>
            </div>
            {
                stocks.map((stock, key) => {
                    return (<div key={key} className={styles.list}>
                                <div className={styles.name}>{stock.name}</div>
                                <div className={styles.price}>${stock.price}</div>
                                <Button color="primary" className={styles.buy} onClick={this.openModal(stock)}>Buy</Button>
                            </div>);
                    })
            }
            <Modal isOpen={this.state.isModalOpen}
                closeModal={this.closeModal}
                sliderMax={this.state.accountBalance}
                tradeValue={this.state.tradePrice}
                sliderChange={this.onSliderChange}
                units={this.state.units}
                onBuy={this.onBuy}
                />
      </div>
    );
  }
}
