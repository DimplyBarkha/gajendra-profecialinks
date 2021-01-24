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
  let rank = state.rank || 1;
  for (const { group } of data) {
    for (const row of group) {
      if (row.id) {
        row.id.forEach(item => {
          var myRegexp = /addToWishList\(\'(.+?)\'\);/;
          var match = myRegexp.exec(item.text);
          if (match) {
            if (match.length) {
              item.text = match[1].trim();
            } else {
              delete row.id;
            }
          }
        });
      }
      if (row.id_1) {
        row.id = row.id_1;
        delete row.id_1;
      }
      if (!row.price) {
        if (row.price_1) {
          row.price = [{ text: row.price_1[0].text }];
        }
        delete row.price_1;
      }
      row.rank = row.rankOrganic = [{ text: rank }];
      rank++;
    }
  }
  context.setState({ rank });
  return cleanUp(data);
};

module.exports = { transform };
