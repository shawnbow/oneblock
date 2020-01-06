import React from 'react';
import AccountView from './AccountView';
import logo from './logo.svg';

interface AppState {
  accountName: string;
}

class App extends React.Component {
  state: AppState = {
    accountName: ""
  }
  num: number = 0;
  fetchTimer1: NodeJS.Timeout | undefined;
  

  handleAccountChange = (e:any)=>{
    this.setState({accountName: e.target.value});
  }

  componentDidMount() {
    this.fetchTimer1 = setInterval(()=>{this.num ++}, 1000);
  }
  
  componentWillUnmount() {
    if (this.fetchTimer1) {
      clearInterval(this.fetchTimer1);
      this.fetchTimer1 = undefined;
    }
  }

  render() {
    return (
      <div>
        <form>
          <input type="text" placeholder="Input EOS Account" value={this.state.accountName} onChange={this.handleAccountChange} />
          <button> Search </button>
        </form>
        <AccountView vars={{account:this.num.toString()}} />
      </div>
    );
  }
}


export default App;
