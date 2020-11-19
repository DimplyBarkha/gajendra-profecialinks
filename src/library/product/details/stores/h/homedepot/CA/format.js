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
      if (!row.price && row.price1 && row.price1[0]) {
        const price = Number(parseFloat(row.price1[0].text).toFixed(2)).toLocaleString('en', {
          minimumFractionDigits: 2,
        });
        row.price = [{
          text: `$${price}`,
        }];
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
          item.text = item.text.startsWith('https:') ? item.text : `https:${item.text}`;
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

      if (!row.image && row.image1 && row.image1[0]) {
        row.image = [{ text: row.image1[0].text.replace(/(wid=)(\d)*/g, '$1500').replace(/(hei=)(\d)*/g, '$1500') }];
      }

      if (row.shippingDimensions) {
        row.shippingDimensions.forEach(item => {
          item.text = item.text.replace(/\)\n/g, ') : ').replace(/\n/g, ' | ').trim();
          const index = item.text.indexOf('Packaged');
          item.text = item.text.slice(index);
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
          item.text = item.text.replace(/(\s?\n\s?)+/g, ' ').replace('Product Overview', '').replace('HDS8645C – Product Spec Sheet with Installation Instructions View HDS8645C – Product Spec Sheet with Installation Instructions PDF | Download HDS8645C – Product Spec Sheet with Installation Instructions PDF PDF, 1.84MB, 2 pages HDS8645C – Overview HDS8645C – Overview View HDS8645C – Overview PDF | Download HDS8645C – Overview PDF PDF, 2.78MB, 2 pages', ' View | Download PDF, 1.84MB, 2 pages HDS8645C – Overview View | Download PDF, 2.78MB, 2 pages').trim();
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
        const quantity = row.nameExtended[0].text;
        if (quantity.match(/(.*)([0-9][.][0-9]+) L (.*)/) || quantity.match(/(.*) (\d*) inch x (\d*) inch (.*)/) || quantity.match(/(.*) (\d*) Ml (.*)/) || quantity.match(/(.*) (\d*) ft. x (\d*) ft. (.*)/)) {
          row.quantity = [{ text: quantity.replace(/(.*)([0-9][.][0-9]+) L (.*)/, '$2').replace(/(.*) (\d*) inch x (\d*) inch (.*)/, '$2*$3').replace(/(.*) (\d*) Ml (.*)/, '$2').replace(/(.*) (\d*) ft. x (\d*) ft. (.*)/, '$2*$3') }];
        }
        if (row.availabilityText) {
          row.availabilityText.forEach(item => {
            item.text = item.text.includes('InStock') ? 'In Stock' : 'Out of Stock';
          });
        } else {
          row.availabilityText = [{ text: 'Out of Stock' }];
        }
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
      if (row.videos && row.videos1) {
        row.videos.push(...row.videos1);
      } else {
        if (row.videos1) {
          row.videos = row.videos1;
        }
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
