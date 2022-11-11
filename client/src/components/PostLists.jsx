import React from 'react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getPosts } from '../../apis/posts'
import { useAsync } from '../../hooks/useAsync'

export default function PostLists() {
	const { loading, error, value: posts } = useAsync(getPosts)

	if (loading) return <h1>loading</h1>
	if (error) return <h1>{error}</h1>

	return posts.map((post) => {
		return (
			<h1 key={post.id}>
				<Link to={`/posts/${post.id}`}>{post.title}</Link>
			</h1>
		)
	})
}
