/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  const clean = text => text.toString().replace(/\r\n|\r|\n/gm, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[^\x00-\x7F]/g, '');

  for (const { group } of data) {
    for (const row of group) {
      if (row.description) {
        const descriptionArr = row.description.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/\n/gm, ' ').replace(/\//g, '') : '|';
        });
        row.description = [{ text: descriptionArr.join(' || '), xpath: row.description[0].xpath }];
      }
      if (row.additionalDescBulletInfo) {
        const additionalDescBulletInfoArr = row.additionalDescBulletInfo.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/\n/gm, ' ').replace(/\//g, '') : '|';
        });
        row.additionalDescBulletInfo = [{ text: additionalDescBulletInfoArr.join(' || '), xpath: row.additionalDescBulletInfo[0].xpath }];
      }
      if (row.manufacturer) {
        const manufacturerArr = row.manufacturer.map((item) => {
          return clean(typeof (item.text) === 'string' ? item.text.replace(/\n/g, ' ') : '|');
        });
        row.manufacturer = [{ text: manufacturerArr.join('|'), xpath: row.manufacturer[0].xpath }];
      }
      if (row.dietarySymbols) {
        const dietarySymbolsArr = row.dietarySymbols.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/\n/g, ' ') : '|';
        });
        row.dietarySymbols = [{ text: dietarySymbolsArr.join('|'), xpath: row.dietarySymbols[0].xpath }];
      }
      if (row.shippingInfo) {
        const shippingInfoArr = row.shippingInfo.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/\n/g, ' ') : '|';
        });
        row.shippingInfo = [{ text: shippingInfoArr.join('|'), xpath: row.shippingInfo[0].xpath }];
      }
      if (row.alternateImages) {
        const alternateImagesArr = row.alternateImages.map((item) => {
          return { text: `${item.text.match(/(.*)60x60(.*)/)[1]}280x430${item.text.match(/(.*)60x60(.*)/)[2]}` };
        });
        const result = alternateImagesArr.slice(1);
        row.alternateImages = result;
      }
    }
  }
  return data;
};

module.exports = { transform };
