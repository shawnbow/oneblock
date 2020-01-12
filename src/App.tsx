import React from 'react';
// import './App.css';
import {connect} from 'react-redux';
import {startQuery, getQueryStatus, QUERY_STATUS, getQueryInfo, ITxInfo} from './info';

class App extends React.Component<any> {
  inputRef:any = React.createRef();

  render () {
    const {account, querying, onQuery, transferinfo} = this.props;
    return (
      <div>
        <input type={"text"} placeholder={"EOS Account"} ref={this.inputRef} />
        <button onClick={()=>onQuery(this.inputRef.current.value)} disabled={querying} style={{marginLeft: '4px'}}>
          Query
        </button>
        <p/>
        Account: {account}
        {transferinfo.map((item:ITxInfo) => {
          return (
            <li>
              {item.peer} - {item.amount} - {item.memo}
            </li>
          )
        })}
      </div>
    );
  }
}

const mapStateToProps = (state:any, ownProps:any) => {
  return {
    querying: getQueryStatus() > QUERY_STATUS.STOPPED,
    account: getQueryInfo().account,
    len: getQueryInfo().transferinfo.length,
    transferinfo: getQueryInfo().transferinfo,
  }
}

const mapDispatchToProps = (dispatch:any, ownProps:any) => {
  return {
    onQuery: (account: string)=>{ account.length > 0 && startQuery(account) },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
