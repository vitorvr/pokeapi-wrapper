const express = require('express');
const axios = require('axios');
const mcache = require('memory-cache');

const app = express();

const cache = (duration) => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url
    let cachedBody = mcache.get(key)
    if (cachedBody) {
      res.send(cachedBody)
      return
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body)
      }
      next()
    }
  };
};

app.get('/pokemon/:id', cache(10), (req, res) => {
  axios.get('http://pokeapi.co/api/v2/pokemon/'+req.params.id)
    .then(response => res.json(response.data))
    .catch(err => {
      console.log(err);
    })
});

app.listen(3000, () => console.log('Listening on port 3000'));