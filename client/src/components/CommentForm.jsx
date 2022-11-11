import { useState } from 'react'

export function CommentForm({
	initialValue = '',
	loading,
	error,
	onSubmit,
	autoFocus = false,
}) {
	const [message, setMessage] = useState('')

	const handleSubmit = (e) => {
		e.preventDefault()
		onSubmit(message).then(() => setMessage(initialValue))
	}
	return (
		<form onSubmit={handleSubmit}>
			<div className="comment-form-row">
				<textarea
					autoFocus={autoFocus}
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					className="message-input"
				></textarea>
				<button className="btn" disabled={loading} type="submit">
					{loading ? 'loading' : 'Post'}
				</button>
			</div>
			<div className="error-msg">{error}</div>
		</form>
	)
}
