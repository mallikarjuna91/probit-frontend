import React from 'react';
import { browserHistory } from 'react-router';
import Button from 'muicss/lib/react/button';
import Modal from '../../common/components/SellModal/Modal';
import styles from './style.css';
import stocks from "../../common/utils/Data"

export default class TradePage extends React.Component {

  constructor() {
      super();
      this.state = {
          isModalOpen : false,
          tradePrice:0,
          accountBalance:1000,
          selectedStock:{},
          userStocks:[],
          units:0
      }
  }

  componentDidMount() {
      fetch("api/user").then((response) => {
        return response.json();
      })
        .then((json) => {
            let userStocks = [];
            json.stock.forEach((stock) => {
                let currentStock = stocks.filter((stockFromList) => {
                    return stockFromList.name === stock.stock;
                });
                currentStock = currentStock[0];
                stock.worth = currentStock.price * stock.quantity;
                stock.price = currentStock.price;
                userStocks.push(stock);
            });
            this.setState({
                userStocks:userStocks
            });
        })
        .catch(function(error) {
             console.log(error);
         });
  }

  closeModal = () => {
      this.setState({
          isModalOpen: false,
          tradePrice:0
      });
  }

  openModal = (stock) => {
    return () => {
        this.setState({
          isModalOpen: true,
          selectedStock:stock,
          units:0
        });
    };
  }

  onSell = () => {
      var data = {
          "probitId" : 1,
          "shareId" : this.state.selectedStock,
          "bitShare" : this.state.tradePrice,
          "shareAmount" : this.state.selectedStock.price,
          "sharePoints": this.state.units
      };

      fetch("/api/buy",{
            method: "POST",
            body: data
        }).then(() => {
            this.setState({
                isModalOpen: false,
                tradePrice: 0,
                units: 0
            });
        });
  }

  onSliderChange = (newPrice) => {
      let units = newPrice && newPrice/this.state.selectedStock.price;
      units = Math.round(units*100)/100;

      this.setState({
          tradePrice: newPrice,
          units: units
      });
  }

  render() {
    return (
        <div className={styles.stockList}>
            <div className={styles.header}>
                <div>Stocks</div>
                <div> Units</div>
                <div> Worth</div>
                <div>Buy</div>
            </div>
            {
                this.state.userStocks.length > 0 ?
                    this.state.userStocks.map((stock, key) => {
                        return (<div className={styles.list} >
                            <div className={styles.name}>{stock.stock}</div>
                            <div className={styles.units}>{stock.quantity}</div>
                            <div className={styles.price}>{stock.worth}$</div>
                            <Button color="danger" onClick={this.openModal(stock)}>Sell</Button>
                        </div>);
                        })
                    : <div className={styles.note}>No Stocks found </div>
            }
            <Modal
                isOpen={this.state.isModalOpen}
                closeModal={this.closeModal}
                sliderMax={this.state.selectedStock.worth}
                tradeValue={this.state.tradePrice}
                sliderChange={this.onSliderChange}
                units={this.state.units}
                onSell={this.onSale}
                />
        </div>
    );
  }
}
