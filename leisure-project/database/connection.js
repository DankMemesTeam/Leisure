const { MongoClient } = require('mongodb');

module.exports = (connectionString) => {
    return MongoClient.connect(connectionString);
};
