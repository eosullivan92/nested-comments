import React from 'react'
import Comment from './Comment'

export default function CommentList({ comments }) {
	return comments.map((comment) => (
		<div key={comment.id}>
			<Comment {...comment} />
		</div>
	))
}
