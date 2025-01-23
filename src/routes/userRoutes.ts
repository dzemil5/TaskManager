import { Router } from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { errorMiddleware } from '../middlewares/errorMiddleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const router: Router = Router();

/**Registruj korisnika */
router.post('/register', registerUser);

/**Logovanje */
router.post('/login', loginUser);

/**Vrati profil korisnika (prima Bearer token) */
router.get('/profile', authMiddleware, getUserProfile);

/**Vrati sve korisnike */
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch users' });
  }
});

/**Vrati korisnika po ID */
router.get('/:id', async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch user' });
  }
});

//**Azuriraj korisnicki profil */ 
router.put('/profile', authMiddleware, async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const { name, email } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, email },
    });
    res.status(200).json({ message: 'Profile updated successfully', updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Unable to update user profile' });
  }
});

/**Izbrisi korisnika */
router.delete('/profile', authMiddleware, async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    await prisma.user.delete({
      where: { id: req.user.id },
    });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
});

router.use(errorMiddleware);

export default router;
