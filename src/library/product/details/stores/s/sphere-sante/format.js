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
      if (row.additionalDescBulletInfo) {
        const additionalDescBulletInfoArr = row.additionalDescBulletInfo.map((item) => {
          return item.text;
        });
        if (additionalDescBulletInfoArr.length > 1) additionalDescBulletInfoArr[0] = '|| ' + additionalDescBulletInfoArr[0];
        clean(row.additionalDescBulletInfo = [{ text: additionalDescBulletInfoArr.join(' | '), xpath: row.additionalDescBulletInfo[0].xpath }]);
      }
      if (row.description) {
        const descriptionArr = row.description.map((item) => {
          return item.text;
        });
        clean(row.description = [{ text: descriptionArr.join(' | '), xpath: row.description[0].xpath }]);
      }
      if (row.alternateImages) {
        const alternateImagesArr = row.alternateImages.map((item) => {
          return item.text;
        });
        clean(row.alternateImages = [{ text: alternateImagesArr.join(' | '), xpath: row.alternateImages[0].xpath }]);
      }
      if (row.manufacturerImages) {
        const manufacturerImagesArr = row.manufacturerImages.map((item) => {
          return item.text;
        });
        clean(row.manufacturerImages = [{ text: manufacturerImagesArr.join(' | '), xpath: row.manufacturerImages[0].xpath }]);
      }
      if (row.manufacturerDescription) {
        const manufacturerDescriptionArr = row.manufacturerDescription.map((item) => {
          return item.text;
        });
        clean(row.manufacturerDescription = [{ text: manufacturerDescriptionArr.join(''), xpath: row.manufacturerDescription[0].xpath }]);
      }
      if (row.videos) {
        const videosArr = row.videos.map((item) => {
          return item.text;
        });
        clean(row.videos = [{ text: videosArr.join(' | '), xpath: row.videos[0].xpath }]);
      }
      if (row.promotion) {
        const promotionArr = row.promotion.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/\n \n/gm, ' : ') : ' ';
        });
        clean(row.promotion = [{ text: promotionArr.join(' | '), xpath: row.promotion[0].xpath }]);
      }
    }
  }

  return data;
};

module.exports = { transform };
