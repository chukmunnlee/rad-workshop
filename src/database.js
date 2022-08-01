import { Database } from 'fakebase'

const db = new Database("./data/bgg")
const Games = db.table("game")
const Comments = db.table("comments")

export const findAllGames = (offset = 0, limit = 10) => {
	return Games.findAll()
		.then(result => result.slice(offset, offset + limit))
}

export const findGamesByName = (name) => {
	const n = name.toLowerCase()
	return Games.findAll(g => g.name.toLowerCase().indexOf(n) != -1)
}

export const findGameById = (id) => {
	return Games.findById(id)
}

export const countGames = () => {
	return Games.findAll()
		.then(result => result.length)
}
