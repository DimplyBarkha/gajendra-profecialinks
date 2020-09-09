
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
        row.id[0].text = row.id[0].text.substring(1);
      }
      if (row.sku && row.sku.length > 0) {
        row.sku[0].text = row.sku[0].text.substring(1);
      }
      if (row.variantId && row.variantId.length > 0) {
        row.variantId[0].text = row.variantId[0].text.substring(1);
      }
    }
  }
  return data;
};

module.exports = { transform };
