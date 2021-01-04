
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
      if (row.shippingInfo) {
        row.shippingInfo.forEach(item => {
          item.text = item.text.replace(/\s\n/g, '').slice();
        });
      }
      if (row.inTheBoxText) {
        row.inTheBoxText.forEach(item => { 
          item.text = item.text.replace('אביזרים:', '').trim();
        });
      }
      if (row.inTheBoxText) {
        row.inTheBoxText.forEach(item => { 
          item.text = item.text.replace('אביזר החלקה STYLING להחלקה ועיצוב השיער.', '').trim();
        });
      }
      if ((!row.inTheBoxText || !row.inTheBoxText.length) && row.inTheBoxText1) {
        console.log('inTheBoxText1',row.inTheBoxText1);
        row.inTheBoxText = row.inTheBoxText1;
        console.log("inTheBoxText", row.inTheBoxText);
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };
