/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
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

  for (const { group } of data) {
    for (const row of group) {
      if (row.description) {
        const text = row.description.map(elm => elm.text.trim()).join(' ');
        row.description = [{ text }];
      }
      if (row.manufacturerDescription) {
        const text = row.manufacturerDescription.map(elm => elm.text.trim()).join(' ');
        row.manufacturerDescription = [{ text }];
      }
      if (row.specifications) {
        const text = row.specifications.map(elm => elm.text.trim()).join(' ');
        row.specifications = [{ text }];
      }
      if (row.aggregateRating) {
        const text = row.aggregateRating[0].text.replace(/(\d+)(.)(\d{0,1})(\d+)/g, '$1,$3');
        row.aggregateRating = [{ text }];
      }
      if (row.manufacturerImages) {
        row.manufacturerImages.forEach(image => {
          image.text = image.text.replace(/(.+)(200w, )(.+)(\s)(400w)(.+)/g, 'https:$3');
        })
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { cleanUp };
