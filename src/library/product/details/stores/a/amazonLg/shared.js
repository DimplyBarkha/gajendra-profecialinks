
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
    let dataStr = JSON.stringify(data);
    dataStr = dataStr.replace(/(?:\\r\\n|\\r|\\n)/g, ' ')
      .replace(/&amp;nbsp;/g, ' ')
      .replace(/&amp;#160/g, ' ')
      .replace(/\\u00A0/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/"\s{1,}/g, '"')
      .replace(/\s{1,}"/g, '"')
      .replace(/^ +| +$|( )+/g, ' ')
      // eslint-disable-next-line no-control-regex
      .replace(/[^\x00-\x7F]/g, '');

    return JSON.parse(dataStr);
  };
  for (const { group } of data) {
    for (const row of group) {
      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.specifications = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.specifications) {
        row.specifications.forEach(item => {
          item.text = item.text.replace(/\n/g, '');
          item.text = item.text.split('||');
          item.text = item.text.map(function (el) {
            return el.trim();
          });
          // @ts-ignore
          item.text = [...new Set(item.text)];
          item.text = item.text.join(' || ');
        });
      }
      if (row.alternateImages) {
        row.alternateImages.splice(0, 1);
        row.alternateImages.forEach(item => {
          item.text = `${item.text.replace('US40_', '')}`;
        });
      }
      if (row.secondaryImageTotal) {
        if (row.alternateImages.length > 1) {
          row.secondaryImageTotal.forEach(item => {
            item.text = row.alternateImages.length;
            // item.text = row.alternateImages.length - 1;
          });
        } else {
          row.secondaryImageTotal.forEach(item => {
            item.text = '';
          });
        }
      }
      if (row.imageAlt) {
        row.imageAlt.forEach(item => {
          item.text = cleanUp(item.text);
        });
      }
      if (row.featureBullets) {
        let text = '';
        row.featureBullets.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} | `;
        });
        row.featureBullets = [
          {
            text: cleanUp(text.slice(0, -3)),
          },
        ];
      }
      if (row.variantInformation) {
        let text = '';
        row.variantInformation.forEach(item => {
          text += `${item.text} || `;
        });
        row.variantInformation = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      // if (row.variantAsins) {
      //   row.variantAsins.forEach(item => {
      //     const asinArr = item.text.match(/"asin":"(.*?)"/g);
      //     if (asinArr) {
      //       const asins = asinArr.map(el => el.replace(/.*?:"?(.*)/, '$1').slice(0, -1)).join('|');
      //       item.text = asins;
      //     }
      //   });
      // }
      // if (row.variantCount) {
      //   let asinLength = 1;
      //   row.variantCount.forEach(item => {
      //     const asinArr = item.text.match(/"asin":"(.*?)"/g);
      //     if(asinArr){
      //       asinLength = asinArr.length;
      //     }else{
      //       item.text = asinLength;
      //     }
      //   });
      // }
      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach(item => {
          text += ` | ${item.text.replace(/\n \n/g, ':')}`;
        });
        row.additionalDescBulletInfo = [
          {
            text: text.trim(),
          },
        ];
      }
      if (row.manufacturerImages) {
        if (row.manufacturerImages) {
          const secondaryImages = [];
          row.manufacturerImages.forEach(alternateImage => {
            alternateImage.text = alternateImage.text.replace('._AC_US40_', '').trim();
            !secondaryImages.find(({ text }) => text === alternateImage.text) && secondaryImages.push(alternateImage);
          });
          row.manufacturerImages = secondaryImages;
        }
      }
      if (row.salesRank) {
        row.salesRank.forEach(item => {
          item.text = `${item.text.replace('#', '')}`;
        });
      }
      if (row.salesRankCategory) {
        row.salesRankCategory.forEach(item => {
          item.text = `${item.text.replace(/\(.*\)/gm, '').trim().split('in')[1].trim()}`;
        });
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += ` || ${item.text.replace(/\n \n/g, ':')}`;
        });
        text = text.trim();
        let descriptionBottom = [];
        if (row.descriptionBottom) {
          descriptionBottom = row.descriptionBottom;
        }
        descriptionBottom = [text, ...descriptionBottom.map(({ text }) => text)];
        row.description = [
          {
            text: descriptionBottom.join(' | '),
          },
        ];
      }
      if (row.warnings) {
        row.warnings.forEach(item => {
          item.text = cleanUp(item.text);
        });
      }
      if (row.promotion) {
        row.promotion.forEach(item => {
          item.text = cleanUp(item.text);
        });
      }
      if (row.shippingWeight) {
        row.shippingWeight.forEach(item => {
          item.text = cleanUp(item.text);
          item.text = `${item.text.replace('(', '')}`;
        });
      }
      if (row.productOtherInformation) {
        row.productOtherInformation.forEach(item => {
          item.text = cleanUp(item.text);
        });
      }
      if (row.lbb !== null) {
        if (row.lbbPrice) {
          row.lbbPrice.forEach(item => {
            item.text = `${item.text.replace('$', '')}`;
          });
        }
      } else {
        if (row.lbbPrice) {
          row.lbbPrice.forEach(item => {
            item.text = '';
          });
        }
      }
      if (row.primeFlag) {
        row.primeFlag.forEach(item => {
          if (item.text.includes('sold by Amazon')) {
            item.text = 'Yes - Shipped and Sold';
          } else if (item.text.includes('Fulfilled by Amazon')) {
            item.text = 'Yes - Fulfilled';
          } else {
            item.text = 'NO';
          }
        });
      }
      if (row.largeImageCount) {
        for (const item of row.largeImageCount) {
          item.text = item.text.trim().match(/hiRes":"\w+/g) ? item.text.trim().match(/hiRes":"\w+/g).length : 0;
        }
      }
      if (row.packSize) {
        for (const item of row.packSize) {
          if (item.text.includes('PIbundle-')) {
            item.text = `${item.text.split(',')[0].split('PIbundle-')[1]}`;
          } else {
            item.text = '';
          }
        }
      }
      if (row.brandText) {
        row.brandText.forEach(item => {
          item.text = cleanUp(item.text);
          item.text = `${item.text.replace('Brand:', '').trim()}`;
        });
      }
      if (row.ratingCount) {
        row.ratingCount.forEach(item => {
          item.text = cleanUp(item.text);
          item.text = `${item.text.replace('ratings', '').replace('rating', '').trim()}`;
        });
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
      }
    }
  }
  return data;
};

module.exports = { transform };
