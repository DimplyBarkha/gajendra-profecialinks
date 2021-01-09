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
      if (row.variantSize) {
        const availBool = !row.variantSize[0].text.includes('Notify');
        row.availability = [{ text: availBool }];

        row.variantSize = [{ text: row.variantSize[0].text.replace('- Notify Me', '') }];
      }

      if (row.promoPrice) {
        row.price = [{ text: row.promoPrice[0].text }];
      } else if (row.listPrice && !row.price) {
        row.price = [{ text: row.listPrice[0].text }];
      }
    }
  }

  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = {
  cleanUp,
};
