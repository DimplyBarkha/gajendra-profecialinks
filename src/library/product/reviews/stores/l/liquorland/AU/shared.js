/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
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
  function checkIfReviewIsFromLast30Days (reviewDate) {
    const timestamp = new Date().getTime() - (30 * 24 * 60 * 60 * 1000);
    if (new Date(reviewDate).getTime() >= timestamp) {
      return true;
    }
    return false;
  }
  data = data.filter(function (item) {
    console.log('group length before' + item.group.length);
    item.group = item.group.filter(function (row) {
      if (checkIfReviewIsFromLast30Days(row.reviewDate[0].text)) {
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

  data.forEach((dataObj) => {
    dataObj.group.forEach((fieldName, index) => {
      if(fieldName.reviewRating){
        const ratingValue = fieldName.reviewRating[0].value;
        if(ratingValue > 5) {
          fieldName.reviewRating[0].value = Number((ratingValue / 20).toFixed(1));
          fieldName.reviewRating[0].text = `${(ratingValue / 20).toFixed(1)}`
          fieldName.reviewRating[0].raw = `${(ratingValue / 20).toFixed(1)}`
        }
      }

      if(fieldName.reviewDate){
        fieldName.reviewDate[0].text = fieldName.reviewDate[0].text.replace(/T.*/, '');
      }
    });
  });
  return data;
};
module.exports = { transform };
