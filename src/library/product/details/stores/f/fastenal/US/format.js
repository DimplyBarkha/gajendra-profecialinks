/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  // Default transform function
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

  for (const { group }
    of data) {

    for (const row of group) {
      if (row.shownImages) {
        row.shownImages.forEach(item => {
          item.text = "https:" + item.text;
        });
      }

      if (row.highQualityImages) {
        row.highQualityImages.forEach(item => {
          item.text = "https:" + item.text;
        });
      }

      if (row.sku) {
        row.sku.forEach(item => {
          item.text = "fastenal_" + item.text;
        });
      }

      if (row.description) {
        let desc = '';
        row.description.forEach(item => {
          desc += `${item.text}`;
        });
        row.description = [
          {
            text: desc
          },
        ];
      }

      if (row.shortDescription) {
        let desc = '';
        row.shortDescription.forEach(item => {
          desc += `${item.text}`;
        });
        row.shortDescription = [
          {
            text: desc
          },
        ];
      }



    }
  }
  return data;
};

module.exports = { transform };