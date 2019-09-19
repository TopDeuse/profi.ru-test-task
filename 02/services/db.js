const mongodb = require('mongodb')
const { connectionString, dbName, collectionName } = require('../helpers/config');

async function loadData() {
    const client = await mongodb.MongoClient
    .connect(connectionString, { 
        useNewUrlParser: true,
        useUnifiedTopology: true
     });

     return client.db(dbName).collection(collectionName);
}

async function saveUrl(urls, url, shortUrl) {
    await urls.insertOne({
        url: url,
        url_short: shortUrl,
        followCount: 0,
        createdAt: new Date()
    });
}

async function findOneByLongUrl(urls, longUrl) {
    return await urls.findOne({ url: longUrl });
}

async function findOneByShortUrl(urls, shortUrl) {
    return await urls.findOne({ url_short: shortUrl });
}

module.exports = {
    loadData,
    saveUrl,
    findOneByLongUrl,
    findOneByShortUrl
  };