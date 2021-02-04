/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.specificationsTitle) {
        const specTitles = row.specificationsTitle;
        const specValues = row.specificationsValue;
        let specString = '';
        for (let i = 0; i < specTitles.length; i++) {
          specString += `${specTitles[i].text} : ${specValues[i].text} | `;
        }
        specString = specString.substring(0, specString.lastIndexOf('|'));
        row.specifications = [{ text: specString }];
      }

      if (row.aggregateRating) {
        row.aggregateRating[0].text = row.aggregateRating[0].text.replace('.', ',');
      }

      if (row.description && row.additionalDescBulletInfo) {
        const bulletsArray = row.additionalDescBulletInfo;
        let bulletsStr = '';
        bulletsArray.map(function (bullet) {
          bulletsStr += `||${bullet.text} `;
        });
        row.description = [{ text: `${row.description[0].text} ${bulletsStr}` }];
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
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
    .trim();
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
