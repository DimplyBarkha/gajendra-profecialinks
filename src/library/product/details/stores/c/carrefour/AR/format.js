
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
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
  for (const { group } of data) {
    for (const row of group) {
      if (row.sku) {
        row.sku.forEach(item => {
          // "productId":"1555143"
          var myRegexp = /.+\/(.+?)\.htm/g;
          var match = myRegexp.exec(item.text);
          if (match.length) {
            item.text = match[1].trim();
          }
          row.variantId = [{ text: row.sku[0].text }];
        });
      }
      if (row.specifications) {
        var info = [];
        row.specifications.forEach(item => {
          info.push(item.text);
        });
        row.specifications = [{ text: info.join(' || ') }];
      }
      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace('.', '');
          item.text = item.text.replace(',', '.');
        });
      }
      if (row.descriptionBullets) {
        var tempInfo = [];
        row.descriptionBullets.forEach(item => {
          tempInfo.push(item.text);
        });
        row.descriptionBullets = [{ text: '|| ' + tempInfo.join(' || ') }];
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };
