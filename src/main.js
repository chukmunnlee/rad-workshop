import express from 'express'
import morgan from 'morgan'

import { 
	findAllGames, findGamesByName, findGameById, countGames, 
	findCommentsByGameId, findCommentsByUser, findCommentById,
	insertComment
} from './database.js'
import { mkGameUrl, mkCommentUrl, mkError } from './util.js'

const PORT = parseInt(process.env.PORT) || 3000

const app = express()

app.use(morgan("dev"))

// Games
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

app.get('/game/:gameId', async (req, resp) => {
	try {
		const result = await findGameById(req.params.gameId)
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


// Comments
app.post('/comment', express.json(), async (req, resp) => {
	const payload = req.body

	for (const field of [ 'user', 'rating', 'c_text', 'gid' ])
		if (!payload[field])
			return resp.status(400)
					.json(mkError(`Missing ${field} property` ))

	if ((payload.rating < 1) || (payload.rating > 10))
		return resp.status(400)
				.json(mkError(`Valid rating range is between 1 and 10 (inclusive)`))

	const game = await findGameById(payload.gid)
	if (!game) 
		return resp.status(400)
				.json(mkError(`Cannot find game id ${payload.gid}`))

	const id = await insertComment(payload)

	return resp.status(200).json({ id })
})

app.get('/game/:gameId/comments', async (req, resp) => {
	const gameId = parseInt(req.params.gameId)
	const offset = parseInt(req.query.offset) || 0
	const limit = parseInt(req.query.limit) || 10
	try {
		const result = await findCommentsByGameId(gameId, offset, limit)
		resp.status(200)
		resp.json(mkCommentUrl(result))
	} catch (err) {
		resp.status(500)
		resp.json(mkError(err))
	}
})

app.get('/comments/:user', async (req, resp) => {
	const user = req.params.user
	const offset = parseInt(req.query.offset) || 0
	const limit = parseInt(req.query.limit) || 10
	try {
		const result = await findCommentsByUser(user, offset, limit)
		resp.status(200)
		resp.json(mkCommentUrl(result))
	} catch (err) {
		resp.status(500)
		resp.json(mkError(err))
	}
})

app.get('/comment/:commentId', async (req, resp) => {
	const commentId = req.params.commentId
	try {
		const comment = await findCommentById(commentId)
		if (!comment) {
			resp.status(404)
			return resp.json(mkError({ error: `Comment ${commentId} not found`}))
		}
		resp.status(200)
		resp.json(comment)
	} catch (err) {
		resp.status(500)
		resp.json(mkError(err))
	}
})


app.listen(PORT, () => {
	console.info(`Application started on port ${PORT} at ${new Date()}`)
})
