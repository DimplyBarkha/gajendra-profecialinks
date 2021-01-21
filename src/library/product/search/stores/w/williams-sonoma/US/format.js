/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  const cleanUp = (data) => {
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
    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
      el.text = clean(el.text);
    }))));
    return data;
  };
  const state = context.getState();
  let rank = state.orgRankCounter || 1;
  for (const { group } of data) {
    for (const row of group) {
    //   if (row.thumbnail) {
    //     row.thumbnail.forEach(item => {
    //       item.text = item.text.replace(/t\.jpg$/, 'o.jpg');
    //       item.text = item.text.replace('/rk/', '/ab/');
    //     });
    //   }
      if (row.price) {
        if (row.price.length > 1) {
          row.price.splice(1);
        }
        row.price.forEach(item => {
          item.text = item.text.replace('Our Price', '').trim();
          item.text = item.text.replace('Sale', '').trim();
        });
      }
      row.rank = row.rankOrganic = [{ text: rank }];
      rank++;
    }
  }
  context.setState({ rank });
  return cleanUp(data);
};

module.exports = { transform };
