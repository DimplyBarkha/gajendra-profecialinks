/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = text => text.toString()
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

  for (const { group }
    of data) {
    for (const row of group) {
      if (row.description) {
        console.log('#########Checking transform#########');
        row.description[0].text = cleanUp(row.description[0].text);
      }

      if (row.specifications) {
        row.specifications = row.specifications.map((specification) => {
          return { text: specification.text.replace(/(\n\s*){5,}/g, ' || ').replace(/(\n\s*){4,}/g, ' || ').replace(/(\n\s*){3,}/g, ' : ').replace(/(\n\s*){1,}/g, ' : ') };
        });
      }

      if (row.imageZoomFeaturePresent) {
        row.imageZoomFeaturePresent[0].text = 'Yes';
      } else {
        row.imageZoomFeaturePresent[0].text = 'No';
      }

      if (row.brandText && row.name) {
        if (row.name[0].text.split(' ')[0] !== row.brandText[0].text) {
          row.nameExtended[0].text = row.brandText[0].text + ' - ' + row.name[0].text;
        }
      }

      if (!row.brandText) {
        row.brandText = [{ text: row.name[0].text.split(' ')[0] }];
      }

      if (row.mpc) {
        row.mpc[0].text = row.mpc[0].text.trim();
      }
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = el.text ? cleanUp(el.text) : el.text;
      }));
      if (row.description) {
        row.productDescriptionLength = [{ text: row.description[0].text.length }];
        row.productDescriptionWordCount = [{ text: row.description[0].text.split(' ').length }];
      }
    }
  }
  return data;
};
module.exports = { transform };
