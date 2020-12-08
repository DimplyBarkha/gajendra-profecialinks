
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  // Default transform function
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
      if (row.nameExtended) {
        row.nameExtended.forEach(nameExtended => {
          if (row.brandText && row.color) {
            nameExtended.text = row.brandText[0].text + ' - ' + nameExtended.text + ' - ' + row.color[0].text.replace('Couleur:', '').trim();
          } else {
            if (row.brandText) {
              nameExtended.text = row.brandText[0].text + ' - ' + nameExtended.text;
            }
          }
        });
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(rating => {
          rating.text = rating.text.replace('.', ',');
        });
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text = item.text.replace(/\n/, '').replace(/\n \n/, '').replace(/\n/g, ' || ').trim();
        });
        row.description = [
          {
            text: text,
          },
        ];
      }
      if (row.alternateImages) {
        row.alternateImages.shift();
      }
      if (row.category) {
        if (row.category[0].text.includes('Accueil')) {
          row.category.shift();
        }
      }
      if (row.quantity) {
        row.quantity.forEach(quantity => {
          quantity.text = quantity.text.replace('Product dimensions:', '').trim();
        });
      }
      if (row.color) {
        row.color.forEach(color => {
          color.text = color.text.replace('Couleur:', '').trim();
        });
      }
      if (row.variantInformation) {
        row.variantInformation.forEach(color => {
          color.text = color.text.replace('Couleur:', '').trim();
        });
      }
      if (row.specifications) {
        row.specifications.forEach(specifications => {
          specifications.text = specifications.text.replace(/\n/g, '||').trim();
        });
      }
      if (row.variantCount) {
        row.variantCount.forEach(variantCount => {
          if (variantCount.text === '0') {
            variantCount.text = '1';
          }
        });
      }
      if (row.variantAsins) {
        if (row.variantAsins.length === 1) {
          row.variantAsins.shift();
        } else {
          let text = '';
          row.variantAsins.forEach(item => {
            text += `${item.text} | `;
          });
          row.variantAsins = [
            {
              text: text.slice(0, -3),
            },
          ];
        }
      }
      if (row.variants) {
        if (row.variants.length === 1) {
          row.variants.shift();
        } else {
          let text = '';
          row.variants.forEach(item => {
            text += `${item.text} | `;
          });
          row.variants = [
            {
              text: text.slice(0, -3),
            },
          ];
        }
      }
      if (row.promotion) {
        let text = '';
        row.promotion.forEach(item => {
          text += `${item.text}`;
        });
        row.promotion = [
          {
            text: text,
          },
        ];
      }
      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach(item => {
          text += `|| ${item.text}`;
        });
        row.additionalDescBulletInfo = [
          {
            text: text,
          },
        ];
      }
      if (row.weightNet) {
        row.weightNet.forEach(weight => {
          weight.text = weight.text.replace(/(.*) ([0-9]+[.]?[0-9]*) (.*)/, '$2');
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
