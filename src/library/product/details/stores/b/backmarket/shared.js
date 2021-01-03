
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
    .replace(/^ +| +$|( )+/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
  for (const { group } of data) {
    for (const row of group) {
      if (row.availabilityText) {
        row.availabilityText.forEach(item => {
          if (item.text.includes('Ajouter au panier')) {
            item.text = 'In Stock';
          } else if (item.text.includes('Créer une alerte')) {
            item.text = 'Out of Stock';
          }
        });
      }

      if (row.category) {
        row.category.pop();
      }

      if (row.description) {
        row.description.forEach(item => {
          item.text = item.text.replace(/(\s*[\r\n]\s*)+/g, ' ').trim();
        });
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          item.text = item.text.replace('.', ',');
        });
      }
      if (row.weightNet) {
        row.weightNet.forEach(item => {
          item.text = item.text.trim();
        });
      }
      if (row.brandText) {
        let text = '';
        row.brandText.forEach(item => {
          if (item.text === 'BRAND') {
            if (row.name) {
              row.name.forEach(item => {
                text = item.text.split(' ')[0];
              });
            }
            item.text = text;
          }
        });
      }
      if (row.description) {
        row.description.forEach(item => {
          item.text = item.text.replace(/(\|\|\s\|\|)/g, '||').replace(/(\s*[\r\n]\s*)+/g, ' ').replace(/&nbsp;/g, ' ').replace('&amp;', '&').trim();
        });
      }
      if (row.specifications) {
        row.specifications.forEach(item => {
          item.text = item.text.replace(/(\|\|\s\|\|)/g, '||').replace(/(\s*[\r\n]\s*)+/g, ' ').replace(/&nbsp;/g, ' ').replace('&amp;', '&').trim();
        });
      }
      if (row.image) {
        row.image.forEach(item => {
          if (item.text.includes('(') || item.text.includes(')')) {
            item.text = item.text ? item.text.split('(')[1] : '';
            item.text = item.text ? item.text.split(')')[0] : '';
            item.text = item.text.replace('"', '').replace("'", '').replace(/"/, '');
          }
        });
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          if (item.text.includes('(') || item.text.includes(')')) {
            item.text = item.text ? item.text.split('(')[1] : '';
            item.text = item.text ? item.text.split(')')[0] : '';
            item.text = item.text.replace('"', '').replace("'", '').replace(/"/, '');
          }
        });
      }
      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach(item => {
          text += `|| ${item.text.replace(/\n \n/g, ' ')}  `;
        });
        row.additionalDescBulletInfo = [
          {
            text: text,
          },
        ];
      }
      if (row.variantId) {
        row.variantId.forEach(item => {
          const arr = item.text.split('/');
          const length = arr.length;
          const id = arr[length - 1];
          item.text = id.replace(/(.*)\.html/, '$1').trim();
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
