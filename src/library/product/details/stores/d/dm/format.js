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
        row.additionalDescBulletInfo = [{ text: '|| ' + additionalDescBulletInfoArr.join(' || '), xpath: row.additionalDescBulletInfo[0].xpath }];
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
      if (row.alternateImages) {
        const alternateImagesArr = row.alternateImages.map((item) => {
          const regExV1 = /(.*)60x60(.*)/;
          const regExV2 = /(.*)w_60,h_60(.*)/;
          if (regExV1.test(item.text)) {
            console.log('Alternate Images 60x60 Console: ', regExV1.test(item.text));
            return { text: `${item.text.match(/(.*)60x60(.*)/)[1]}280x430${item.text.match(/(.*)60x60(.*)/)[2]}` };
          } else if (regExV2.test(item.text)) {
            console.log('Alternate Images w_60,h_60 Console: ', regExV2.test(item.text));
            return { text: `${item.text.match(/(.*)w_60,h_60(.*)/)[1]}w_280,h_430${item.text.match(/(.*)w_60,h_60(.*)/)[2]}` };
          } else {
            return '';
          }
        });
        const alternateImagesResult = alternateImagesArr && alternateImagesArr.slice(1);
        row.alternateImages = alternateImagesResult;
      }
      if (row.pricePerUnit) {
        const pricePerUnitArr = row.pricePerUnit.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/(.*)\((?:([\d.,]+)\s?)€(.*)/g, '$2') : '|';
        });
        row.pricePerUnit = [{ text: pricePerUnitArr.join('|'), xpath: row.pricePerUnit[0].xpath }];
      }
      if (row.pricePerUnitUom) {
        const pricePerUnitUomArr = row.pricePerUnitUom.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/.*\s(.*)\)/g, '$1') : '|';
        });
        row.pricePerUnitUom = [{ text: pricePerUnitUomArr.join('|'), xpath: row.pricePerUnitUom[0].xpath }];
      }
      if (row.brandLink) {
        const brandLinkArr = row.brandLink.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/(.+)/g, 'https://dm.de$1') : '|';
        });
        row.brandLink = [{ text: brandLinkArr.join('|'), xpath: row.brandLink[0].xpath }];
      }
      if (row.termsAndConditions) {
        const termsAndConditionsArr = row.termsAndConditions.map((item) => {
          return (typeof (item.text) === 'string') && (item.text.includes('agb')) ? 'Yes' : 'No';
        });
        row.termsAndConditions = [{ text: termsAndConditionsArr.join(), xpath: row.termsAndConditions[0].xpath }];
      }
      if (row.imageZoomFeaturePresent) {
        const imageZoomFeaturePresentArr = row.imageZoomFeaturePresent.map((item) => {
          return clean((typeof (item.text) === 'string') && (item.text.includes('image')) ? 'Yes' : 'No');
        });
        row.imageZoomFeaturePresent = [{ text: imageZoomFeaturePresentArr.join(), xpath: row.imageZoomFeaturePresent[0].xpath }];
      }
      if (row.servingSizeUom) {
        const servingSizeUomArr = row.servingSizeUom.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/(.*)(\d+\s)([a-z]+)(.*)/g, '$3') : '|';
        });
        row.servingSizeUom = [{ text: servingSizeUomArr.join('|'), xpath: row.servingSizeUom[0].xpath }];
      }
      if (row.sku) {
        row.sku[0].text = row.sku[0].text.match(/(.*)([a-z])(\d+)(.html)/)[3];
      }
      if (row.variantId) {
        row.variantId[0].text = row.variantId[0].text.match(/(.*)([a-z])(\d+)(.html)/)[3];
      }
      if (row.sodiumPerServingUom) {
        const sodiumPerServingUomArr = row.sodiumPerServingUom.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/(?:([\d.,]+)\s?)(.*)/g, '$2') : '|';
        });
        row.sodiumPerServingUom = [{ text: sodiumPerServingUomArr.join('|'), xpath: row.sodiumPerServingUom[0].xpath }];
      }
      if (row.vitaminAPerServingUom) {
        const vitaminAPerServingUomArr = row.vitaminAPerServingUom.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/(?:([\d.,]+)\s?)(.*)/g, '$2') : '|';
        });
        row.vitaminAPerServingUom = [{ text: vitaminAPerServingUomArr.join('|'), xpath: row.vitaminAPerServingUom[0].xpath }];
      }
      if (row.videos) {
        const videosArr = row.videos.map((item) => {
          return item.text;
        });
        row.videos = [{ text: videosArr.join('|'), xpath: row.videos[0].xpath }];
      }
      if (row.totalFatPerServing) {
        const totalFatPerServingArr = row.totalFatPerServing.map((item) => {
          const regExV1 = /(.+)(Fettgehalt:\s([\d]+[,.][\d]+))(.+)/;
          const regExV2 = /(.+)(Fettgehalt\s([\d]+[,.][\d]+))(.+)/;
          const regExV3 = /(?:([\d.,]+)\s?)(.+)/;
          if (regExV1.test(item.text)) {
            return typeof (item.text) === 'string' ? item.text.replace(/(.+)(Fettgehalt:\s([\d]+[,.][\d]+))(.+)/g, '$3') : '|';
          } else if (regExV2.test(item.text)) {
            return typeof (item.text) === 'string' ? item.text.replace(/(.+)(Fettgehalt\s([\d]+[,.][\d]+))(.+)/g, '$3') : '|';
          } else if (regExV3.test(item.text)) {
            return typeof (item.text) === 'string' ? item.text.replace(/(?:([\d.,]+)\s?)(.+)/g, '$1') : '|';
          } else {
            return '';
          }
        });
        row.totalFatPerServing = [{ text: totalFatPerServingArr.join('|'), xpath: row.totalFatPerServing[0].xpath }];
      }
    }
  }
  return data;
};

module.exports = { transform };
