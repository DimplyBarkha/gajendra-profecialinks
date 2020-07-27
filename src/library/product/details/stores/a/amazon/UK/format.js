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
      if (row.packSize) {
        row.packSize.forEach(item => {
          item.text = `${item.text.replace(/pack of (\d+)/i, '$1')}`;
        });
      }
      if (row.brandLink) {
        row.brandLink.forEach(item => {
          item.text = `${item.text.replace(/(.+)/, 'http://www.amazon.co.uk' + '$1')}`;
        });
      }
      if (row.lbb) {
        row.lbb.forEach(item => {
          if (item.text !== 'NO' && item.text.length > 0) {
            item.text = `${item.text.replace(/(.+)/, 'YES')}`;
          } else {
            item.text = 'NO';
          }
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
      if (row.salesRank) {
        row.salesRank.forEach(item => {
          if (item.text.match(/([\d]+(?:,[\d]+)?)/) && item.text.match(/([\d]+(?:,[\d]+)?)/).length > 0) {
            item.text = item.text.match(/([\d]+(?:,[\d]+)?)/)[0];
          }
        });
      }
      if (row.salesRankCategory) {
        row.salesRankCategory.forEach(item => {
          if (item.text.match(/[\d]+(?:,[\d]+)? in (.*) \(/) && item.text.match(/[\d]+(?:,[\d]+)? in (.*) \(/).length > 1) {
            item.text = item.text.match(/[\d]+(?:,[\d]+)? in (.*) \(/)[1];
          }
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
          item.text = `${item.text.replace(/(\s*[\r\n]\s*)+/g, ' ')}`;
        });
      }
      if (row.otherSellersShipping && row.otherSellersName) {
        const text = [];
        row.otherSellersShipping.forEach(item => {
          if (item.text.match(/.([\d]+(?:.[\d]+)?)/)) {
            text.push({ text: `${item.text.match(/.([\d]+(?:.[\d]+)?)/)[1]}` });
          } else {
            text.push({ text: '0.00' });
          }
        });
        console.log('length of slleres', row.otherSellersName);
        while (row.otherSellersName.length !== text.length) {
          text.push({ text: '0.00' });
        }
        row.otherSellersShipping = text;
      }
      if (row.manufacturerDescription) {
        row.manufacturerDescription.forEach(item => {
          item.text = `${item.text.replace(/<[^>]*>/gm, '').replace(/\s{2,}|\n|\t|\r/g, ' ').replace(/Read more/gm, '').trim()}`;
        });
      }
      if (row.manufacturerImages) {
        const text = [];
        row.manufacturerImages.forEach(item => {
          if (!item.text.includes('grey-pixel.gif')) {
            text.push({ text: `${item.text}` });
          }
        });
        row.manufacturerImages = text;
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
            text: clean(text.trim()),
          },
        ];
      }
      if (row.variantInformation) {
        let text = [];
        row.variantInformation.forEach(item => {
          text.push(`${item.text.replace(/.*:(.*)/, '$1').trim()}`);
        });
        const value = new Set(text);
        text = Array.from(value);
        row.variantInformation = [
          {
            text: clean(text.join(' || ')),
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
      if (row.variantAsins) {
        let text = [];
        row.variantAsins.forEach((item) => {
          text.push(item.text.replace(/.*,(.*)/, '$1'));
        });
        const value = new Set(text);
        text = Array.from(value);
        row.variantAsins = [
          {
            text: text.join(' | '),
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
          item.text = item.text.match(/SL1500_.jpg/gm) ? item.text.match(/SL1500_.jpg/gm).length : 0;
        }
      }
      if (row.warnings) {
        let val = '';
        for (const item of row.warnings) {
          val += item.text.replace(/\n/gm, '').replace(/\s{2,}/gm, ' ');
        }
        row.warnings = [{ text: val.trim() }];
      }
      if (row.variantCount) {
        for (const item of row.variantCount) {
          // eslint-disable-next-line eqeqeq
          if (item.text == 0) {
            item.text = 1;
          }
        }
      }
      if (row.brandText) {
        for (const item of row.brandText) {
          item.text = item.text.replace('Brand: ', '');
        }
      }
      if (row.alternateImages) {
        row.alternateImages.forEach((item) => {
          const val = [];
          if (item.text.replace(/\r\n|\n|\r/gm, '').match(/.*'colorImages': { 'initial':(.*)},'colorToAsin.*/)) {
            // eslint-disable-next-line no-useless-escape
            let data = item.text.replace(/\r\n|\n|\r/gm, '').match(/.*'colorImages': { 'initial':(.*)},'colorToAsin.*/) ? item.text.replace(/\r\n|\n|\r/gm, '').replace(/.*'colorImages': { 'initial':(.*)},'colorToAsin.*/, '$1').replace(/\"/gm, '"') : {};
            data = JSON.parse(data);
            data.forEach((ele, index) => {
              if (index !== 0 && ele.large) {
                // const arr = Object.keys(ele.large);
                val.push({ text: ele.large });
              }
            });
            row.alternateImages = val;
          } else {
            row.alternateImages = [{ text: '' }];
          }
        });
      }
      if (row.secondaryImageTotal && row.alternateImages) {
        row.secondaryImageTotal.forEach(item => {
          item.text = row.alternateImages.length;
        });
      }
      if (row.primeFlag) {
        let value = '';
        row.primeFlag.forEach(item => {
          if (!item.text.includes('NO')) {
            if (item.text.includes('sold by Amazon') && !value.includes('Yes - Shipped and Sold')) {
              value += 'Yes - Shipped and Sold | ';
            } else if (item.text.includes('Fulfilled by Amazon') && !value.includes('Yes - Fulfilled')) {
              value += 'Yes - Fulfilled | ';
            } else if (item.text.includes('Prime') && !value.includes('Prime')) {
              value += 'Prime Pantry | ';
            }
          }
        });
        if (value) {
          row.primeFlag = [{ text: value.slice(0, value.length - 3) }];
        } else {
          row.primeFlag = [{ text: 'NO' }];
        }
      }
    }
  }
  return data;
};
module.exports = { transform };
