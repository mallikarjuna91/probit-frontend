import React from 'react';
import Appbar from './AppBar/AppBar';
import Footer from './Footer/Footer'
import style from './App.css'

export default ({children}) => {
  return (
    <div id="container">
        <Appbar></Appbar>
        <div id={style.childContent}>{children}</div>
        <Footer></Footer>
    </div>
  );
}
