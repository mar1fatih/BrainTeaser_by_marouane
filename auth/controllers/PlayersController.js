import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class PlayersController {
  static async saveScore(req, res) {
    const token = req.get('X-Token');//getting token from header
    const userId = await redisClient.get(`auth_${token}`);//looking for the token in redis database
    if (!token || !userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { score } = req.body;//getting the score from the body
    if (!score) {
      res.status(400).json({error: 'Missing score'});
    }
    const user = await dbClient.users.findOne({ _id: new ObjectId(userId) });
    const player = await dbClient.players.findOne({ userId });
    if (!player) {
      await dbClient.players.insertOne({
        userId,
        username: user.username,
        highScore: score,
      });
      return res.status(201).json({ highScore: score });
    }
    if (player.highScore >= score) {
      return res.status(200).json({ highScore: player.highScore });
    }
    const filter = { _id: player._id };
    const updateDoc = { $set: { highScore: score } };
    await dbClient.players.updateOne(filter, updateDoc);
    return res.status(201).json({ highScore: score });
  }

  static async getLeaders(req, res) {
    const leaders = await dbClient.players.find().sort({ highScore: -1 }).limit(10).toArray();
    if (!leaders) {
      res.status(400).json({ error: 'No Leaders' });
    }
    res.status(200).json({ leaders });
  }
}

module.exports = PlayersController;
