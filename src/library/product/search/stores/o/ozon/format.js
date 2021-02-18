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
  var pCount = 1;
  for (const { group } of data) {
    for (const row of group) {
      if (row.rankOrganic && row.rank) {
        row.rankOrganic = [{ text: pCount }];
        row.rank = [{ text: pCount }];
        pCount = pCount + 1;
      }

      if (row.productUrl) {
        row.productUrl.forEach(item => {
          item.text = 'https://www.ozon.ru' + item.text;
        });
      }
      if (row.aggregateRating2) {
        row.aggregateRating2.forEach(item => {
          item.text = parseFloat(item.text);
          item.text = item.text.toFixed(1);
          item.text = item.text.replace(/(\.)+/g, ',').trim();
        });
      }
      if (row.reviewCount) {
        row.reviewCount.forEach(item => {
          var matches = /(\d+)/isg.exec(item.text);
          if (matches) {
            item.text = matches[1];
          }
        });
      }
      if (row.ratingCount) {
        row.ratingCount.forEach(item => {
          var matches = /(\d+)/isg.exec(item.text);
          if (matches) {
            item.text = matches[1];
          }
        });
      }
      if (row.id) {
        row.id.forEach(item => {
          const matches = /.+\/(\d+)\//isg.exec(item.text);
          const matches1 = /.+-(\d+)\//isg.exec(item.text);
          if (matches) {
            item.text = matches[1];
          } else if (matches1) {
            item.text = matches1[1];
          } else {
            item.text = '';
          }
        });
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };
