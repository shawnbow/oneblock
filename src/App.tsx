import React from 'react';
import logo from './logo.svg';
import './App.css';
import {connect} from 'react-redux';
import { setVars } from './store/actions';
import { store } from './store';

class App extends React.Component<any> {
  render () {
    const {count, add} = this.props;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            { count }: {console.log(this.props)}
          </p>
          <button onClick={add}>
            Learn React
          </button>
        </header>
      </div>
    );
  }
}

const mapStateToProps = (state:any, ownProps:any) => {
  return {
    count: state.vars.count
  }
}

const mapDispatchToProps = (dispatch:any, ownProps:any) => {
  return {
    add: ()=>dispatch(setVars("count", store.getState().vars.count + 1))
  }
}

// export default App;
export default connect(mapStateToProps, mapDispatchToProps)(App);
