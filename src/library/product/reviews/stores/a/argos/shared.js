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
      if (row.brand) {
        row.brand.forEach(item => {
          if (item.text.includes("My Blu")) {
            item.text = item.text.slice(0, 6);
          }
          else if (item.text.includes("BLU")) {
            item.text = item.text.slice(0, 3);
          }
          else if (item.text.includes("SMOK")) {
            item.text = item.text.slice(0, 4);
          }
          else if (item.text.includes("Vype")) {
            item.text = item.text.slice(0, 4);
          }
          else if (item.text.includes("JUUL")) {
            item.text = item.text.slice(0, 4);
          }
        });
      }

    }
  }
  return cleanUp(data);
};

module.exports = { transform };

