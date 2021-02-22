const { transform } = require('../../../../shared');

function checkIfReviewIsFromLast30Days (reviewDate, maxDays) {
  const timestamp = new Date().getTime() - (maxDays * 24 * 60 * 60 * 1000);
  if (new Date(reviewDate).getTime() >= timestamp) {
    return true;
  }
  return false;
}
data = data.filter(function (item) {
  console.log('group length before' + item.group.length);
  item.group = item.group.filter(function (row) {
    const maxDays = row.maxDays && row.maxDays[0] ? row.maxDays[0].text : 30;
    if (row.reviewDate.length && checkIfReviewIsFromLast30Days(row.reviewDate[0].text, maxDays)) {
      return true;
    }
    return false;
  });

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonPrimeNow',
    transform,
    filterReviews: true,
    mergeType: null,
    domain: 'primenow.amazon.com',
    zipcode: '',
  },
};


