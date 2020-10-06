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
          text += item.text.trim() + ' || ';
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
      // if (row.price) {
      //   row.price.forEach(item => {
      //     item.text = item.text.replace(/\./, ',');
      //   });
      // }
      // if (row.listPrice) {
      //   row.listPrice.forEach(item => {
      //     item.text = item.text.replace(/\./, ',');
      //   });
      // }
      if (row.image) {
        row.image.forEach(item => {
          item.text = item.text.replace(/(.*)/, 'https:$1');
        });
      }
      // if (row.availabilityText) {
      //   row.availabilityText.forEach(item => {
      //     item.text = item.text.replace(/(.*)/, 'In Stock');
      //   });
      // }
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
      // if (row.gtin) {
      //   row.gtin.forEach(item => {
      //     item.text = item.text.match(/(\d+)/) && item.text.match(/(\d+)/)[0] ? item.text.match(/(\d+)/)[0] : '';
      //   });
      // }
      // if (row.aggregateRating) {
      //   row.aggregateRating.forEach(item => {
      //     item.text = item.text.replace(/\./, ',');
      //   });
      // }
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
          // eslint-disable-next-line eqeqeq
          if (item.text != 'No') {
            item.text = item.text.replace(/(.*)/, 'Yes');
          }
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
      // if (row.shippingWeight) {
      //   row.shippingWeight.forEach(item => {
      //     item.text = (!item.text.includes('netto')) ? item.text : '';
      //   });
      // }
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
