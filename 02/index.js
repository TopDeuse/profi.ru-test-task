const express = require('express');
const bodyParser = require('body-parser');
const validUrl = require('valid-url');
const { loadData, saveUrl, findOneByLongUrl, findOneByShortUrl } = require('./services/db');
const generator = require('./helpers/generator');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/getAll', async (req, res) => {
  const data = await loadData();
  res.send(await data.find().sort({ createdAt: -1 }).toArray());
})

app.post('/api/saveUrl', async (req, res) => {
  const longUrl = req.body.long_url;
  if(!longUrl || !validUrl.isUri(longUrl)) {
    return res.send({
      success: false,
      error: "Please, provide a valid url"
    });
  }
  try {
    const data = await loadData();
    if(!await findOneByLongUrl(data, longUrl)) {
      const shortUrl = generator();
      await saveUrl(data, longUrl, shortUrl);
      res.send({
        success: true,
        result: shortUrl});
    }
    else {
      res.send({
        success: false,
        error: "This url has already contracted"
      });
    }
  
  }
  catch(error) {
    res.send(error);
  }
});

app.get('/api/:id', async (req, res) => {
  const data = await loadData();
  const id = req.params.id;
  const shortUrl = `https://⭐️⭐️.ws/${id}`;
  const item = await findOneByShortUrl(data, shortUrl);
  if(item) {
    data.update({ _id: item._id }, { $inc : { followCount: 1 } });
    res.writeHead(301, { Location: item.url });
    res.end();
  }
  else {
    res.send({
      success: false,
      error: "This url doesn't exist"
    });
  }
});

app.get('/api/statistics/:id', async (req, res) => {
  const data = await loadData();
  try{
    const id = new ObjectId(req.params.id);
    const item = await data.findOne({ _id: id });
    if(item) {
      res.send({ item });
    }
    else {
      res.send({
        success: false,
        error: "This url doesn't exist"
      });
    }
  }
  catch(error) {
    res.send(error);
  }
  
});

app.listen(port, () => console.log(`Server is up on port ${port}`));