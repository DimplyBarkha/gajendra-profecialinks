/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    .replace(/\\"/gm, '"')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));

  for (const { group } of data) {
    for (const row of group) {
      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text += `${item.text} `;
        });
        row.manufacturerDescription = [
          {
            text: text,
          },
        ];
      }
      if (row.description) {
        console.log('desc', row.description);
        row.description = [{ text: row.description[0].text.replace(/•/gm, '||') }];
      }
      if (row.variants1 && row.variants1.length > 1) {
        row.variants = row.variants1;
        row.variantCount = [{ text: row.variants1.length }];
        row.firstVariant = [{ text: row.variants1[0].text }];
      }
      if (row.additionalDescBulletInfo) {
        const additionalDescBulletInfo = [];
        row.additionalDescBulletInfo.forEach(item => {
          item.text.match(/•/gm) && additionalDescBulletInfo.push({ text: item.text });
        });
        row.additionalDescBulletInfo = additionalDescBulletInfo;
        row.descriptionBullets = [{ text: additionalDescBulletInfo.length }];
      }
    }
  }
  return data;
};

module.exports = { transform };
