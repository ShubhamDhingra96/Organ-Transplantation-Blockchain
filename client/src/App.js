import React, { Component } from "react";
import SimpleStorage from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import loginImg from "./images.jpg";
import './App.scss';
//import { Login, Register } from "./components/login/index";


class App extends Component {
 // constructor(props) {
  //  super(props);
  //  test = {
   //   isLogginActive: true
   // };
  //}
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorage.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorage.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
     contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    //const { isLogginActive } = test;
    //const current = isLogginActive ? "Register" : "Login";
    return (
      <div className="base-container">
      <div className="header">Register</div>
      <div className="content">
        <div className="image">
          <img src={loginImg} alt="Logo"/>
        </div>
        <div className="form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" name="username" placeholder="username" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="text" name="email" placeholder="email" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="text" name="password" placeholder="password" />
          </div>
        </div>
      </div>
      <div className="footer">
        <button type="button" className="btn">
          Register
        </button>
      </div>
    </div>
    );
  }
}

export default App;
