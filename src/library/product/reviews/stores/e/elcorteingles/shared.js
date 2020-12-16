/* eslint-disable no-inner-declarations */
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
/**
 * @param {{ getState: () => any; setState: (arg0: { lastReviewDate: any; }) => void; }} context
 */
const transform = (data, context) => {
  let numberOfYears, numberOfMonths, numberOfDays;
  let reviewYear, reviewMonth, reviewDay;
  for (const { group } of data) {
    for (const row of group) {
      if (row.reviewDate && row.reviewDate.length) {
        const date = row.reviewDate ? getDateFormat(row.reviewDate[0].text) : '';
        console.log('@@@@@@@@@Formated date@@@@@@@@' + date);
        if (date) {
          row.reviewDate[0].text = date;
        }
      }
    }

    function getDateFormat (dateText) {
      console.log('date text' + dateText);
      if (dateText && dateText.search('año') !== -1) {
        numberOfYears = dateText.match(/(\d+)/) ? dateText.match(/(\d+)/)[0] : 1;
        reviewYear = new Date().getFullYear() - numberOfYears;
        return new Date(reviewYear, new Date().getMonth(), new Date().getDate(), new Date().getHours(), new Date().getMinutes()).toISOString();
      }

      if (dateText && dateText.search('mese') !== -1) {
        numberOfMonths = dateText.match(/(\d+)/) ? dateText.match(/(\d+)/)[0] : 1;
        reviewMonth = new Date().getMonth() - numberOfMonths;
        return new Date(new Date().getFullYear(), reviewMonth, new Date().getDate(), new Date().getHours(), new Date().getMinutes()).toISOString();
      }

      if (dateText && dateText.search('día') !== -1) {
        numberOfDays = dateText.match(/(\d+)/) ? dateText.match(/(\d+)/)[0] : 1;
        reviewDay = new Date().getDate() - numberOfDays;
        return new Date(new Date().getFullYear(), new Date().getMonth(), reviewDay, new Date().getHours(), new Date().getMinutes()).toISOString();
      }
    }
  }

  function checkIfReviewIsFromLast30Days (lastDate, reviewDate) {
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
        lastReviewDate = row.reviewDate ? row.reviewDate[0].text : null;
      }
      if (checkIfReviewIsFromLast30Days(lastReviewDate, row.reviewDate ? row.reviewDate[0].text : null)) {
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
