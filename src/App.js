import React, {Component} from 'react';
import logo from './logo.svg';
import Caro from './Caro';
import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                </header>
                <p className="App-intro">
                    My Caro
                </p>

                <Caro cols="29" rows="13" />
            </div>
        );
    }
}

export default App;
