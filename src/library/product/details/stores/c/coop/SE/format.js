
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
      if (row.name) {
        var scriptJSON = JSON.parse(row.name[0].text);
        if (scriptJSON.id) {
          row.name = [{ text: scriptJSON.id }];
        }
        if (scriptJSON.ean) {
          row.gtin = [{ text: scriptJSON.ean }];
        }
        if (scriptJSON.name) {
          row.name = [{ text: scriptJSON.name }];
        }
        if (scriptJSON.image) {
          // if (scriptJSON.image.indexOf('http') < 0) {
          //   scriptJSON.image = 'https:' + scriptJSON.image;
          // }
          row.name = [{ text: 'https:' + scriptJSON.image }];
        }
        if (scriptJSON.price) {
          row.price = [{ text: scriptJSON.price }];
        }
        if (scriptJSON.details) {
          if (scriptJSON.details.packageSizeInformation) {
            row.weightNet = [{ text: scriptJSON.details.packageSizeInformation }];
          }
        }
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };