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
  // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
  for (const { group } of data) {
    for (const row of group) {
      if (row.alternateImages) {
        const alternateImagesArr = row.alternateImages.map((item) => {
          return item.text;
        });
        clean(row.alternateImages = [{ text: alternateImagesArr.join(' | '), xpath: row.alternateImages[0].xpath }]);
      }
      if (row.additionalDescBulletInfo) {
        const additionalDescBulletInfoArr = row.additionalDescBulletInfo.map((item) => {
          return item.text;
        });
        if (additionalDescBulletInfoArr.length > 1) {
          additionalDescBulletInfoArr[0] = '|| ' + additionalDescBulletInfoArr[0];
        }
        clean(row.additionalDescBulletInfo = [{ text: additionalDescBulletInfoArr.join(' | '), xpath: row.additionalDescBulletInfo[0].xpath }]);
      }
      if (row.description) {
        const descriptionArr = row.description.map((item) => {
          const firstIteration = typeof (item.text) === 'string' ? item.text.replace(/\n \n \n/gm, '') : '';
          const secondIteration = firstIteration.replace(/\n \n/gm, ' ');
          const thirdIteration = secondIteration.replace(/\n/gm, ' ');
          return thirdIteration;
        });
        clean(row.description = [{ text: descriptionArr.join(' | '), xpath: row.description[0].xpath }]);
      }
    }
  }

  return data;
};

module.exports = { transform };
