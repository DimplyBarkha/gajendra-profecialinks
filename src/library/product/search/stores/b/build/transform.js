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
  const urlParams = new URLSearchParams(data[0].url);
  const page = parseInt(urlParams.get('p') || urlParams.get('page'));
  const lastPage = Math.ceil(150 / data[0].rows);
  const totalRecords = data[0].rows * lastPage;
  const diff = totalRecords - 150;
  const lastpageRecords = data[0].rows - diff;

  for (const { group } of data) {
    if (page == lastPage) {
      group.splice(-diff, diff);
      data[0].rows = lastpageRecords;
    }
    for (const row of group) {
      rankCounter += 1;
      if (!row.sponsored) {
        orgRankCounter += 1;
        row.rankOrganic = [{ text: orgRankCounter }];
      }
      if (row.productUrl) {
        row.productUrl.map(product => {
          product.text = 'https://build.com' + product.text;
        });
      }
      if (row.aggregateRating2) {
        row.aggregateRating2.forEach(product => {
          if (product.text.match(/.*rating-(\d{1})(\d{1}).*/)) {
            product.text = product.text.replace(/.*rating-(\d{1})(\d{1}).*/, '$1.$2');
          }
          if (product.text.match(/(.*) out of (.*)/)) {
            product.text = product.text.replace(/(.*) out of (.*)/, '$1');
          }
        });
      }
      row.rank = [{ text: rankCounter }];
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  context.setState({ rankCounter });
  context.setState({ orgRankCounter });
  return data;
};
module.exports = { transform };
