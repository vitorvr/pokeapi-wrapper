const express = require('express');
const axios = require('axios');
const mcache = require('memory-cache');

const baseUrl = 'http://pokeapi.co/api/v2';

const app = express();

const cache = (duration) => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url
    let cachedResponse = mcache.get(key)
   
    if (cachedResponse) {
      res.json(cachedResponse);
      return;
    } else {
      res.sendJson = res.json;
      res.json = (body) => {
        mcache.put(key, body, duration * 1000);
        res.sendJson(body);
      }
      next()
    }
  };
};

app.get('/pokedex/:subPath/:id', cache(10), (req, res) => {
  axios.get(`${baseUrl}/${req.params.subPath}/${req.params.id}`)
    .then(response => res.json(response.data))
    .catch(err => {
      console.log(err);
    })
});

app.get('/pokedex', cache(10), (req, res) => {
  axios.get('https://pokeapi.co/api/v2/pokemon/?limit=802&offset=0')
    .then(response => res.json(response.data))
    .catch(err => {
      console.log(err);
    })
});

app.listen(3000, () => console.log('Listening on port 3000'));