import React from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import ShoppingCart from './pages/ShoppingCart';
import Product from './pages/Product';
import Checkout from './pages/Checkout';

function App() {
  return (
    <Switch>
      <Route exact path="/" component={ Home } />
      <Route exact path="/shoppingCart" component={ ShoppingCart } />
      <Route exact path="/product/:id" component={ Product } />
      <Route exact path="/checkout" component={ Checkout } />
    </Switch>
  );
}

export default App;
