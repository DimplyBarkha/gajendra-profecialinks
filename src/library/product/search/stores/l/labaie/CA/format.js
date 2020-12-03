module.exports.transform = (data, context) => {
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
  for (const { group } of data) {
    for (const row of group) {
      if (row.aggregateRating2) {
        row.aggregateRating2.forEach(item => {
          if (item.text.match(/([0-9]+[,]?[0-9]*) out (.*)/)) {
            item.text = item.text.replace(/([0-9]+[,]?[0-9]*) out (.*)/, '$1');
          }
          item.text = item.text.replace('.', ',');
        });
      }
      if (row.productUrl) {
        row.productUrl.forEach(item => {
          if (!item.text.startsWith('https://www.labaie.com/')) {
            item.text = `https://www.labaie.com${item.text}`;
          }
        });
      }
      if (row.ratingCount) {
        row.ratingCount.forEach(item => {
          item.text = item.text.replace(/(\d*) (\w*)/, '$1');
        });
      }
      if (row.reviewCount) {
        row.reviewCount.forEach(item => {
          item.text = item.text.replace(/(\d*) (\w*)/, '$1');
        });
      }
      if (row.id && row.id[0]) {
        rankCounter += 1;
        if (!row.sponsored) {
          orgRankCounter += 1;
          row.rankOrganic = [{ text: orgRankCounter }];
        }
        row.rank = [{ text: rankCounter }];
      } else {
        console.log(`${row.id[0].text} : ${row.name[0].text}`);
        row.id = [{ text: '' }];
      }
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  context.setState({ rankCounter });
  context.setState({ orgRankCounter });
  return data;
};
