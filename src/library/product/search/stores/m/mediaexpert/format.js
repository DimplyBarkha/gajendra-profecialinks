
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
      if (row.productUrl) {
        row.productUrl.forEach(item => {
          item.text = 'https://www.mediaexpert.pl' + item.text;
        });
      }
      if (row.thumbnail) {
        row.thumbnail.forEach(item => {
          item.text = 'https:' + item.text;
        });
      }
      if (row.aggregateRating2) {
        var totRatting = 0;
        row.aggregateRating2.forEach(item => {
          if (item.text.indexOf('is-full') != -1) {
            totRatting = totRatting + 1;
          }
          if (item.text.indexOf('is-half') != -1) {
            totRatting = totRatting + 0.5;
          }
        });
        row.aggregateRating2 = [{ "text": totRatting.toString().replace('.', ','), "xpath": row.aggregateRating2[0]['xpath'] }];
      }
      if (row.brandText) {
        var bText;
        row.brandText.forEach(item => {
          bText = item.text.split(',');
          bText.forEach(item1 => {
            if (item1.indexOf('"brand":') > -1) {
              var bText1 = item1.split(':');
              item.text = bText1[1].substring(1, (bText1[1].length - 1));
            }
          });
        });
      }
      if (row.id) {
        var bText;
        row.id.forEach(item => {
          bText = item.text.split(',');
          bText.forEach(item1 => {
            if (item1.indexOf('"id":') > -1) {
              var bText1 = item1.split(':');
              item.text = bText1[1].substring(1, (bText1[1].length - 1));
            }
          });
        });
      }

      if (row.reviewCount) {
        row.reviewCount.forEach(item => {
          var tmp = item.text.replace('(', '');
          item.text = tmp.replace(')', '');
        });
      }
      if (row.ratingCount) {
        row.ratingCount.forEach(item => {
          var tmp = item.text.replace('(', '');
          item.text = tmp.replace(')', '');
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
