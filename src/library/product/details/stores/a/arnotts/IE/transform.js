/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  const cleanUp = text => text.toString()
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
      if (row.alternateImages) {
        row.alternateImages.forEach(alternateImages => {
          alternateImages.text = alternateImages.text.replace('prodgrid_recommend', 'detail_zoom').trim();
        });
      }
      if (row.category) {
        row.category.forEach(category => {
          category.text = category.text.replace('Home', '').replace(/\n\s/g, '').trim();
        });
      }
      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text += `${item.text} || `;
        });
        row.specifications = [
          {
            text: cleanUp(text.slice(0, -3)),
          },
        ];
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += item.text.replace(/\n \n/g, '||').replace(/\n/g, '');
        });
        row.description = [
          {
            text: cleanUp(text),
          },
        ];
      }
      if (row.variantCount) {
        row.variantCount.forEach(variantCount => {
          if (variantCount.text == '0') {
            variantCount.text = '1';
          }
        });
      }
      if (row.variantInformation) {
        row.variantInformation.forEach(variantInformation => {
          variantInformation.text = variantInformation.text.replace(/"/g, '').replace('{url:{},', '').replace(/,/g, '|').replace(/}/g, '');
        });
      }
      if (row.quantity) {
        let text = '';
        row.quantity.forEach(item => {
          text += `${item.text} | `;
        });
        row.quantity = [
          {
            text: cleanUp(text.slice(0, -3)),
          },
        ];
      }
      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach(item => {
          text += `${item.text} || `;
        });
        row.additionalDescBulletInfo = [
          {
            text: cleanUp(text.slice(0, -3)),
          },
        ];
      }
      if (row.featureBullets) {
        let text = '';
        row.featureBullets.forEach(item => {
          text += `${item.text} || `;
        });
        row.featureBullets = [
          {
            text: cleanUp(text.slice(0, -3)),
          },
        ];
      }
      if (row.variantAsins) {
        let text = '';
        row.variantAsins.forEach(item => {
          text += `${item.text.replace('=', '')} | `;
        });
        row.variantAsins = [
          {
            text: cleanUp(text.slice(0, -3)),
          },
        ];
      }
    }
  }
  return data;
};

module.exports = { transform };
