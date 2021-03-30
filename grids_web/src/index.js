import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Router } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app/i18n';
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

ReactDOM.render(
  <Suspense fallback={(<div>Loading</div>)}>
    <Router history={history}>
      <App />
    </Router>
  </Suspense>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
