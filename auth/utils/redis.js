import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.client.on('error', (err) => console.log(err));
    this.AsyncGet = promisify(this.client.get).bind(this.client);
  }

  isAlive() {
    return this.client.connected && this.client.ready;
  }

  async get(key) {
    const res = await this.AsyncGet(key);
    return res;
  }

  async set(key, value, exp) {
    this.client.setex(key, exp, value);
  }

  async del(key) {
    this.client.del(key);
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
