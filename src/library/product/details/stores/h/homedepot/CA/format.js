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
    .replace(/^ +| +$|() + /g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');

  for (const { group } of data) {
    for (const row of group) {
      if (row.availabilityText) {
        row.availabilityText.forEach(item => {
          item.text = item.text.includes('InStock') ? 'In Stock' : 'Out of Stock';
        });
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          item.text = (+item.text).toFixed(1);
        });
      }

      if (row.manufacturerDescription && row.manufacturerDescription[0]) {
        row.manufacturerDescription[0].text = row.manufacturerDescription[0].text.replace(/\{.*\}/, '').replace(/^\d+\s/, '').trim();
      }

      if (row.manufacturerImages) {
        row.manufacturerImages.forEach(item => {
          item.text = `https:${item.text}`;
        });
      }

      if (row.image) {
        row.image.forEach(item => {
          item.text = item.text.replace(/(wid=)(\d)*/g, '$1500').replace(/(hei=)(\d)*/g, '$1500');
        });
      }

      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = item.text.replace(/(.*).jpg(.*)/g, '$1.jpg');
        });
      }

      if (row.imageAlt && row.imageAlt[0] && row.imageAlt[0].text === 'undefined HttpErrorResponse') {
        row.imageAlt = [{ text: '' }];
      }

      if (row.shippingDimensions) {
        row.shippingDimensions.forEach(item => {
          item.text = item.text.replace(/\)\n/g, ') : ').replace(/\n/g, ' | ').trim();
          const index = item.text.indexOf('Packaged');
          item.text = item.text.slice(index, -1);
        });
      }

      if (row.specifications) {
        row.specifications[0].text = '';
        if (row.dimensionsSpecifications) {
          row.dimensionsSpecifications.forEach(item => {
            item.text = 'Dimensions ' + item.text.replace(/\)\n/g, ') : ').replace(/\n/g, ' || ').trim();
          });
          row.specifications[0].text += row.dimensionsSpecifications[0].text;
        }
        if (row.detailsSpecifications) {
          row.detailsSpecifications.forEach(item => {
            item.text = ' || Details ' + item.text.replace(/\n(.*)\n/g, ' : $1 || ').replace(/\n/, ' : ').trim();
          });
          row.specifications[0].text += row.detailsSpecifications[0].text;
        }
      }

      if (row.manufacturerDescription) {
        row.manufacturerDescription.forEach(item => {
          item.text = item.text.replace(/(\s?\n\s?)+/g, ' ').replace('Product Overview', '').trim();
        });
      }

      if (row.descriptionBullets) {
        row.descriptionBullets.forEach(item => {
          if (item.text === '0') {
            item.text = '';
          }
        });
      }

      if (row.description && row.description[0] && row.description[0].text !== ' ') {
        row.description.forEach(item => {
          item.text = item.text.replace(/Overview/g, '').replace(/# ?/g, '').trim();
        });
        if (row.descriptionBulletsInfo) {
          row.descriptionBulletsInfo.forEach(item => {
            item.text = item.text.replace(/(\s?\n)+/g, ' || ').replace(/# ?/g, '').trim();
          });
        }
        row.additionalDescBulletInfo = row.descriptionBulletsInfo;
        const guide = row.description1 && row.description1[0] ? row.description1[0].text : '';
        row.description[0].text = row.description[0].text + ' || ' + row.descriptionBulletsInfo[0].text + ' ' + guide;
      }

      if (row.nameExtended) {
        row.nameExtended.forEach(item => {
          item.text = item.text.replace(/-\s*The Home Depot$/, '').replace(/#/g, '').replace(/Model {2}/, ' Model ').replace(/SKU {2}/, 'SKU ').trim();
        });
      }
      if (row.warnings) {
        row.warnings.forEach(item => {
          item.text = item.text.replace(/see\s*/i, '').trim();
        });
      }
      if (row.mpc) {
        row.mpc.forEach(item => {
          item.text = item.text.replace(/.*?#/, '').trim();
        });
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
