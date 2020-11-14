
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
      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace(':', '.').trim();
        });
      }
      if (row.gtin) {
        var scriptJSON = JSON.parse(row.gtin[0].text);
        if (scriptJSON.id) {
          row.variantId = row.sku = [{ text: scriptJSON.id }];
        }
        if (scriptJSON.manufacturer) {
          row.manufacturer = row.sku = [{ text: scriptJSON.manufacturer }];
        }
        if (scriptJSON.ean) {
          row.gtin = [{ text: scriptJSON.ean }];
        }
        if (scriptJSON.manufacturer) {
          row.brandText = [{ text: scriptJSON.manufacturer }];
          if (row.nameExtended) {
            row.nameExtended = [{ text: scriptJSON.manufacturer + ' - ' + row.nameExtended[0].text }];
          }
        }
        if (scriptJSON.image) {
          if (scriptJSON.image.url) {
            var tempUrl = scriptJSON.image.url;
            if (tempUrl.indexOf('http:') < 0) {
              tempUrl = 'https:' + tempUrl;
            }
            row.image = [{ text: tempUrl }];
          }
        }
        // if (scriptJSON.price) {
        //   row.price = [{ text: scriptJSON.price }];
        // }
        if (scriptJSON.details) {
          if (scriptJSON.details.size.packageSizeInformation) {
            row.weightNet = [{ text: scriptJSON.details.size.packageSizeInformation }];
          }
        }
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };