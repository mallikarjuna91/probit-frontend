import React from 'react';
import Appbar from 'muicss/lib/react/appbar';
import Config from '../../utils/Config';
import style from './style.css';


let s1 = {verticalAlign: 'middle'};
let s2 = {textAlign: 'right'};

export default class AppBar extends React.Component {


    constructor(){
        super();
        this.state = ({
            name:"",
            accountBalance:""
        });
    }

    componentDidMount(){
        let userName = window.location.hash.split("#/")[1];
        if(userName){
            localStorage.setItem("userName", userName);
        }else {
            userName = localStorage.getItem("userName")
        }

        fetch("api/user/"+userName).then((response) => {
          return response.json();
        })
      .then((json) => {
          let balance = json.bal;
          json.buy.forEach(buyShare => {
              balance-=buyShare.bitShare;
          } )
          this.setState({
              name:json.name,
              accountBalance: balance
          });
      })
      .catch(function(error) { console.log(error); });
    }

    render() {
        return (
       <div>
          <Appbar>
              <table width="100%">
                  <tbody>
                    <tr style={s1}>
                      <td className={`mui--appbar-height ${style.logo}`}>
                      </td>
                      <td className={`${style.content}`}>
                            <a href="/"><div>Trade</div></a>
                            <a href="/Dashboard"><div>Dashboard</div></a>
                            <div className={style.userDetails}>
                                <div className={style.name}>name: {this.state.name}</div>
                                <div className={style.total}>Account Total: ${this.state.accountBalance} </div>
                            </div>
                        </td>
                    </tr>
                  </tbody>
                </table>
          </Appbar>
      </div>
    );
 }
}
