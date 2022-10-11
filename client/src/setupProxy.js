const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(
  '/api', 
  createProxyMiddleware({ 
    target: 'http://localhost:5100', 
    changeOrigin: true 
  })
);
app.listen(3000);