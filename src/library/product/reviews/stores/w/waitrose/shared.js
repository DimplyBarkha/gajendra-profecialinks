/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  function checkIfReviewIsFromLast30Days (currentDate, reviewDate) {
    const timestamp = new Date(currentDate).getTime() - (30 * 24 * 60 * 60 * 1000);
    return new Date(reviewDate).getTime() >= timestamp;
  }

  const todayDate = new Date().toDateString();

  data = data.filter(function (item) {
    console.log('group length before' + item.group.length);
    item.group = item.group.filter(function (row) {
      if (checkIfReviewIsFromLast30Days(todayDate, row.reviewDate[0].text)) {
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
  return data;
};
module.exports = { transform };
