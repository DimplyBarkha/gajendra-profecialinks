/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  function checkIfReviewIsFromLast30Days (lastDate, reviewDate) {
    console.log('lastDate' + lastDate);
    console.log('reviewDate' + reviewDate);
    const timestamp = new Date(lastDate).getTime() - (30 * 24 * 60 * 60 * 1000);
    console.log('timestamp' + timestamp);
    console.log(new Date(reviewDate).getTime());
    if (new Date(reviewDate).getTime() > timestamp) {
      console.log('True');
      return true;
    }
    console.log('false');
    return false;
  }

  const state = context.getState();
  let lastReviewDate = state.lastReviewDate || null;

  data = data.filter(function (item) {
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
