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
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
      .trim();
    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
      el.text = clean(el.text);
    }))));
    return data;
  };
  for (const { group } of data) {
    let tmpSku = '';
    for (const row of group) {
      const fstImg = ''; const fstImgAlt = ''; const restImg = []; const skuArr = []; const skuStr = ''; const baseUrl = 'https://www.sephora.ca/search?keyword=';
      if (row.variantId) {
        row.variantId.forEach(item => {
          const tmpArr = item.text.replace('/productimages/sku/s', '').split('+');
          tmpSku = tmpArr[0];
        });
        row.variantId = [{ text: tmpSku }];
        row.variantUrl = [{ text: baseUrl + tmpSku }];
      }
      if (row.variant) {
        row.variant.forEach(item => {
          item.text = item.text.replace('Urban Decay - Stay Naked Correcting Concealer', '');
        });
      }
    }
  }
  return cleanUp(data);
};
module.exports = { transform };
