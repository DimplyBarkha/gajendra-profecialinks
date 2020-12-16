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
          item.text = item.text.includes('in Stock') ? 'In Stock.' : item.text;
        });
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          item.text = (+item.text).toFixed(1);
        });
      }
      if (row.technicalInformationPdfPresent) {
        row.technicalInformationPdfPresent[0].text = 'Yes';
      }

      if (row.termsAndConditions) {
        row.termsAndConditions[0].text = 'Yes';
      }

      if (row.manufacturerDescription) {
        row.manufacturerDescription[0].text = row.manufacturerDescription[0].text.replace(/\{.*\}/, '').trim();
      }

      if (row.image) {
        row.image.forEach(item => {
          item.text = item.text.replace(/(wid=)(\d)*/g, '$1500').replace(/(hei=)(\d)*/g, '$1500');
        });
      }

      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = item.text.replace(/(wid=)(\d)*/g, '$1500').replace(/(hei=)(\d)*/g, '$1500');
        });
      }

      if (row.imageAlt) {
        row.imageAlt.forEach(item => {
          item.text = item.text.replace(/(wid=)(\d)*/g, '$1500').replace(/(hei=)(\d)*/g, '$1500');
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
        if (row.warrantySpecifications) {
          row.warrantySpecifications.forEach(item => {
            item.text = ' || Warranty / Certifications ' + item.text.replace(/\n/g, '').trim();
          });
          row.specifications[0].text += row.warrantySpecifications[0].text;
        }
      }

      if (row.manufacturerDescription) {
        row.manufacturerDescription.forEach(item => {
          item.text = item.text.replace(/(\s?\n\s?)+/g, ' ').replace('Product Overview', '').trim();
        });
      }

      if (row.shippingDimensions) {
        row.shippingDimensions.forEach(item => {
          item.text = item.text.replace(/\)\n/g, ') : ').replace(/\n/g, ' | ').trim();
        });
      }

      if (row.descriptionBullets) {
        row.descriptionBullets.forEach(item => {
          if (item.text === '0') {
            item.text = '';
          }
        });
      }

      if (row.description) {
        row.description.forEach(item => {
          item.text = item.text.replace(/Overview/g, '').replace(/# ?/g, '').trim();
        });
        if (row.descriptionBulletsInfo) {
          row.descriptionBulletsInfo.forEach(item => {
            item.text = item.text.replace(/(\s?\n)+/g, ' || ').replace(/# ?/g, '').trim();
          });
        }
        row.additionalDescBulletInfo = row.descriptionBulletsInfo;
        row.description[0].text = row.description[0].text + ' || ' + row.descriptionBulletsInfo[0].text;
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
