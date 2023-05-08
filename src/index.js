import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/app/App.js';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
const getCoordinatesFromUrl = () => {
  const epsg = require('epsg');
  let toProj = epsg[`EPSG:4326`];
  let fromProj;
  let class_list = [...root._internalRoot.containerInfo.classList];
  if (root._internalRoot.containerInfo.classList.length !== 0) {
    for (let i = 0; i < class_list.length; i++) {
      root._internalRoot.containerInfo.classList.remove(class_list[i]);
    }
  }
  if (class_list.length === 1 && class_list[0].value !== '') {
    return { list: class_list[0].split(',').map(parseFloat) };
  } else {
    if (class_list.length !== 0 && class_list[0].value !== '') {
      fromProj = epsg[`EPSG:${class_list[0]}`];
      return { x1: class_list[1], y1: class_list[2], x2: class_list[3], y2: class_list[4], format: class_list[5], toProj: toProj, fromProj: fromProj, name: class_list[6] };
    }
    else {
      return {};
    }
  }
};

root.render(
  <React.StrictMode>
    <App urlInfo={root._internalRoot.containerInfo.classList ? getCoordinatesFromUrl() : null} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
