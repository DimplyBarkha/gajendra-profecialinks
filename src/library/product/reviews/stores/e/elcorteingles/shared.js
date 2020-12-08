/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
	for (const { group } of data) {

		for (const row of group) {
			if (row.reviewDate && row.reviewDate.length) {
				let date = getDateFormat(row.reviewDate[0].text);
				console.log('@@@@@@@@@Formated date@@@@@@@@' + date);
				row.reviewDate[0].text = date;
			}
		}

		function getDateFormat(dateText) {
			console.log('date text' + dateText);
			if (dateText && dateText.search('año') !== -1) {
				let numberOfYears = dateText.match(/(\d+)/) ? dateText.match(/(\d+)/)[0] : 1;
				let reviewYear = new Date().getFullYear() - numberOfYears;
				return new Date(reviewYear, new Date().getMonth(), new Date().getDate(), new Date().getHours(), new Date().getMinutes()).toISOString();
			}

			if (dateText && dateText.search('mese') !== -1) {
				let numberOfMonths = dateText.match(/(\d+)/) ? dateText.match(/(\d+)/)[0] : 1;
				let reviewMonth = new Date().getMonth() - numberOfMonths;
				return new Date(new Date().getFullYear(), reviewMonth, new Date().getDate(), new Date().getHours(), new Date().getMinutes()).toISOString();
			}

			if (dateText && dateText.search('día') !== -1) {
				let numberOfDays = dateText.match(/(\d+)/) ? dateText.match(/(\d+)/)[0] : 1;
				let reviewDay = new Date().getDate() - numberOfDays;
				return new Date(new Date().getFullYear(), new Date().getMonth(), reviewDay, new Date().getHours(), new Date().getMinutes()).toISOString();
			}
		}
	}

	function checkIfReviewIsFromLast30Days(lastDate, reviewDate) {
		console.log('lastDate' + lastDate);
		console.log('reviewDate' + reviewDate);
		const timestamp = new Date(lastDate).getTime() - (30 * 24 * 60 * 60 * 1000);
		console.log('timestamp' + timestamp);
		console.log(new Date(reviewDate).getTime());
		if (new Date(reviewDate).getTime() >= timestamp) {
			console.log('True');
			return true;
		}
		console.log('false');
		return false;
	}

	const state = context.getState();
	let lastReviewDate = state.lastReviewDate || null;

	data = data.filter(function (item, index, data) {
		console.log('group length before' + item.group.length);
		item.group = item.group.filter(function (row) {
			if (!lastReviewDate) {
				lastReviewDate = row.reviewDate[0].text;
			}
			if (checkIfReviewIsFromLast30Days(lastReviewDate, row.reviewDate[0].text)) {
				return true;
			}
			return false;
		});

		console.log('group length after' + item.group.length);
		item.rows = item.group.length;
		if (item.group.length !== 0) {
			return true;
		}
		return false;
	});
	context.setState({ lastReviewDate });
	return data;
};

module.exports = { transform };