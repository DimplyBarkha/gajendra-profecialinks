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
      if (row.image) {
        row.image = [{ text: 'https://www.mechta.kz' + row.image[0].text }];
      }
      if (row.imageAlt) {
        row.imageAlt = [{ text: row.imageAlt[0].text }];
      }
      if (row.alternateImages) {
        row.alternateImages.splice(0, 1);
        row.alternateImages.forEach(item => {
          item.text = 'https://www.mechta.kz' + item.text;
        });
      }
      if (row.manufacturerImages) {
        row.manufacturerImages.forEach(item => {
          item.text = 'https://www.mechta.kz' + item.text;
        });
      }
      if (row.sku) {
        row.sku.forEach(item => {
          item.text = item.text.replace('Код:', '');
          item.text = item.text.trim();
        });
        row.variantId = [{ text: row.sku[0].text }];
      }
      if (row.manufacturerDescription) {
        var descMfr = [];
        row.manufacturerDescription.forEach(item => {
          descMfr.push(item.text);
        });
        row.manufacturerDescription = [{ text: descMfr.join(' ') }];
      }
      if (row.weightNet) {
        row.weightNet.forEach(item => {
          item.text = item.text.replace(',', '.');
        });
      }
      if (row.specificationsKey && row.specificationsValue) {
        var arrSpecs = [];
        for (var i = 0; i < row.specificationsKey.length; i++) {
          arrSpecs.push(row.specificationsKey[i].text + row.specificationsValue[i].text);
        }
        delete row.specificationsKey;
        delete row.specificationsValue;
        if (arrSpecs.length) {
          row.specifications = [{ text: arrSpecs.join(' || ') }];
        }
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };
