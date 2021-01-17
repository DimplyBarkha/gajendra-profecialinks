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
      if (row.shippingInfo1) {
        row.shippingInfo = [{ text: row.shippingInfo1[0].text }];
        delete row.shippingInfo1;
      }
      if (row.shippingInfo2) {
        row.shippingInfo = [{ text: row.shippingInfo2[0].text }];
        delete row.shippingInfo2;
      }
      if (row.shippingInfo3) {
        row.shippingInfo = [{ text: row.shippingInfo3[0].text }];
        delete row.shippingInfo3;
      }
      // if (row.descriptionBullets) {
      //   var bulletArr = [];
      //   row.descriptionBullets.forEach(item => {
      //     bulletArr.push(item.text.replace(/^\s*-\s*/, ''));
      //   });
      //   row.descriptionBullets = [{ text: '|| ' + bulletArr.join(' || ') }];
      // }
      if (row.specifications) {
        var arrSpecs = [];
        row.specifications.forEach(item => {
          item.text = item.text.replace(/\n\s*\n/, ' : ');
          arrSpecs.push(item.text);
        });
        row.specifications = [{ text: arrSpecs.join(' || ') }];
      }
      if (row.image) {
        row.image.forEach(item => {
          item.text = 'https://www.sligro.nl' + item.text;
        });
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = 'https://www.sligro.nl' + item.text;
        });
      }
      if (row.gtin) {
        row.gtin.forEach(item => {
          item.text = item.text.replace('GTIN:', '');
          item.text = item.text.trim();
        });
      }
      if (row.brandLink) {
        row.brandLink.forEach(item => {
          item.text = 'https://www.sligro.nl' + item.text;
        });
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };