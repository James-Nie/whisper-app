
function messageDateFormat(date: string) {
	return new Date(date).getTime()
}

// 判断当前页面是否为
function judgeCurrentPage(currentPage: string, message: any) {
	if(currentPage.includes('/pages/message/message') &&
		currentPage.includes(message.from.userId)
	) {
		return true;
	}
	return false;
}

export {
	messageDateFormat,
	judgeCurrentPage
}