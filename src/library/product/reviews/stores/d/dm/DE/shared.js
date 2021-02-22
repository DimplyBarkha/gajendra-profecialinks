/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
    .trim();
  for (const { group } of data) {
    for (const row of group) {
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
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