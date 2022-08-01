export const mkGameUrl = (result) => {
	return result.map(r => ({
		name: r.name,
		url: `/game/${r.id}`
	}))
}

export const mkError = (error) => {
	return { error }
}
