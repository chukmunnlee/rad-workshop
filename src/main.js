import express from 'express'
import morgan from 'morgan'

import { findAllGames, findGamesByName, findGameById, countGames } from './database.js'
import { mkGameUrl, mkError } from './util.js'

const PORT = parseInt(process.env.PORT) || 3000

const app = express()

app.use(morgan("dev"))

app.get('/games', (req, resp) => {
	const offset = parseInt(req.query.offset) || 0
	const limit = parseInt(req.query.limit) || 10

	findAllGames(offset, limit)
		.then(result => {
			resp.status(200)
			resp.json(mkGameUrl(result))
		})
		.catch(err => {
			resp.status(500)
			resp.json(mkError(err))
		})
})

// Games
app.get('/games/search', (req, resp) => {
	const q = req.query.q
	if (!q) 
		return resp.status(400).json({ error: `Missing query parameter q` })
	
	findGamesByName(q)
		.then(result => {
			resp.status(200)
			resp.json(mkGameUrl(result))
		})
		.catch(err => {
			resp.status(500)
			resp.json(mkError(err))
		})
})

app.get('/games/count', (req, resp) => {
	countGames()
		.then(result => {
			resp.status(200)
			resp.json({ count: result })
		})
		.catch(err => {
			resp.status(500)
			resp.json(mkError(err))
		})
})

app.get('/game/:id', (req, resp) => {
	findGameById(parseInt(req.params.id))
		.then(result => {
			if (!result) {
				resp.status(404)
				resp.json(mkError(`Cannot find gameId ${req.params.id}`))
				return
			}
			resp.status(200)
			resp.json(result)
		})
		.catch(err => {
			resp.status(500)
			resp.json(mkError(err))
		})
})

// Comments

app.listen(PORT, () => {
	console.info(`Application started on port ${PORT} at ${new Date()}`)
})
