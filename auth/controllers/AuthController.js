import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import atob from 'atob';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController {
  static async getConnect(req, res) {
    const header = req.get('Authorization');
    if (!header) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const _header = header.split(' ');
    if (_header[0] === 'Basic') {
      const emailpass = atob(_header[1]);
      const usr = emailpass.split(':');
      const hached = sha1(usr[1]);
      const user = await dbClient.users.findOne({
        email: usr[0],
        password: hached,
      });
      if (user) {
        const token = uuidv4();
        const key = `auth_${String(token)}`;
        await redisClient.set(key, user._id.toString(), 86400);
        return res.status(200).json({ token });
      }
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return res.status(401).json({ error: 'Unauthorized' });
  }

  static async getDisconnect(req, res) {
    const header = req.get('X-token');
    const _id = await redisClient.get(`auth_${header}`);
    if (!header || !_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    await redisClient.del(`auth_${header}`);
    return res.status(204).json();
  }
}

module.exports = AuthController;
