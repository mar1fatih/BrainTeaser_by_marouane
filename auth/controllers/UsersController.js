import { ObjectId } from 'mongodb';
import sha1 from 'sha1';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class UsersController {
  static async postNew(req, res) {
    const { username, email, password } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Missing username'});
    }

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    const usrnm = await dbClient.db.collection('users').findOne({ username });

    if (usrnm) {
      return res.status(400).json({ error: 'Username already exist' });
    }

    const user = await dbClient.db.collection('users').findOne({ email });

    if (user) {
      return res.status(400).json({ error: 'Email already exist' });
    }

    const hached = sha1(password);
    const newUser = await dbClient.db.collection('users').insertOne({ username, email, password: hached });

    const nUserId = newUser.insertedId;

    return res.status(201).json({
      id: nUserId,
      username,
      email,
    });
  }

  static async getMe(req, res) {
    const token = req.get('X-Token');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const key = `auth_${token}`;
    const _id = await redisClient.get(key);
    const user = await dbClient.users.findOne({ _id: new ObjectId(_id) });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const player = await dbClient.players.findOne({ userId: _id });
    if (!player) {
      return res.status(401).json({ error: 'No player' });
    }
    return res.status(200).json({
      username: user.username,
      highScore: player.highScore,
    });
  }
}

module.exports = UsersController;
