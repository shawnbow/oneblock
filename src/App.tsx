import React from 'react';
import logo from './logo.svg';
import './App.css';
import {connect} from 'react-redux';

class App extends React.Component<any> {
  render () {
    const {count} = this.props;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            { count }
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

const mapStateToProps = (state:any) => {
  return {
    count: state.vars.count
  }
}

// export default App;
export default connect(mapStateToProps)(App);
