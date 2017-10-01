import React from 'react';
import style from './Modal.css';
import Modal from 'react-modal';
import Button from 'muicss/lib/react/button';
import Slider, { Range } from 'rc-slider';
import Tooltip from 'rc-tooltip';


const Handle = Slider.Handle;
const customStyles = {
  content : {
    top                   : '40%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};


const handle = (props) => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

export default (props) => {
    console.log(props.tradeValue);
  return (
          <Modal
            isOpen={props.isOpen}
            contentLabel="Modal"
            style={customStyles}
          >
            <div>
                <Slider min={0} max={props.sliderMax} step="10" handle={handle} onChange={props.sliderChange}/>
            </div>
            <div id="price">
                Invest: {props.tradeValue} $
            </div>
            <div id="units">
                Units: {props.units}
            </div>
            <Button color="danger" onClick={props.closeModal}>Cancel</Button>
            <Button color="primary" onClick={props.onBuy}>Buy</Button>
         </Modal>
   );
}
