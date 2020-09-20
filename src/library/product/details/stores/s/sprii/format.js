/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.color) {
        const product = JSON.parse(row.color[0].text);
        row.color[0].text = product.color;
      }
      if (row.description) {
        if (row.description.length) {
          row.description = [{ text: row.description[0].text, xpath: row.description[0].xpath }];
        }
      }
      if (row.additionalDescBulletInfo) {
        if (row.additionalDescBulletInfo.length > 2) {
          if (row.additionalDescBulletInfo[1].text.indexOf('الميزات') !== -1 || row.additionalDescBulletInfo[1].text.toUpperCase().indexOf('FEATURES') !== -1 || row.additionalDescBulletInfo[1].text.indexOf('المميزات') !== -1) {
            var features = row.additionalDescBulletInfo[2].text.split('\n')
            row.additionalDescBulletInfo = [];
            var featureFlag = true;
            var counter = 0;
            features.forEach(element => {
              if (element.indexOf(':') === -1 && featureFlag) {
                counter++;
                row.additionalDescBulletInfo.push({
                  text: element,
                  xpath: ''
                });
              } else {
                featureFlag = false;
              }
            });
            row.descriptionBullets = [{ text: counter.toString(), xpath: '' }]
          } else {
            row.additionalDescBulletInfo = [];
            row.descriptionBullets = [];
          }
        }
        else {
          row.additionalDescBulletInfo = [];
        }
      }
      if (row.shippingWeight) {
        var weight = {};
        try {
          row.shippingWeight.forEach((element, index) => {
            if (element.text.toUpperCase().indexOf('SHIPPING WEIGHT') !== -1) {
              weight = { text: row.shippingWeight[++index].text, xpath: '' };
            }
          });
        } catch (e) {
          row.shippingWeight.forEach((element, index) => {
            if (element.text.indexOf('\n') !== -1) {
              var subEl = element.text.split('\n');
              subEl.forEach((item, i) => {
                if (item.toUpperCase().indexOf('SHIPPING WEIGHT') !== -1) {
                  weight = { text: subEl[++i], xpath: '' };
                }
              });
            }
          });
        }
        row.shippingWeight = weight.text ? [weight] : [];
      }
      if (row.shippingDimensions) {
        var sd = {};
        try {
          row.shippingDimensions.forEach((element, index) => {
            if (element.text.toUpperCase().indexOf('SHIPPING DIMENSION') !== -1) {
              sd = { text: row.shippingDimensions[++index].text, xpath: '' };
            }
          });
        } catch (e) {
          row.shippingDimensions.forEach((element, index) => {
            if (element.text.indexOf('\n') !== -1) {
              var subEl = element.text.split('\n');
              subEl.forEach((item, i) => {
                if (item.toUpperCase().indexOf('SHIPPING DIMENSION') !== -1) {
                  sd = { text: subEl[++i], xpath: '' };
                }
              });
            }
          });
        }
        row.shippingDimensions = sd.text ? [sd] : [];
      }
      if (row.specifications) {
        var sd = {};
        try {
          row.specifications.forEach((element, index) => {
            if (element.text.indexOf('أبعاد المنتج') !== -1 || element.text.toUpperCase().indexOf('PRODUCT DIMENSION') !== -1) {
              sd = { text: row.specifications[++index].text, xpath: '' };
            }
          });
        } catch (e) {
          row.specifications.forEach((element, index) => {
            if (element.text.indexOf('\n') !== -1) {
              var subEl = element.text.split('\n');
              subEl.forEach((item, i) => {
                if (item.toUpperCase().indexOf('PRODUCT DIMENSION') !== -1 || item.indexOf('أبعاد المنتج') !== -1) {
                  sd = { text: subEl[++i], xpath: '' };
                }
              });
            }
          });
        }
        row.specifications = sd.text ? [sd] : [];
      }
      if (row.weightNet) {
        weight = {};
        try {
          row.weightNet.forEach((element, index) => {
            if (element.text.toUpperCase().indexOf('PRODUCT WEIGHT') !== -1 || element.text.indexOf('وزن المنتج') !== -1) {
              weight = { text: row.weightNet[++index].text, xpath: '' };
            }
          });
        } catch (e) {
          row.weightNet.forEach((element, index) => {
            if (element.text.indexOf('\n') !== -1) {
              var subEl = element.text.split('\n');
              subEl.forEach((item, i) => {
                if (item.toUpperCase().indexOf('PRODUCT WEIGHT') !== -1 || item.indexOf('وزن المنتج') !== -1) {
                  weight = { text: subEl[++i], xpath: '' };
                }
              });
            }
          });
        }
        row.weightNet = weight.text ? [weight] : [];
      }
      if (row.availabilityText) {
        const product = JSON.parse(row.availabilityText[0].text);
        row.availabilityText[0].text = product.offers.availability.replace('http://schema.org/', '');
        if (row.availabilityText[0].text == 'InStock') {
          row.availabilityText[0].text = 'In Stock';
        }
      }
      if (row.price) {
        var i = 0;
        for (var price of row.price) {
          row.price[i].text = price.text.replace('٫', ',').replace('٬', ',').replace('.', ',');
          i++;
        }
      }
      if (row.listPrice) {
        var i = 0;
        for (var listPrice of row.listPrice) {
          row.listPrice[i].text = listPrice.text.replace('٫', ',').replace('.', ',');
          i++;
        }
      }
      if (row.packSize) {
        var i = 0;
        for (var packSize of row.packSize) {
          row.packSize[i].text = '';
          i++;
        }
      }
      // if (row.alternateImages) {
      //   try {
      //     var regex = /(\/)(?!.*\/)(.*_)(.*)(\.)/g;
      //     var regex1 = /(\/)(?!.*\/)(.*_)(.*)(\.)/g;

      //     const altImgs = row.alternateImages;
      //     if (altImgs && altImgs.length > 1) {
      //       const prevImage = altImgs[0];
      //       const nextImage = altImgs[altImgs.length - 1];
      //       const match1 = regex.exec(prevImage.text);
      //       const match2 = regex1.exec(nextImage.text);
      //       const endNumber = Number(match1[3]);
      //       const startNumber = Number(match2[3]);
      //       const newAltImg = [];
      //       for (let i = startNumber; i <= endNumber; i++) {
      //         newAltImg.push({
      //           text: prevImage.text.replace(`_${endNumber}.`, `_${i}.`),
      //           xpath: prevImage.xpath
      //         })
      //       }
      //       row.alternateImages = newAltImg;
      //     }
      //   }
      //   catch { }
      // }
    }
  }
  return data;
};

module.exports = { transform };