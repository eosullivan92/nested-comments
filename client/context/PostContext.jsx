import React from 'react'
import { useParams } from 'react-router-dom'
import { useAsync } from '../hooks/useAsync'
import { getPost } from '../apis/posts'
import { useContext, useMemo } from 'react'
import { useEffect, useState } from 'react'

const Context = React.createContext()

export function usePost() {
	return useContext(Context)
}

export function PostProvider({ children }) {
	const { id } = useParams()
	const { loading, error, value: post } = useAsync(() => getPost(id), [id])
	const [comments, setComments] = useState([])

	//groups commments by parent id
	const commentsByParentId = useMemo(() => {
		if (comments == null) return []
		const group = {}
		comments.forEach((comment) => {
			group[comment.parentId] ||= []
			group[comment.parentId].push(comment)
		})
		console.log(group)
		return group
	}, [comments])

	function getReplies(parentId) {
		return commentsByParentId[parentId]
	}

	function createLocalComment(comment) {
		//creates local version of comment after comment is commited to db so comment is added without needing to refresh
		setComments((prevComments) => {
			return [comment, ...prevComments]
		})
	}

	function updateLocalComment(id, message) {
		setComments((prevComments) => {
			return prevComments.map((comment) => {
				if (comment.id == id) {
					return { ...comment, message }
				} else {
					return comment
				}
			})
		})
	}

	function deleteLocalComment(id) {
		setComments((prevComments) => {
			return prevComments.filter((comment) => comment.id !== id)
		})
	}

	useEffect(() => {
		if (post?.comments == null) return
		setComments(post.comments)
	}, [post?.comments])

	return (
		<Context.Provider
			value={{
				post: {
					id,
					...post,
				},
				rootComments: commentsByParentId[null],
				getReplies,
				createLocalComment,
				updateLocalComment,
				deleteLocalComment,
			}}
		>
			{loading ? <h1>loading</h1> : error ? <h1>{error}</h1> : children}
		</Context.Provider>
	)
}
