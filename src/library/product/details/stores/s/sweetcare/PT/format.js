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
  let index = state.index || 0;
  for (const { group } of data) {
    for (const row of group) {
      if (row.additionalDescBulletInfo) {
        var arrTemp = [];
        row.additionalDescBulletInfo.forEach(item => {
          if (item.text) {
            arrTemp.push(item.text);
          }
        });
        row.additionalDescBulletInfo = [{ text: '|| ' + arrTemp.join(' || ') }];
      }
      if (row.image) {
        row.image.forEach(item => {
          if (item.text) {
            item.text = item.text.replace('/160/', '/max/');
          }
        });
      }
      if (row.sku) {
        row.sku = [{ text: row.sku[index].text }];
      }
    }
    index = index + 1;
  }
  context.setState({ index });
  return cleanUp(data);
};

module.exports = { transform };