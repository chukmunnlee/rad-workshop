import express from 'express'
import morgan from 'morgan'

import { findAllGames, findGamesByName, findGameById, countGames } from './database.js'
import { mkGameUrl, mkError } from './util.js'

const PORT = parseInt(process.env.PORT) || 3000

const app = express()

app.use(morgan("dev"))

app.get('/games', async (req, resp) => {
	const offset = parseInt(req.query.offset) || 0
	const limit = parseInt(req.query.limit) || 10

	try {
		const result = await findAllGames(offset, limit)
		resp.status(200)
		resp.json(mkGameUrl(result))
	} catch (err) {
		resp.status(500)
		resp.json(mkError(err))
	}
})

// Games
app.get('/games/search', async (req, resp) => {
	const q = req.query.q
	if (!q) 
		return resp.status(400).json({ error: `Missing query parameter q` })
	
	try {
		const result = await findGamesByName(q)
		resp.status(200)
		resp.json(mkGameUrl(result))
	} catch (err) {
		resp.status(500)
		resp.json(mkError(err))
	}
})

app.get('/games/count', async (req, resp) => {
	try {
		const result = await countGames()
		resp.status(200)
		resp.json({ count: result })
	} catch (err) {
		resp.status(500)
		resp.json(mkError(err))
	}
})

app.get('/game/:gameId', async (req, resp) => {
	try {
		const result = await findGameById(parseInt(req.params.gameId))
		if (!result) {
			resp.status(404)
			resp.json(mkError(`Cannot find gameId ${req.params.gameId}`))
			return
		}
		resp.status(200)
		resp.json(result)
	} catch(err) {
		resp.status(500)
		resp.json(mkError(err))
	}
})

app.get('/game/:gameId/comments', async (req, resp) => {
})

// Comments

app.listen(PORT, () => {
	console.info(`Application started on port ${PORT} at ${new Date()}`)
})
