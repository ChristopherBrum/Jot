const Notification = ({ message, requestSuccess }) => {
	if (message === null) {
		return null;
	}

	if (requestSuccess) {
		return (
			<div className="success">
				{message}
			</div>
		)
	}
	return (
		<div className="error">
			{message}
		</div>
	)
}

export default Notification;