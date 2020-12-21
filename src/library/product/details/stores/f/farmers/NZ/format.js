
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */

const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.specifications) {
        var specificationValues = {};
        var spec = '';
        row.specifications.forEach((ele) => {
          var data = ele.text.split('\n \n');
          if (data.length !== 0) {
            specificationValues[data[0].trim()] = data[1].trim();
            spec += ' || ' + data[0].trim() + ': ' + data[1].trim();
          }
        });
        row.specifications = [{
          text: spec.trim(),
        }];
      }
      if (row.availabilityText) {
        row.availabilityText[0].text = row.availabilityText[0].text === 'Out of Stock' ? row.availabilityText[0].text : 'In Stock';
      };
      if (row.descriptionBullets) {
        row.descriptionBullets = [
          {
            text: row.additionalDescBulletInfo.length,
          },
        ];
      }
      if (row.alternateImages) {
        if (row.alternateImages[0].text === row.image[0].text) {
          row.alternateImages.shift();
        }
      }
      if (row.largeImageCount && row.alternateImages) {
        row.largeImageCount[0].text = row.alternateImages.length;
      }
      if (row.shippingInfo) {
        var text = '';
        row.shippingInfo.forEach((ele) => {
          text += ' ' + ele.text.replace('\n', '');
        });
        row.shippingInfo = [
          {
            text: text.trim(),
          },
        ];
      }
      if (row.category) {
        if (row.category[0].text === 'Home') {
          row.category.shift();
        }
        if (row.category[row.category.length - 1].text === row.name[0].text) {
          row.category.pop();
        }
      }
      if (row.sku) {
        row.sku[0].text = row.sku[0].text.substring(1);
      }
      if (row.asin) {
        row.asin[0].text = row.asin[0].text.substring(1);
      }
      if (row.firstVariant) {
        row.firstVariant[0].text = row.firstVariant[0].text.substring(1);
      }
      if (row.variantId) {
        row.variantId[0].text = row.variantId[0].text.substring(1);
      }
      if (row.price) {
        row.price[0].text = ((row.price[0].text.split(' ')).slice(-1))[0];
      }
      if (row.listPrice) {
        row.listPrice[0].text = ((row.listPrice[0].text.split(' ')).slice(-1))[0];
      }
      if (row.description) {
        var desc = '';
        row.description.forEach(element => {
          desc += '' + element.text;
        });
        if(row.additionalDescBulletInfo) {
          row.additionalDescBulletInfo.forEach((ele) => {
            desc += ' || ' + ele.text;
          });
        }
        row.description = [{
          text: desc.trim(),
        }];
      }
      if (row.weightNet && specificationValues && specificationValues.Weight) {
        row.weightNet[0].text = specificationValues.Weight;
      }
      if (row.manufacturerImages) {
        var manuImages = row.manufacturerImages[0].text.split(',');
        row.manufacturerImages = [];
        manuImages.forEach(ele => {
          var obj = {};
          obj.text = ele;
          row.manufacturerImages.push(obj);
        });
      }
      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach(item => {
          text += `|| ${item.text.trim()}`;
        });
        row.additionalDescBulletInfo = [
          {
            text: text,
          },
        ];
      }
      if (row.inTheBoxUrl && row.inTheBoxUrl[0]) {
        row.inTheBoxUrl.forEach(item => {
          item.text = item.text.replace(/200w(.*)/gm, '').trim();
          if (!item.text.startsWith('http')) {
            item.text = 'https:' + item.text;
          }
        });
      }
    }
  }
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
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
