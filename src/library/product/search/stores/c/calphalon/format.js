/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  var rank = 1
  for (const { group } of data) {
    for (const row of group) {
      row.rankOrganic = row.rank = [{ 'text': rank }];
      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          var myRegexp = /bv-width-from-rating-stats-(\d+)/g;
          var match = myRegexp.exec(item.text);
          if (match.length) {
            item.text = match[1];
            item.text = (item.text * 5) / 100;
          }
        });
      }
      if (row.thumbnail) {
        row.thumbnail.forEach(item => {
          if (item.text.indexOf('https') < 0) {
            item.text = "https:" + item.text;
          }
        });
      }
      rank = rank + 1;
    }
  }
  return data;
};

module.exports = { transform };