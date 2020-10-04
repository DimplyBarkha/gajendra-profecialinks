/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
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
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
      el.text = clean(el.text);
    }))));
    return data;
  };
  for (const { group } of data) {
    var rank = 1;
    for (const row of group) {
      if (row.id) {
        row.id.forEach(item => {
          var splitData = item.text.split('-');
          item.text = splitData[splitData.length - 1];
        });
      }
      if (row.thumbnail) {
        row.thumbnail.forEach(item => {
          item.text = 'https:' + item.text;
        });
      }
      if (row.productUrl) {
        row.productUrl.forEach(item => {
          item.text = 'https://www.mvideo.ru' + item.text;
        });
      }
      if (row.aggregateRating2) {
        row.aggregateRating2.forEach(item => {
          item.text = item.text.replace('width: ', '').trim();
          item.text = item.text.replace('%', '').trim();
          if (item.text == 1) {
            item.text = 0;
          } else {
            var aggregateRating2Number = (item.text * 5) / 100;
            item.text = aggregateRating2Number.toFixed(1).replace('.', ',');
          }
        });
      }
      row.rank = [{ "text": rank }];
      row.rankOrganic = [{ "text": rank }];
      rank++;
    }
  }
  cleanUp(data);
  return data;
};
module.exports = { transform };
