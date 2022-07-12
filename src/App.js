import logo from './logo.svg';
import './App.css';
import Login from './Login.js';
import React from 'react';
import MainPage from './MainPage';

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        korisnicko:'',
        lozinka:'',
        admin:0,
        loginVisible:'visible',
        mainVisible:'invisible d-none'
    };
    let key = localStorage.cookie!==undefined?'token':null;
    let cookie = key!==null?this.getCookie(key):"";
    if(cookie !==""){
      this.state.loginVisible='invisible d-none';
      this.state.mainVisible='visible';
      this.state.admin=parseInt(localStorage.cookie1);
    }
}

getCookie(key) {
  var b = localStorage.cookie.match(key + "\\s*=\\s*([^;]+)");
  return b ? b.pop() : "";
}

loginVisibility=(event)=>{
  this.setState({loginVisible:'invisible d-none',mainVisible:'visible'});
}

isAdmin=(admin)=>{
  this.setState({admin:admin});
}
logOff=()=>{
  this.setState({loginVisible:'visible',mainVisible:'invisible d-none'});
  localStorage.clear("cookie");
  localStorage.clear("cookie1");
}

   render() {
    return (
      <div className="App">
        <div className={this.state.loginVisible}>
          <Login setVisibilityLogin= {this.loginVisibility} setAdmin={this.isAdmin}></Login>
        </div>
        <div className = {this.state.mainVisible}>
          <MainPage setLogOff={this.logOff} isAdmin={this.state.admin}></MainPage>
        </div>
      </div>
    );
  }
}