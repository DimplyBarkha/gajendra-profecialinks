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
  for (const { group } of data) {
    for (const row of group) {
      if (row.alternateImages) {
        row.alternateImages = row.alternateImages.map((ele) => {
          ele.text = ele.text.replace('72by72', '641by641');
          return ele;
        });
        if (row.alternateImages[0].text === row.image[0].text) {
          row.alternateImages.shift();
        }
      }
      if (row.color) {
        var colorText = row.color[0].text.split(',');
        row.color[0].text = colorText[0];
      }
      if (row.largeImageCount) {
        row.largeImageCount = [
          {
            text: row.alternateImages.length,
          },
        ];
      }
      if (row.additionalDescBulletInfo) {
        let rawText = row.additionalDescBulletInfo[0].text;
        if (row.additionalDescBulletInfo.length > 1) {
          rawText = '';
          row.additionalDescBulletInfo.forEach(element => {
            rawText += '\n' + element.text;
          });
        }
        let desc = (rawText.split('\n')).filter(ele => ele !== ' ');
        desc = (desc.filter(s => /^[^a-z]/i.test(s))).map((ele) => ele.substring(3));
        var bullets = [];
        desc.forEach(element => {
          var obj = {};
          obj.text = element;
          bullets.push(obj);
        });
        row.description[0].text = row.description[0].text.replace(/•/g, '||');
        row.additionalDescBulletInfo = bullets;
      }
      if (row.listPrice) {
        if (row.listPrice[0].text === row.price[0].text) {
          delete row.listPrice;
        }
      }
      if (row.nameExtended) {
        row.nameExtended[0].text = row.brandText[0].text + ' - ' + row.nameExtended[0].text;
      }
      if (row.descriptionBullets) {
        row.descriptionBullets[0].text = row.additionalDescBulletInfo.length;
      }
      if (row.description) {
        row.description[0].text = cleanUp(row.description[0].text.replace(/\n/g, ''));
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(aggregateRating => {
          aggregateRating.text = aggregateRating.text.replace('_', ',').trim();
          if (aggregateRating.text === '0') {
            aggregateRating.text = aggregateRating.text.replace('0', '');
          }
        });
      }
      if (row.variantCount) {
        row.variantCount.forEach(variantCount => {
          if (variantCount.text == '0') {
            variantCount.text = '1';
          }
        });
      }
      if (row.variants) {
        let text = '';
        row.variants.forEach(item => {
          text += `${item.text} | `;
        });
        row.variants = [
          {
            text: cleanUp(text.slice(0, -3)),
          },
        ];
      }
      if (row.variantAsins) {
        let text = '';
        row.variantAsins.forEach(item => {
          text += `${item.text} | `;
        });
        row.variantAsins = [
          {
            text: cleanUp(text.slice(0, -3)),
          },
        ];
      }
      if (row.shippingInfo) {
        let text = '';
        row.shippingInfo.forEach(item => {
          text += `${item.text}`;
        });
        row.shippingInfo = [
          {
            text: cleanUp(text),
          },
        ];
      }
      if (row.unInterruptedPDP) {
        row.unInterruptedPDP.forEach(item => {
          item.text = item.text.replace(/\n/gm, ' ').replace(/(?<=€)(.*)/gm, '').trim();
        });
      }
    }
  }
  return data;
};

module.exports = { transform };
