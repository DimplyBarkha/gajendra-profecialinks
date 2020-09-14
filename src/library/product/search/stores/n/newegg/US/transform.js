
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
  for (const { group } of data) {
    for (const row of group) {
      rankCounter = rankCounter + 1;
      if (!row.sponsored) {
        orgRankCounter = orgRankCounter + 1;
        row.rankOrganic = [{ text: orgRankCounter }];
      }
      row.rank = [{ text: rankCounter }];
      context.setState({ rankCounter });
      context.setState({ orgRankCounter });
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));

      if (row.id && row.id.length > 0) {
        var url = ((row.id[0].text.split('?'))[0].split('/'));
        row.id[0].text = url[url.length - 1];
      }
      if (row.price && row.price.length > 0) {
        row.price[0].text = row.price[0].text.slice(0, -2);
      }
      if (row.reviewCount) {
        row.reviewCount[0].text = row.reviewCount[0].text.replace(/[^\w\s]/gi, '');
      }
      if (row.aggregateRating2) {
        row.aggregateRating2[0].text = (row.aggregateRating2[0].text.split('-'))[1];
      }
      if (row.manufacturer) {
        var str = (row.manufacturer[0].text.split(' ').slice(-1));
        if (str.length > 0 && str[0]) {
          row.manufacturer[0].text = str[0];
        }
      }
      if (row.soldBy) {
        var soldby = (row.soldBy[0].text.split(' ').slice(-1));
        if (soldby.length > 0 && soldby[0]) {
          row.soldBy[0].text = soldby[0];
        }
      }
    }
  }
  return data;
};

module.exports = { transform };
