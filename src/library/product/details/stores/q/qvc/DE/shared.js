
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.specifications) {
        let text = '';
        row.specifications.forEach((item, index) => {
          if (index % 2 === 0) {
            text += item.text.trim() + ' : ';
          } else {
            text += item.text.trim() + ' || ';
          }
        });
        row.specifications = [
          {
            text: text.slice(0, -3),
          },
        ];
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = item.text.replace(/(.*)/, 'https:$1');
        });
      }
      if (row.image) {
        row.image.forEach(item => {
          item.text = item.text.replace(/(.*)/, 'https:$1');
        });
      }
      if (row.availabilityText) {
        row.availabilityText.forEach(item => {
          item.text = item.text.replace(/(.*)/, 'In Stock');
        });
      }
      if (row.description) {
        row.description.forEach(item => {
          item.text = item.text.replace(/\n/gm, '').replace(/\s{2,}/gm, ' ').trim();
        });
        if (row.additionalDescBulletInfo) {
          for (const bullet of row.additionalDescBulletInfo) {
            for (const item of row.description) {
              item.text = item.text.replace(bullet.text, `|| ${bullet.text}`);
            }
          }
        }
      }
      if (row.brandText) {
        row.brandText.forEach(item => {
          item.text = item.text.replace(/.*"brand_name":\["(.*?)"\].*/gm, '$1').trim();
        });
      }
      if (row.gtin) {
        row.gtin.forEach(item => {
          item.text = item.text.match(/(\d+)/) && item.text.match(/(\d+)/)[0] ? item.text.match(/(\d+)/)[0] : '';
        });
      }
      if (row.manufacturerDescription) {
        row.manufacturerDescription.forEach(item => {
          item.text = item.text.replace(/\n/gm, '').replace(/\s{2,}/gm, ' ').trim();
        });
      }
      if (row.variantCount) {
        row.variantCount.forEach(item => {
          // eslint-disable-next-line eqeqeq
          if (item.text == 0) {
            item.text = 1;
          }
        });
      }
      if (row.technicalInformationPdfPresent) {
        row.technicalInformationPdfPresent.forEach(item => {
          item.text = item.text.replace(/(.*)/, 'Yes');
        });
      }
      if (row.nameExtended) {
        row.nameExtended.forEach(item => {
          item.text = item.text.trim();
        });
      }
      if (row.ratingCount) {
        row.ratingCount.forEach(item => {
          item.text = item.text.replace(/\((.*)\)/, '$1');
        });
      }
      if (row.shippingWeight) {
        row.shippingWeight.forEach(item => {
          item.text = (!item.text.includes('netto')) ? item.text : '';
        });
      }
    }
  }
  return data;
};

module.exports = { transform };
