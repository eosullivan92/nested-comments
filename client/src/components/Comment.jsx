import React, { useState } from 'react'
import CommentList from './CommentList'
import { IconButton } from './IconButton'
import { FaHeart, FaReply, FaEdit, FaTrash } from 'react-icons/fa'
import { usePost } from '../../context/PostContext'
import { CommentForm } from './CommentForm'
import { useAsyncFn } from '../../hooks/useAsync'
import {
	createComment,
	updateComment,
	deleteComment,
} from '../../apis/comments'
import { useUser } from '../../hooks/useUser'

const dateFormatter = new Intl.DateTimeFormat(undefined, {
	dateStyle: 'medium',
	timeStyle: 'short',
})

export default function Comment({ id, message, user, createdAt }) {
	const [areChildrenHidden, setAreChildrenHidden] = useState(false)
	const {
		post,
		getReplies,
		createLocalComment,
		updateLocalComment,
		deleteLocalComment,
	} = usePost()
	const [isReplying, setIsReplying] = useState(false)
	const [isEditing, setIsEditing] = useState(false)
	const createCommentFn = useAsyncFn(createComment)
	const updateCommentFn = useAsyncFn(updateComment)
	const deleteCommentFn = useAsyncFn(deleteComment)
	const childComments = getReplies(id)

	const currentUser = useUser()

	function onCommentReply(message) {
		return createCommentFn
			.execute({ postId: post.id, message, parentId: id })
			.then((comment) => {
				setIsReplying(false)
				createLocalComment(comment)
			})
	}

	function onCommentUpdate(message) {
		return updateCommentFn
			.execute({ postId: post.id, message, id })
			.then((comment) => {
				setIsEditing(false)
				updateLocalComment(id, comment.message)
			})
	}

	function onCommentDelete() {
		return deleteCommentFn
			.execute({ postId: post.id, id })
			.then(({ id }) => {
				deleteLocalComment(id)
			})
	}

	return (
		<>
			<div className="comment">
				<div className="header">
					<span className="name">{user.name}</span>
					<span className="date">
						{dateFormatter.format(Date.parse(createdAt))}
					</span>
				</div>
				{isEditing ? (
					<CommentForm
						autoFocus
						onSubmit={onCommentUpdate}
						loading={updateCommentFn.loading}
						error={updateCommentFn.error}
						initialValue={message}
					/>
				) : (
					<div className="message">{message}</div>
				)}

				<div className="footer">
					<IconButton Icon={FaHeart} aria-label="like">
						2
					</IconButton>
					<IconButton
						Icon={FaReply}
						aria-label={isReplying ? 'Cancel Reply' : 'Reply'}
						onClick={() => setIsReplying((prev) => !prev)}
						isActive={isReplying}
					/>
					{user.id === currentUser.id && (
						<>
							<IconButton
								Icon={FaEdit}
								aria-label={isEditing ? 'Cancel Edit' : 'Edit'}
								onClick={() => setIsEditing((prev) => !prev)}
								isActive={isEditing}
							/>
							<IconButton
								Icon={FaTrash}
								aria-label="delete"
								color="danger"
								disabled={deleteCommentFn.loading}
								onClick={onCommentDelete}
							/>
						</>
					)}
				</div>
				{deleteCommentFn.error && <div>{deleteCommentFn.error}</div>}
			</div>
			{isReplying && (
				<div>
					<CommentForm
						autoFocus
						onSubmit={onCommentReply}
						loading={createCommentFn.loading}
						error={createCommentFn.error}
					/>
				</div>
			)}
			{childComments?.length > 0 && (
				<>
					<div
						className={`nested-comment-stack ${
							areChildrenHidden ? 'hide' : ''
						}`}
					>
						<button
							area-label="Hide Replies"
							className="collapse-line"
						/>
						<div className="nested-comments">
							<CommentList comments={childComments} />
						</div>
					</div>
					<button
						className={`btn mt-1 ${
							!areChildrenHidden ? 'hide' : ''
						}`}
						onClick={() => setAreChildrenHidden(false)}
					>
						Show Replies
					</button>
				</>
			)}
		</>
	)
}
