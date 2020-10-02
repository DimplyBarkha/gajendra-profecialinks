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
    let rank = 1;
    for (const row of group) {
      if (row.aggregateRating2) {
        row.aggregateRating2.forEach(item => {
          item.text = item.text.replace(/(.+?)\/.+/g, "$1");
          item.text = item.text.replace(".",",");
        });
      }
      if (row.reviewCount) {
        row.reviewCount.forEach(item => {
          item.text = item.text.replace(/.+?\|.+?(\d+).+/g, "$1");
        });
        row.ratingCount = [{'text':row.reviewCount[0].text}];
        if (row.reviewCount[0].text==0){
          row.aggregateRating2 = [{'text':''}];
        }
      }
      if (row.shippingInfo) {
        row.shippingInfo.forEach(item => {
          item.text = item.text.replace(/\s\n/g, '').trim();
        });
      }
      if (row.name) {
        row.name.forEach(item => {
          item.text = item.text.replace(/\s\n/g, '').trim();
        });
      }
      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace(/\s\n/g, '').trim();
          item.text = item.text.replace(/\s*/g, '').trim();
        });
      }
      if (row.id) {
        row.id.forEach(item => {
          item.text = item.text.replace(/.+systemowy\s*:\s*\[(.+?)\].*/g, "$1");
        });
        row.variantId = row.id;
      }
      if (row.gtin) {
        row.gtin.forEach(item => {
          item.text = item.text.replace(/.+producenta\s*:\s*\[(.+?)\].*/g, "$1");
        });
      }
      row.rank = row.rankOrganic = [{ "text": rank }];
      rank++;
    }
  }
  cleanUp(data);
  return data;
};
module.exports = { transform };