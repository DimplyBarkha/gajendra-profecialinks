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
    .replace(/"\s{1,}/g, '" ')
    .replace(/\s{1,}"/g, ' "')
    .replace(/^ +| +$|() + /g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');

  for (const { group } of data) {
    for (const row of group) {
      if (!row.price && row.price1) {
        row.price = row.price1;
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          item.text = (+item.text).toFixed(1);
        });
      } else {
        if (!row.aggregateRating && row.nameExtended) {
          row.aggregateRating = [{ text: '0' }];
        }
      }
      if (row.manufacturerDescription && row.manufacturerDescription[0]) {
        row.manufacturerDescription[0].text = row.manufacturerDescription[0].text.replace(/\{.*\}/, '').replace(/^\d+\s/, '').trim();
      }

      if (row.manufacturerImages) {
        row.manufacturerImages.forEach(item => {
          if (item.text.match(/(\/\/)(.*?)(,?)/g)) {
            item.text = item.text.replace(/(\/\/)(.*?)(,?)/g, 'https:$1$2');
          }
          if (item.text.match(/(.*) 200w,(.*)/)) {
            item.text = item.text.replace(/(.*) 200w,(.*)/, '$1');
          }
          item.text = item.text.startsWith('https:') ? item.text : `https:${item.text}`;
        });
      }

      if (row.imageAlt && row.imageAlt[0] && row.imageAlt[0].text === 'undefined HttpErrorResponse') {
        row.imageAlt = [{ text: '' }];
      }

      if (row.shippingDimensions) {
        row.shippingDimensions.forEach(item => {
          item.text = item.text.replace(/\)\n/g, ') : ').replace(/\n/g, ' | ').trim();
          const index = item.text.indexOf('Packaged');
          item.text = item.text.slice(index);
        });
      }
      if (row.unInterruptedPDP) {
        let text = '';
        row.unInterruptedPDP.forEach(item => {
          text = row.unInterruptedPDP.map(elm => elm.text).join(' || ');
        });
        row.unInterruptedPDP = [
          {
            text: text,
          },
        ];
      }
      if (row.specifications) {

      if (row.specifications && row.specifications[0]) {
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
      if (row.descriptionBulletsInfo && row.descriptionBulletsInfo[0]) {
        row.descriptionBulletsInfo.forEach(item => {
          item.text = item.text.replace(/(\s?\n)+/g, ' || ').replace(/# ?/g, '').trim();
        });
        row.additionalDescBulletInfo = row.descriptionBulletsInfo;
      }

      if (row.description && row.description[0] && row.description[0].text !== ' ') {
        row.description && row.description.forEach(item => {
          item.text = item.text.replace(/Overview/g, '').replace(/# ?/g, '').trim();
        });
        const guide = row.description1 && row.description1[0] ? row.description1[0].text : '';
        const bullets = row.descriptionBulletsInfo && row.descriptionBulletsInfo[0] ? row.descriptionBulletsInfo[0].text : '';
        if (bullets) {
          row.description[0].text = row.description[0].text + ' || ' + bullets;
        }
        if (guide) {
          row.description[0].text = row.description[0].text + ' ' + guide;
        }
      }

      if (row.nameExtended) {
        row.nameExtended.forEach(item => {
          item.text = item.text.replace(/-\s*The Home Depot$/, '').replace(/#/g, '').replace(/Model {2}/, ' Model ').replace(/SKU {2}/, 'SKU ').trim();
        });
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
      if (row.gtin) {
        row.gtin.forEach(item => {
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
