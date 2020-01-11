import React from 'react';
// import './App.css';
import {connect} from 'react-redux';
import {startQuery, stopQuery, getQueryStatus, QUERY_STATUS, getQueryInfo} from './info';

class App extends React.Component<any> {
  inputRef:any = React.createRef();

  render () {
    const {account, querying, onQuery, onStop} = this.props;
    return (
      <div>
        <input type={"text"} placeholder={"EOS Account"} ref={this.inputRef} />
        <button onClick={()=>onQuery(this.inputRef.current.value)} disabled={querying} style={{marginLeft: '4px'}}>
          Query
        </button>
        <button onClick={onStop} disabled={!querying} style={{marginLeft: '4px'}}>
          Stop
        </button>
        <div> {account} </div>
      </div>
    );
  }
}

const mapStateToProps = (state:any, ownProps:any) => {
  return {
    querying: getQueryStatus() > QUERY_STATUS.STOPPED,
    account: getQueryInfo().account,
    queryinfo: getQueryInfo()
  }
}

const mapDispatchToProps = (dispatch:any, ownProps:any) => {
  return {
    onQuery: (account: string)=>{ account.length > 0 && startQuery(account) },
    onStop: ()=>stopQuery()
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
