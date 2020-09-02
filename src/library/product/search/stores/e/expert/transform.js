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
  let counter = 0;
  for (const { group } of data) {
    for (const row of group) {
      rankCounter += 1;
      if (!row.sponsored) {
        orgRankCounter += 1;
        row.rankOrganic = [{ text: orgRankCounter }];
      }
      row.rank = [{ text: rankCounter }];
      if (row.gtin) {
        const rank = parseInt(row.rankOrganic[0].text) - 1;
        if (row.gtin[rank] && row.gtin[rank].text) {
          let jsText = row.gtin[rank].text;
          if (jsText.includes('window.emos3.send({\'ec_Event\':')) {
            jsText = jsText.split('window.emos3.send({\'ec_Event\':');
            //   console.log(jsText);
            jsText = jsText.length === 2 ? jsText[1] : [];
            //   console.log(jsText);
            jsText = jsText.length ? jsText.split(',\'siteid\':') : [];
            //   console.log(jsText);
            jsText = jsText.length ? jsText[0].replace(/\'/gm, '"') : '';

            const jsonProduct = jsText.length ? JSON.parse(jsText)[0] : {};
            row.gtin = [{ text: (Object.keys(jsonProduct).length ? ((jsonProduct.pid !== null) ? jsonProduct.pid : '') : '') }];
          }
        }
      }
      if (row.sku) {
        row.sku = [{ text: row.sku[0].text.replace('| ', '') }];
      }
      counter += 1;
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  context.setState({ rankCounter });
  context.setState({ orgRankCounter });
  context.setState({ productCodes });
  console.log('productCodes');
  console.log(productCodes);
  return data;
};
module.exports = { transform };
