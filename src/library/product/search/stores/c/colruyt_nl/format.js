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
      if (row.name && row.brandText) {
        row.nameExtended = [
          { text: row.brandText[0].text + ' ' + row.name[0].text },
        ];
        row.name = [
          { text: row.brandText[0].text + ' ' + row.name[0].text },
        ];
      }
      if (row.price) {
        row.price.forEach((priceItem) => {
          priceItem.text = priceItem.text.replace(',', '.');
        });
      }
      if (row.productUrl) {
        row.productUrl.forEach((productUrlItem) => {
          productUrlItem.text = productUrlItem.text.includes('https://colruyt.collectandgo.be') ? productUrlItem.text : 'https://colruyt.collectandgo.be' + productUrlItem.text;
        });
      }
      if (row.thumbnail) {
        row.thumbnail.forEach((thumbnailItem) => {
          thumbnailItem.text = thumbnailItem.text.includes('https:') ? thumbnailItem.text : 'https:' + thumbnailItem.text;
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
