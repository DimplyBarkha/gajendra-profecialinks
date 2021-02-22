/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.thumbnail) {
        row.thumbnail[0].text = 'http:' + row.thumbnail[0].text;
      }

      if (row.brandText) {
        var jsonData = JSON.parse(row.brandText[0].text.split('=')[1].slice(0, -1));
        row.name = [{ text: jsonData.name, xpath: row.brandText[0].xpath }];
        row.price = [{ text: jsonData.price, xpath: row.brandText[0].xpath }];
        row.id = [{ text: jsonData.id, xpath: row.brandText[0].xpath }];
        row.gtin = [{ text: jsonData.ean, xpath: row.brandText[0].xpath }];
      }

      if (row.aggregateRating2) {
        row.aggregateRating2[0].text = row.aggregateRating2[0].text.replace('value-', '').replace('-', '.');
      }

      if (row.reviewCount) {
        row.reviewCount[0].text = row.reviewCount[0].text.replace(' vélemény', '');
      }

      if (row.ratingCount) {
        row.ratingCount[0].text = row.ratingCount[0].text.replace(' vélemény', '');
      }

      if (row.productUrl) {
        row.productUrl[0].text = 'https://www.mediamarkt.hu' + row.productUrl[0].text;
      }

      if (row.price) {
        row.price[0].text = row.price[0].text + ' Ft';
      }
    }
  }

  const clean = text =>
    text.toString()
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

  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    if (typeof el.text !== 'undefined') {
      el.text = clean(el.text);
    }
  }))));
  return data;
};
module.exports = { transform };
