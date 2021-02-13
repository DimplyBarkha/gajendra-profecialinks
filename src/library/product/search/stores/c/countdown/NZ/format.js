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
        Object.keys(row).forEach(header => row[header].forEach(el => {
          el.text = clean(el.text);
        }));
        if (row.name) {
            let info = [];
            row.name.forEach(item => {
              info.push(item.text);
            });
            row.name = [{ 'text': info.join(' ').replace('Volume size',''), 'xpath': row.name[0].xpath }];
          }
          if (row.productUrl) {
            row.productUrl.forEach(item => {
              item.text='https://shop.countdown.co.nz'+item.text;
            });
          }
          if (row.price) {
            row.price.forEach(item => {
                item.text = item.text.replace(/(\s*)+/g, '').trim();
                item.text = item.text.replace(/[a-z]/g, '').trim();
                item.text = item.text.replace('.', '.');
            });
          }
          if (row.id) {
            row.id.forEach(item => {
                item.text = item.text.replace(/(\s*)+/g, '').trim();
                item.text = item.text.split("?").pop();
                item.text = item.text.replace(/&.*/, '');
                item.text = item.text.replace('stockcode=', '').trim();
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