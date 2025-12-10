import { Router } from 'express'
import { getAllSongs } from '../controllers/song.controller.js'

const router = Router()

// GET /api/songs
router.get('/', getAllSongs)

export default router
