/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  const state = context.getState();
  let orgRankCounter = state.orgRankCounter || 0;
  let rankCounter = state.rankCounter || 0;
  const productCodes = state.productCodes || [];
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
  for (const { group } of data) {
    for (const row of group) {
      if (row.id && row.id[0] && productCodes.indexOf(row.id[0].text) === -1) {
        productCodes.push(row.id[0].text);
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
      if (row.id) {
        row.id.forEach(item => {
          item.text = item.text.replace(/.*\.product\.(.*)\.html/, '$1');
        });
      }
      if (row.thumbnail) {
        row.thumbnail.forEach((item) => {
          item.text = item.text.replace(/(.*)/, 'https:$1').replace('aemprodgallery', 'largeImage');
        });
      }
      if (row.reviewCount) {
        row.reviewCount.forEach((item) => {
          item.text = item.text.replace(/\(([\d]+).*/, '$1');
        });
        if (row.ratingCount) {
          row.ratingCount = row.reviewCount;
        }
      }
      if (row.aggregateRating2) {
        row.aggregateRating2.forEach((item) => {
          item.text = item.text.split(' ') ? item.text.split(' ')[0].replace('.', ',') : '';
        });
      }
      if (row.price) {
        row.price.forEach((item) => {
          item.text = item.text.replace('.', ',');
        });
      }
    }
  }
  context.setState({ rankCounter });
  context.setState({ orgRankCounter });
  context.setState({ productCodes });
  console.log(productCodes);
  return data;
};

module.exports = { transform };
