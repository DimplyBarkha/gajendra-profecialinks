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
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
  const state = context.getState();
  let orgRankCounter = state.orgRankCounter || 0;
  let rankCounter = state.rankCounter || 0;
  const productCodes = state.productCodes || [];
  for (const { group } of data) {
    for (const row of group) {
      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          const val = item.value;
          let newval = 0;
          if (val === 0) {
            newval = 0;
          } else if (val > 0 && val <= 20) {
            newval = 1;
          } else if (val > 20 && val <= 40) {
            newval = 2;
          } else if (val > 40 && val <= 60) {
            newval = 3;
          } else if (val > 60 && val <= 80) {
            newval = 4;
          } else if (val > 80 && val <= 100) {
            newval = 5;
          }
          item.value = newval;
          item.text = newval.toString();
        });
      }

      if (row.id) {
        row.id.forEach(item => {
          let nTxt = item.text.replace('.jpg', '');
          if (nTxt.lastIndexOf('-') > -1) {
	          nTxt = nTxt.substring(nTxt.lastIndexOf('-'));
          }
          if (nTxt.lastIndexOf('-') > -1) {
          	nTxt = nTxt.substring(nTxt.lastIndexOf('-'));
          }
          if (nTxt.lastIndexOf('=/') > -1) {
          	nTxt = nTxt.substring(nTxt.lastIndexOf('=/') + 2);
          }
          var idx = nTxt.indexOf('f1');
          if (idx === -1) idx = nTxt.indexOf('F1');
          if (idx === -1) idx = nTxt.length;
          nTxt = nTxt.substring(0, idx);
          item.text = nTxt;
        });
      }

      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace('\nzł', 'zł').replace('\n', ',');
        });
      }
      rankCounter += 1;
      if (!row.sponsored) {
        orgRankCounter += 1;
        row.rankOrganic = [{ text: orgRankCounter }];
      }
      row.rank = [{ text: rankCounter }];
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  context.setState({ rankCounter });
  context.setState({ orgRankCounter });
  context.setState({ productCodes });
  return data;
};

module.exports = { transform };
