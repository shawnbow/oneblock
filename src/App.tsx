import React from 'react';
// import './App.css';
import {connect} from 'react-redux';
import {getAccount, setAccount, startQuery, stopQuery, getQueryStatus, QUERY_STATUS} from './info';

class App extends React.Component<any> {
  render () {
    const {account, querying, onAccountChange, onQuery, onStop} = this.props;
    return (
      <div>
        <input type={"text"} placeholder={"EOS Account"} value={account} onChange={(e)=>onAccountChange(e.target.value)} />
        <button onClick={onQuery} disabled={querying} style={{marginLeft: '4px'}}>
          Query
        </button>
        <button onClick={onStop} disabled={!querying} style={{marginLeft: '4px'}}>
          Stop
        </button>
        <div> {"asdfad"} </div>
      </div>
    );
  }
}

const mapStateToProps = (state:any, ownProps:any) => {
  return {
    account: getAccount(),
    querying: getQueryStatus() === QUERY_STATUS.ONGOING
  }
}

const mapDispatchToProps = (dispatch:any, ownProps:any) => {
  return {
    onAccountChange: (account: string)=>setAccount(account),
    onQuery: ()=>startQuery(),
    onStop: ()=>stopQuery()
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
