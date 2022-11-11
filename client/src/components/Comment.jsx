import React, { useState } from 'react'
import CommentList from './CommentList'
import { IconButton } from './IconButton'
import { FaHeart, FaReply, FaEdit, FaTrash } from 'react-icons/fa'
import { usePost } from '../../context/PostContext'

const dateFormatter = new Intl.DateTimeFormat(undefined, {
	dateStyle: 'medium',
	timeStyle: 'short',
})

export default function Comment({ id, message, user, createdAt }) {
	const { getReplies } = usePost()

	const childComments = getReplies(id)
	const [areChildrenHidden, setAreChildrenHidden] = useState(false)

	return (
		<>
			<div className="comment">
				<div className="header">
					<span className="name">{user.name}</span>
					<span className="date">
						{dateFormatter.format(Date.parse(createdAt))}
					</span>
				</div>
				<div className="message">{message}</div>
				<div className="footer">
					<IconButton Icon={FaHeart} aria-label="like">
						2
					</IconButton>
					<IconButton Icon={FaReply} aria-label="reply" />
					<IconButton Icon={FaEdit} aria-label="edit" />
					<IconButton
						Icon={FaTrash}
						aria-label="delete"
						color="danger"
					/>
				</div>
			</div>
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
