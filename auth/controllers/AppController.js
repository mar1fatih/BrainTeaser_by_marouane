import redisClient from '../utils/redis';
import dbClient from '../utils/db';

const getStatus = {
  redis: redisClient.isAlive(),
  db: dbClient.isAlive(),
};

const getStats = async () => {
  const _users = await dbClient.nbUsers();
  const _files = await dbClient.nbFiles();
  return {
    users: _users,
    files: _files,
  };
};

module.exports = { getStatus, getStats };
