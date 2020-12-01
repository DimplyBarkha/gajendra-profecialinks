
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
      if (row.brandText) {
        if (row.nameExtended) {
          row.nameExtended = [{ text: row.brandText[0].text + ' - ' + row.nameExtended[0].text }];
        }
      }
      if (row.description) {
        var tempDesc = [];
        row.description.forEach(item => {
          tempDesc.push(item.text);
        });
        row.description = [{ text: tempDesc.join(' ') }];
      }
      if (row.specifications) {
        var tempSpec = [];
        row.specifications.forEach(item => {
          item.text = item.text.replace(/\n\s*/g, ' : ');
          tempSpec.push(item.text);
        });
        row.specifications = [{ text: tempSpec.join(' || ') }];
      }
      if (row.pricePerUnit) {
        row.pricePerUnit.forEach(item => {
          item.text = item.text.replace(',', '.');
        });
      }
      if (row.weightNet) {
        row.weightNet.forEach(item => {
          item.text = item.text.replace(',', '.');
        });
      }
      if (row.weightGross) {
        row.weightGross.forEach(item => {
          item.text = item.text.replace(',', '.');
        });
      }
      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace(' ', '.');
        });
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };