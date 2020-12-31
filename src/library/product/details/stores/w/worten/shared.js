
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.shippingDimensions) {
       let text= ''
        row.shippingDimensions.forEach(item => {
          text = row.shippingDimensions.map(elm => elm.text).join(' x ');
        });
        row.shippingDimensions = [
          {
            text: text,
          },
        ];
      }
      if (row.specifications) {
        const text = row.specifications[0].text.replace(/Ver Tudo/g, '').trim();
        row.specifications = [{ text }];
      }

      if (row.description) {
        const text = row.description[0].text.replace(/<br> -|;<br>-/g, ' || ').replace(/(<([^>]+)>)/ig, '').replace(/Ver Tudo/g, '').trim();
        row.description = [{ text }];
      }

  
    }
  }
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

module.exports = { transform };
