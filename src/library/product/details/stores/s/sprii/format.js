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
                if (element.trim() !== '') {
                  counter++;
                  row.additionalDescBulletInfo.push({
                    text: element,
                    xpath: ''
                  });
                }
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
        } else if (row.availabilityText[0].text == 'OutOfStock') {
          row.availabilityText[0].text = 'Out Of Stock';
        }

      }
      if (row.price) {
        var i = 0;
        for (var price of row.price) {
          row.price[i].text = price.text.replace('٫', '.').replace('٬', '');
          i++;
        }
      }
      if (row.listPrice) {
        var i = 0;
        for (var listPrice of row.listPrice) {
          row.listPrice[i].text = listPrice.text.replace('٫', '.');
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
      if (row.variantCount) {
        row.variantCount.forEach((element, index) => {
          row.variantCount[index].text = '0';
        });
      }
      if (row.alternateImages) {
        try {
          var pI = row.image[0].text.split('/');
          var cacheNumber = '';
          pI.forEach((element, index) => {
            if (element === 'cache') {
              cacheNumber = pI[++index];
            }
          });
          console.log('cacheNumber', cacheNumber);
          row.alternateImages.forEach((element, i) => {
            var sI = element.text.split('/');
            sI.forEach((element, index) => {
              if (element === 'cache') {
                sI[++index] = cacheNumber;
              }
            });
            row.alternateImages[i].text = sI.join('/');
          });
        }
        catch (e) { }
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = el.text ? clean(el.text) : el.text;
  }))));
  return data;
};

module.exports = { transform };