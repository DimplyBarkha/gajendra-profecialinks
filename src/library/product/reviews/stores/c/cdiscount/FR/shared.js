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
    //console.log('group length before' + item.group.length);
    item.group = item.group.filter(function (row) {
      if (!lastReviewDate) {
        lastReviewDate = row.reviewDate[0].text;
      }
    let dt = lastReviewDate;
    let newLastDate = dt.split("/")[1]+'/'+dt.split("/")[0]+'/'+dt.split("/")[2];
    let rDate = row.reviewDate[0].text
    let newReviewDate = rDate.split("/")[1]+'/'+rDate.split("/")[0]+'/'+rDate.split("/")[2];
    
      if (checkIfReviewIsFromLast30Days(newLastDate, newReviewDate)) {
        return true;
      }
      return false;
    });
    context.setState({ lastReviewDate });
    //console.log('group length after' + item.group.length);
    item.rows = item.group.length;
    if (item.group.length !== 0) {
      return true;
    }
    return false;
  });
  
  //return data;
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
  return data;
};
module.exports = { transform };