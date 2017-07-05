const { MongoClient } = require('mongodb');

const getConnection = (connectionString) => {
    return MongoClient.connect(connectionString);
};

module.exports = { getConnection };
