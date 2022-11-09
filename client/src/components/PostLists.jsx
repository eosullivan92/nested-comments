import React from 'react'
import { useState, useEffect } from 'react'
import { getPosts } from '../../apis/posts'

export default function PostLists() {
	const [posts, setPosts] = useState([])

	useEffect(() => {
		getPosts().then(setPosts)
	}, [])

	return posts.map((post) => {
		return (
			<h1 key={post.id}>
				<a href={`/posts/${post.id}`}>{post.title}</a>
			</h1>
		)
	})
}
