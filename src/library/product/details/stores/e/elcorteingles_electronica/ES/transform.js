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
  for (const { group } of data) {
    for (const row of group) {
      if (row.nutritionInfo) {
        let text = '';
        text = row.nutritionInfo.map(element => element.text.trim()).join(' ');
        row.nutritionInfo = [{ text }];
      }
      if (row.mpc) {
        let text = '';
        text = row.mpc[0].text.trim();
        row.mpc = [{ text }];
      }
      if (row.nameExtended) {
        let text = '';
        text = row.nameExtended[0].text.trim();
        row.nameExtended = [{ text }];
      }
if (row.inTheBoxUrl) {
  row.inTheBoxUrl.forEach (item => {
    if (item.text.includes (' 200w')) {
      const imgUrl = item.text.split (' 200w, ')[0];
      if (!item.text.includes ('http')) {
        item.text = 'https:' + imgUrl;
      }
    }
  });
}

      if (row.manufacturerImages) {
        let text = '';
        row.manufacturerImages.forEach(item => {
          if (!item.text.match('http')) {
            const a = item.text.split('200w');
            item.text = 'https:' + a[0];
          }
          text = text + (text ? ' | ' : '') + item.text;
        });
        row.manufacturerImages = [{ text }];
      }

      // if we have as an array of manufacturerDescription, need to join them
      if (row.manufacturerDescription && row.manufacturerDescription.length > 1) {
        const text = row.manufacturerDescription.map(md => md.text).join(' ');
        row.manufacturerDescription = [{ text: text }] // join with spaces as pe Data Dictionary, and replace all of them with single json
      }
    }
  }
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
