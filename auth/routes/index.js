import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import PlayersController from '../controllers/PlayersController';

const router = express.Router();

router.get('/status', (req, res) => {
  res.status(200).send(AppController.getStatus);
});

router.get('/stats', async (req, res) => {
  res.status(200).send(await AppController.getStats());
});

router.post('/users', UsersController.postNew);

router.get('/connect', AuthController.getConnect);

router.get('/disconnect', AuthController.getDisconnect);

router.get('/users/me', UsersController.getMe);

router.post('/players', PlayersController.saveScore);

router.get('/leaders', PlayersController.getLeaders);

module.exports = router;
