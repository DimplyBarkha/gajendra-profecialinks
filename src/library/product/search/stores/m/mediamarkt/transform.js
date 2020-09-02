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
      rankCounter += 1;
      if (!row.sponsored) {
        orgRankCounter += 1;
        row.rankOrganic = [{ text: orgRankCounter }];
      }
      row.rank = [{ text: rankCounter }];
      if (row.aggregateRating2) {
        row.aggregateRating2 = [{ text: row.aggregateRating2[0].text.replace('-', '.') }];
      }
      if (row.aggregateRating) {
        row.aggregateRating = [{ text: row.aggregateRating[0].text.replace('-', '.') }];
      }
      console.log('dsdsdsdsds')
      console.log(row.price)
      if (row.price && row.price[0]) {
        console.log(row.price)
        let jsonData = row.price[0].text.split(' = ');
        jsonData = jsonData.length === 2 ? jsonData[1].replace(';', '') : '';
        jsonData = jsonData.length ? JSON.parse(jsonData) : {};
        const price = Object.keys(jsonData).length ? (jsonData.price ? jsonData.price : '') : '';
        row.price = [{ text: price }];
      }
      if (row.id && row.id[0]) {
        if (row.id[0].text.match('.html')) {
          const item = row.id[0];
          item.text = item.text.match(/(?<=-)(.*?)(?=\.)/gm) ? item.text.match(/(?<=-)(.*?)(?=\.)/gm)[0] : '';
          item.text = item.text.length ? (item.text.match(/[^-]+$/gm) ? item.text.match(/[^-]+$/gm)[0] : '') : '';
          row.id = [{ text: item.text }];
        }
      }

      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  context.setState({ rankCounter });
  context.setState({ orgRankCounter });
  context.setState({ productCodes });
  console.log(productCodes);
  return data;
};
module.exports = { transform };
