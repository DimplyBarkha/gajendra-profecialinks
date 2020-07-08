/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  // const cleanUp = (data, context) => {
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
    .replace(/&nbsp;/g, ' ');
  //   data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
  //     el.text = clean(el.text);
  //   }))));
  //   return data;
  // };
  for (const { group } of data) {
    for (const row of group) {
      if (row.servingSizeUom) {
        row.servingSizeUom.forEach(item => {
          item.text = `${item.text.replace(/(?:[\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
        });
      }
      if (row.servingSize) {
        row.servingSize.forEach(item => {
          item.text = `${item.text.replace(/([\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
        });
      }
      if (row.totalFatPerServingUom) {
        row.totalFatPerServingUom.forEach(item => {
          item.text = `${item.text.replace(/(?:[\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
        });
      }
      if (row.totalFatPerServing) {
        row.totalFatPerServing.forEach(item => {
          item.text = `${item.text.replace(/([\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
        });
      }
      if (row.saltPerServingUom) {
        row.saltPerServingUom.forEach(item => {
          item.text = `${item.text.replace(/(?:[\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
        });
      }
      if (row.proteinPerServing) {
        row.proteinPerServing.forEach(item => {
          item.text = `${item.text.replace(/([\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
        });
      }
      if (row.saturatedFatPerServing) {
        row.saturatedFatPerServing.forEach(item => {
          item.text = `${item.text.replace(/([\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
        });
      }
      if (row.proteinPerServingUom) {
        row.proteinPerServingUom.forEach(item => {
          item.text = `${item.text.replace(/(?:[\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
        });
      }
      if (row.sodiumPerServingUom) {
        row.sodiumPerServingUom.forEach(item => {
          item.text = `${item.text.replace(/(?:[\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
        });
      }
      if (row.saturatedFatPerServingUom) {
        row.saturatedFatPerServingUom.forEach(item => {
          item.text = `${item.text.replace(/(?:[\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
        });
      }
      if (row.totalCarbPerServing) {
        row.totalCarbPerServing.forEach(item => {
          item.text = `${item.text.replace(/([\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
        });
      }
      if (row.totalCarbPerServingUom) {
        row.totalCarbPerServingUom.forEach(item => {
          item.text = `${item.text.replace(/(?:[\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
        });
      }
      if (row.totalSugarsPerServing) {
        row.totalSugarsPerServing.forEach(item => {
          item.text = `${item.text.replace(/([\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
        });
      }
      if (row.totalSugarsPerServingUom) {
        row.totalSugarsPerServingUom.forEach(item => {
          item.text = `${item.text.replace(/(?:[\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
        });
      }
      if (row.ironPerServingUom) {
        row.ironPerServingUom.forEach(item => {
          item.text = `${item.text.replace(/(?:[\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
        });
      }
      if (row.pricePerUnit) {
        row.pricePerUnit.forEach(item => {
          item.text = `${item.text.replace('(', '').replace(')', '')}`;
        });
      }
      if (row.pricePerUnitUom) {
        row.pricePerUnitUom.forEach(item => {
          item.text = `${item.text.replace(/.*(?:[\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1').replace('/', '').replace(')', '').trim()}`;
        });
      }
      if (row.description) {
        row.description.forEach(item => {
          item.text = `${item.text.replace(/\n/g, '')}`;
        });
      }
      if (row.otherSellersShipping) {
        const text = [];
        row.otherSellersShipping.forEach(item => {
          if (item.text.match(/.(?:[\d]+(?:.[\d]+)?)/)) {
            text.push({ text: `${item.text.match(/.(?:[\d]+(?:.[\d]+)?)/)[0]}` });
          }
        });
        row.otherSellersShipping = text;
      }
      if (row.manufacturerDescription) {
        row.manufacturerDescription.forEach(item => {
          item.text = `${item.text.replace(/\n/g, '')}`;
        });
      }
      if (row.allergyAdvice) {
        row.allergyAdvice.forEach(item => {
          item.text = `${item.text.replace(/Contains: /g, '')}`;
        });
      }
      if (row.imageAlt) {
        row.imageAlt.forEach(item => {
          item.text = clean(`${item.text}`);
        });
      }
      if (row.news) {
        row.news.forEach((item, index) => {
          item.text = item.text.replace(/(#\d+)(.*)/, '$1 Best Seller$2');
        });
      }
      if (row.fastTrack) {
        let text = '';
        row.fastTrack.forEach(item => {
          text += ` ${item.text}`;
        });
        row.fastTrack = [
          {
            text: clean(text.slice(0, -4)),
          },
        ];
      }
      if (row.specifications) {
        const text = [];
        row.specifications.forEach((item) => {
          text.push(item.text.replace('\n', ' : ').replace(/\n/g, ''));
        });
        row.specifications = [
          {
            text: clean(text.join(' || ')),
          },
        ];
      }
      if (row.otherSellersPrime) {
        for (const item of row.otherSellersPrime) {
          if (item.text.includes('Details')) {
            item.text = 'YES';
          } else {
            item.text = 'NO';
          }
        }
      }
      if (row.largeImageCount) {
        for (const item of row.largeImageCount) {
          item.text = item.text.trim().match(/hiRes/g) ? item.text.trim().match(/hiRes/g).length : 0;
        }
      }
      if (row.alternateImages) {
        row.alternateImages.forEach((item) => {
          const val = [];
          // eslint-disable-next-line no-useless-escape
          let data = item.text.replace(/\r\n|\n|\r/gm, '').match(/.*'colorImages': { 'initial':(.*)},'colorToAsin.*/) ? item.text.replace(/\r\n|\n|\r/gm, '').replace(/.*'colorImages': { 'initial':(.*)},'colorToAsin.*/, '$1').replace(/\"/gm, '"') : {};
          data = JSON.parse(data);
          data.forEach((ele, index) => {
            if (index !== 0 && ele.main && ele.main) {
              const arr = Object.keys(ele.main);
              val.push({ text: arr[0] });
            }
          });
          row.alternateImages = val;
        });
      }
    }
  }
  return data;
};
module.exports = { transform };
