/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
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
      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text = text + (text ? ' | ' : '') + item.text;
        });
        row.manufacturerDescription = [{ text }];
      }
      if (row.description) {
        row.description.forEach(item => {
          const regex = /\n/g;
          item.text = item.text.replace(regex, ' ');
        });
        row.specifications && row.specifications.forEach(item => {
          const regexPi = /\n \n \n \n \n/g;
          item.text = item.text.replace(regexPi, '|');
          const regex = /\n \n \n/g;
          item.text = item.text.replace(regex, ' ');
        });
        row.shippingInfo && row.shippingInfo.forEach(item => {
          const regex = /\n+/g;
          item.text = item.text.replace(regex, ' ');
        });
        console.log('row.variantCount :', row.variantCount);
        // row.variantCount.forEach(item => {
        //   item.text = '0';
        // });
      }
      if (row.inTheBoxText) {
        let info = [];
        row.inTheBoxText.forEach(item => {
            info.push(item.text);
        });
        row.inTheBoxText = [{'text':info.join(' || '),'xpath':row.inTheBoxText[0].xpath}];
      }

      if (row.inTheBoxUrl) {
        row.inTheBoxUrl.forEach(item => {
          const textArr = item.text.split(" ");
          const url = textArr[0];
          item.text = `https:${url}`;
        });
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
