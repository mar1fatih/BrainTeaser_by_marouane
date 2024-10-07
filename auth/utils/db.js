import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || '127.0.0.1';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'players_manager';
    MongoClient.connect(`mongodb://${host}:${port}`, { useUnifiedTopology: true }, (err, client) => {
      this.db = client.db(database);
      this.users = this.db.collection('users');
      this.players = this.db.collection('players');
    });
  }

  isAlive() {
    return Boolean(this.db);
  }

  async nbUsers() {
    return this.users.countDocuments();
  }

  async nbplayers() {
    return this.players.countDocuments();
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
