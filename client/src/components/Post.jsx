import React from 'react'
import CommentList from './CommentList'
import { CommentForm } from './CommentForm'
import { usePost } from '../../context/PostContext'
import { useAsyncFn } from '../../hooks/useAsync'
import { createComment } from '../../apis/comments'

export default function Post() {
	const { post, rootComments } = usePost()
	const {
		loading,
		error,
		execute: createCommentFn,
	} = useAsyncFn(createComment)

	function onCommentCreate(message) {
		return createCommentFn({ postId: post.id, message }).then((comment) => {
			console.log(comment)
		})
	}

	return (
		<>
			<h1>{post.title}</h1>
			<article>{post.body}</article>
			<h3>Comments:</h3>
			<section>
				<CommentForm
					loading={loading}
					error={error}
					onSubmit={onCommentCreate}
				/>
				{rootComments != null && rootComments.length > 0 && (
					<div>
						<CommentList comments={rootComments} />
					</div>
				)}
			</section>
		</>
	)
}
