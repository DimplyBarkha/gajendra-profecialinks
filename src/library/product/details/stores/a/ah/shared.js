/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.gtin) {
        let text = '';
        row.gtin.forEach(item => {
          text = row.gtin.map(elm => elm.text).join('').replace(new RegExp('(.+"gtin13":\\s")(\\d+)(.+)', 'g'), '$2');
        });
        row.gtin = [{ text }];
      }
      if (row.brandText) {
        let text = '';
        row.brandText.forEach(item => {
          text = row.brandText.map(elm => elm.text).join('').replace(new RegExp('(.+name":\\s")(.+)(",\\s"url":\\s"https:\\/\\/www.ah.nl\\/producten\\/merk.+)', 'g'), '$2');
        });
        row.brandText = [{ text }];
      }
      if (row.price && row.price[0]) {
        row.price[0].text = row.price[0].text.replace(/\./g, ',');
      }
      if (row.listPrice && row.listPrice[0]) {
        row.listPrice[0].text = row.listPrice[0].text.replace(/\./g, ',');
      }
      if (row.variants) {
        let text = '';
        row.variants.forEach(item => {
          text = row.variants.map(elm => elm.text).join(' | ');
        });
        row.variants = [{ text }];
      }
      if (row.allergyAdvice) {
        let text = '';
        row.allergyAdvice.forEach(item => {
          text = row.allergyAdvice.map(elm => elm.text).join(' ');
        });
        row.allergyAdvice = [{ text }];
      }
      if (row.productOtherInformation) {
        let text = '';
        row.productOtherInformation.forEach(item => {
          text = row.productOtherInformation.map(elm => elm.text).join(' ');
        });
        row.productOtherInformation = [{ text }];
      }
    }
  }

  // Clean up data
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

module.exports = { transform };
