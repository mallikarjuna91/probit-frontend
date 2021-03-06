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
          units:0,
          pendingStates:[]
      }
       this.userName = "";
  }

  componentDidMount() {
       this.userName = localStorage.getItem("userName");
      fetch("api/user/"+this.userName).then((response) => {
        return response.json();
      })
        .then((json) => {
            let userStocks = [];
            json.stock && json.stock.forEach((stock) => {
                if(stock.quantity > 0) {
                    let currentStock = stocks.filter((stockFromList) => {
                        return stockFromList.name === stock.stock;
                    });
                    currentStock = currentStock[0];
                    stock.worth = currentStock.price * stock.quantity;
                    stock.price = currentStock.price;
                    userStocks.push(stock);
              }
            });
            let pendingStates =[];
            json.buy.forEach((stock)=> {
                let currentStock = stocks.filter((stockFromList) => {
                    return stockFromList.name === stock.shareId;
                });
                currentStock = currentStock[0];
                stock.stock = stock.shareId;
                stock.quantity = stock.sharePoints;
                stock.worth = currentStock.price * stock.sharePoints;
                stock.price = currentStock.price;
                pendingStates.push(stock);
            });
            this.setState({
                userStocks:userStocks,
                pendingStates:pendingStates
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
          "name":this.userName,
          "shareId" : this.state.selectedStock.stock,
          "bitShare" : this.state.tradePrice,
          "shareAmount" : this.state.selectedStock.price,
          "sharePoints": this.state.units
      };

      fetch("/api/sell",{
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

  onSliderChange = (newPrice) => {
      let units = newPrice && newPrice/this.state.selectedStock.price;
      units = Math.round(units*100)/100;

      this.setState({
          tradePrice: newPrice,
          units: units
      });
  }

  render() {
      console.log(this.state.userStocks.length > 0 || this.state.pendingStates.length > 0,"true or false");
    return (
        <div className={styles.stockList}>
            <div className={styles.header}>
                <div>Stocks</div>
                <div> Units</div>
                <div> Worth</div>
                <div>Buy</div>
            </div>
            {
                this.state.userStocks.map((stock, key) => {
                    return <div className={styles.list} >
                        <div className={styles.name}>{stock.stock}</div>
                        <div className={styles.units}>{stock.quantity}</div>
                        <div className={styles.price}>${stock.worth}</div>
                        <Button color="danger" onClick={this.openModal(stock)}>Sell</Button>
                    </div>;
                    })
            }
            {
                this.state.pendingStates.map((stock, key) => {
                    return <div className={styles.list} >
                        <div className={styles.name}>{stock.stock}</div>
                        <div className={styles.units}>{stock.quantity}</div>
                        <div className={styles.price}>${stock.worth}</div>
                        <Button color="danger" disabled onClick={this.openModal(stock)}>Hold</Button>
                    </div>;
                    })
            }
            { this.state.userStocks.length > 0 || this.state.pendingStates.length > 0 ?
                    null :
                 <div className={styles.note}>No Stocks found </div>
            }

            <Modal
                isOpen={this.state.isModalOpen}
                closeModal={this.closeModal}
                sliderMax={this.state.selectedStock.worth}
                tradeValue={this.state.tradePrice}
                sliderChange={this.onSliderChange}
                units={this.state.units}
                onSell={this.onSell}
                />
        </div>
    );
  }
}
