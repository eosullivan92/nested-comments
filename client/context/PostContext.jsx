import React from 'react'
import { useParams } from 'react-router-dom'
import { useAsync } from '../hooks/useAsync'
import { getPost } from '../apis/posts'
import { useContext, useMemo } from 'react'

const Context = React.createContext()

export function usePost() {
	return useContext(Context)
}

export function PostProvider({ children }) {
	const { id } = useParams()
	const { loading, error, value: post } = useAsync(() => getPost(id), [id])

	//groups commments by parent id
	const commentsByParentId = useMemo(() => {
		if (post?.comments == null) return []
		const group = {}
		post.comments.forEach((comment) => {
			group[comment.parentId] ||= []
			group[comment.parentId].push(comment)
		})
		console.log(group)
		return group
	}, [post?.comments])

	function getReplies(parentId) {
		return commentsByParentId[parentId]
	}

	return (
		<Context.Provider
			value={{
				post: {
					id,
					...post,
				},
				rootComments: commentsByParentId[null],
				getReplies,
			}}
		>
			{loading ? <h1>loading</h1> : error ? <h1>{error}</h1> : children}
		</Context.Provider>
	)
}