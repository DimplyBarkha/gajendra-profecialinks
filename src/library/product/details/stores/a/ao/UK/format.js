/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const format = (data, context) => {
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

  for (const { group } of data) {
    for (let row of group) {
      try {
        if (row.manufacturerImages) {
          let text = '';
          row.manufacturerImages.forEach(item => {
            const val = item.text.match('http');
            if (!val) {
              text = item.text.replace(/(.+)/g, 'https:$1');
              item.text = text;
            }
          });
        }

        if (row.manufacturerDescription) {
          let text = '';
          row.manufacturerDescription.forEach(item => {
            text = text + (text ? ' ' : '') + item.text;
          });
          row.manufacturerDescription = [{ text }];
        }

        if (row.imageZoomFeaturePresent && row.imageZoomFeaturePresent[0]) {
          row.imageZoomFeaturePresent[0].text = row.imageZoomFeaturePresent[0].text === 'true' ? 'Yes' : 'No';
        }

        row = clean(row);
      } catch (exception) {
        console.log(exception);
      }
    }
  }
  return data;
};

module.exports = { format };
