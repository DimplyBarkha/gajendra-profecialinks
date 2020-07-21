
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
      // if (row.largeImageCount) {
      //   for (const item of row.largeImageCount) {
      //     item.text = item.text.trim().match(/hiRes/g) ? item.text.trim().match(/hiRes/g).length : 0;
      //   }
      // }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = `${item.text.replace('US40_', '')}`;
        });
      }
      if (row.secondaryImageTotal) {
        row.secondaryImageTotal.forEach(item => {
          item.text = row.alternateImages.length;
        });
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
      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          item.text = item.text.replace(/[\r\n]+/gm, '').replace(/ +(?= )/g, ''); ;
          item.text = `${item.text.replace(/([\<img].*[\"\>])/g, ' ').trim().replace('\n', '')}  `;
          text += `${item.text.replace(/\n \n/g, '')}  `;
        });
        row.manufacturerDescription = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.salesRank) {
        row.salesRank.forEach(item => {
          item.text = `${item.text.replace('#', '')}`;
        });
      }
      if (row.salesRankCategory) {
        row.salesRankCategory.forEach(item => {
          item.text = `${item.text.replace(/\(.*\)/gm, '').split('in')[1]}`;
        });
      }
      if (row.description) {
        row.description.forEach(item => {
          item.text = cleanUp(item.text);
        });
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
          item.text = item.text.trim().match(/hiRes/g) ? item.text.trim().match(/hiRes/g).length : 0;
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
      if (row.otherSellersPrime) {
        for (const item of row.otherSellersPrime) {
          if (item.text.includes('Details')) {
            item.text = 'YES';
          } else {
            item.text = 'NO';
          }
        }
      }
      if (row.otherSellersShipping2) {
        for (const item of row.otherSellersShipping2) {
          if (item.text.toLowerCase().includes('free')) {
            item.text = '0.00';
          } else if (item.text.match(/\$([^\s]+)/)) {
            item.text = item.text.match(/\$([^\s]+)/)[1];
          }
        }
      }
      if (row.brandText) {
        row.brandText.forEach(item => {
          item.text = cleanUp(item.text);
          item.text = `${item.text.replace('Brand:', '')}`;
        });
      }
      if (row.ratingCount) {
        row.ratingCount.forEach(item => {
          item.text = cleanUp(item.text);
          item.text = `${item.text.replace('ratings', '').replace('rating', '').replace(',', '').trim()}`;
        });
      }
    }
  }
  return data;
};

module.exports = { transform };
