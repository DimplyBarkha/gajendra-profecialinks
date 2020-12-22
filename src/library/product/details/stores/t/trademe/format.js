
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
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
  for (const { group } of data) {
    for (const row of group) {
      if (row.shippingInfo) {
        row.shippingInfo.forEach(item => {
          item.text = item.text.replace(/\s\n/g, '').slice();
        });
      }
      if (row.brandText) {
        row.brandText.forEach(item => {
          const itemmatch = item.text.match(/Dyson/);
          if (itemmatch) {
            item.text = 'Dyson';
          } else {
            delete row.brandText;
          }
        });
      }
      if (row.description) {
        row.description.forEach(item => {
          item.text = item.text.replace(/\n\s*\n\s*\n\s*\n\s*/g, '').slice();
          item.text = item.text.replace(/\n\s*\n\s*/g, '').slice();
          item.text = item.text.replace(/(\s*\n\s*)+/g, ' || ').trim();
        });
      }
      if (row.specifications) {
        row.specifications.forEach(item => {
          item.text = item.text.replace(/(\s*\n\s*)+/g, ' || ').trim();
        });
      }
      if (row.weightNet) {
        row.weightNet.forEach(item => {
          item.text = item.text.replace(/(\s*Weight\s*:\s*)+/g, '').trim();
        });
      }
      if (row.additionalDescBulletInfo) {
        var arrInfo = [];
        row.additionalDescBulletInfo.forEach(item => {
          arrInfo.push(item.text.trim());
        });
        if (arrInfo.length) {
          row.descriptionBullets = [{ text: arrInfo.length }];
          var tempText = arrInfo.join(' || ');
          tempText = '|| ' + tempText;
          row.additionalDescBulletInfo = [{ text: tempText }];
        }
      }
      if (row.availabilityText) {
        row.availabilityText.forEach(item => {
          if (item.text === 'Buy Now') {
            item.text = 'In Stock';
          }
        });
      }

      if (row.image) {
        row.image.forEach(item => {
          item.text = item.text.match(/\(([^)]+)\)/)[1].slice(1, -1);
          item.text = item.text.replace(/\n\s*\n\s*/g, '').slice();
        });
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = item.text.match(/\(([^)]+)\)/)[1].slice(1, -1);
          item.text = item.text.replace(/\/thumb\//, '/full/');
        });
        if (row.alternateImages.length > 1) {
          row.alternateImages.splice(0, 1);
        } else {
          delete row.alternateImages;
        }
      }
      if (row.manufacturerDescription) {
        row.manufacturerDescription.forEach(item => {
          item.text = item.text.replace(/\s\n/g, '').slice();
        });
      }

      if (row.sku) {
        row.sku.forEach(item => {
          item.text = item.text.match(/[^#]*$/g);
          item.text = item.text.toString().slice(0, -3);
        });
      }
      if (row.variantId) {
        row.variantId.forEach(item => {
          item.text = item.text.match(/[^#]*$/g);
          item.text = item.text.toString().slice(0, -3);
        });
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };
