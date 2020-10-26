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
    for (let row of group) {
      if (row.description) {
        var descriptionArr = [];
        row.description.forEach(item => {
          descriptionArr.push(item.text);
        });
        if (descriptionArr.length) {
          row.description = [{ "text": descriptionArr.join(" | ") }];
        }
      }
      if (row.specifications) {
        var specificationsArr = [];
        row.specifications.forEach(item => {
          specificationsArr.push(item.text.replace(/\n/, ' : '));
        });
        if (specificationsArr.length) {
          row.specifications = [{ "text": specificationsArr.join(" || ") }];
        }
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };