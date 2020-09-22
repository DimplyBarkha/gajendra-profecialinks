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
      // if (row.lbb) {
      //   row.lbb.forEach(item => {
      //     if (item.text !== 'NO' && item.text.length > 0) {
      //       item.text = `${item.text.replace(/(.+)/, 'YES')}`;
      //     } else {
      //       item.text = 'NO';
      //     }
      //   });
      // }
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
      if (row.pricePerUnit2) {
        row.pricePerUnit2.forEach(item => {
          const val = item.text.split('/');
          let finalVal = '';
          if (val[1] && val[1].match(/([\d]+)/)) {
            finalVal = val[0].trim() + ' / ' + val[1].match(/([\d]+)/)[0].trim();
          }
          finalVal = finalVal ? finalVal.replace('(', '').trim() : val[0].replace('(', '').trim();
          item.text = finalVal; // `${item.text.replace(/\((.*)\s*\/\s*([\d+]*)/gm, '$1/$2').replace('(', '').replace(')', '').match(/(.*\/\s*[\d+]*)/)[0]}`;
        });
      }
      if (row.pricePerUnitUom) {
        row.pricePerUnitUom.forEach(item => {
          item.text = `${item.text.replace(/.*(?:[\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1').replace('/', '').replace(')', '').trim()}`;
        });
      }
      // if (row.description) {
      //   row.description.forEach(item => {
      //     item.text = `${item.text.replace(/(\s*[\r\n]\s*)+/g, ' ')}`;
      //   });
      // }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += ` || ${item.text}`;
        });
        let descriptionBottom = [];
        if (row.descriptionBottom) {
          descriptionBottom = row.descriptionBottom;
        }
        descriptionBottom = [text.trim(), ...descriptionBottom.map(({ text }) => text.replace(/(\s*[\r\n]\s*)+/g, ' '))];
        row.description = [
          {
            text: clean(descriptionBottom.join(' | ')),
          },
        ];
      }
      // if (row.otherSellersShipping2 && row.otherSellersName) {
      //   const text = [];
      //   row.otherSellersShipping2.forEach(item => {
      //     if (!item.text.toLowerCase().includes('free delivery') && item.text.match(/.([\d]+(?:.[\d]+)?)/)) {
      //       text.push({ text: `${item.text.match(/.([\d]+(?:.[\d]+)?)/)[1]}` });
      //     } else {
      //       text.push({ text: '0.00' });
      //     }
      //   });
      //   console.log('length of slleres', row.otherSellersName);
      //   while (row.otherSellersName.length !== text.length) {
      //     text.push({ text: '0.00' });
      //   }
      //   row.otherSellersShipping2 = text;
      // }
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
          if (item.text.replace(/.*:(.*)/, '$1').trim()) {
            text.push(`${item.text.replace(/.*:(.*)/, '$1').trim()}`);
          }
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
        let asinLength = 1;
        let asinValArr = [];
        row.variantAsins.forEach(item => {
          const asinArr = item.text.match(/"asin":"(.*?)"/gmi);
          if (asinArr) {
            const asins = asinArr.map(el => el.replace(/.*?:"?(.*)/, '$1').slice(0, -1));
            asinValArr = asinValArr.concat(asins);
          } else if (row.asin) {
            asinValArr.push(row.asin[0].text);
          }
        });
        const value = new Set(asinValArr);
        asinValArr = Array.from(value);
        if (asinValArr.length > 1) asinLength = asinValArr.length;
        row.variantAsins = [{ text: asinValArr.join(' | ') }];
        row.variantCount.forEach(variantCount => {
          variantCount.text = asinLength;
        });
        if (row.variants) {
          row.variants = row.variantAsins;
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
      if (row.brandText) {
        for (const item of row.brandText) {
          item.text = item.text.replace('Brand: ', '');
        }
      }
      if (row.weightGross) {
        for (const item of row.weightGross) {
          item.text = item.text.split(';') && item.text.split(';')[1] ? item.text.split(';')[1].trim() : item.text;
        }
      }
      if (row.shippingWeight) {
        for (const item of row.shippingWeight) {
          item.text = item.text.split(';') && item.text.split(';')[1] ? item.text.split(';')[1].trim() : item.text;
        }
      }
      if (row.videos && row.videos[0]) {
        // eslint-disable-next-line no-useless-escape
        const regex = /\"url\":\"([^"]+)/g;
        const rawArray = row.videos[0].text.toString().match(regex);
        const videos = [];
        if (rawArray) {
          rawArray.forEach(item => {
            const regex2 = /(https.+mp4)/s;
            videos.push(item.match(regex2)[0]);
          });
          row.videos = [{ text: videos.join(' | ').trim().replace(/\| \|/g, '|') }];
        } else {
          row.videos = [{ text: '' }];
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
      // if (row.lbbPrice && row.otherSellersPrice) {
      //   row.lbbPrice.forEach(item => {
      //     item.text = row.otherSellersPrice[0].text;
      //   });
      // }
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
