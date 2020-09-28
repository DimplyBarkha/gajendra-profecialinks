/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data, context) => {
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
      if (row.brandText) {
        row.brandText.forEach(item => {
          item.text = item.text ? item.text.replace('¡Nuevo!', '').trim().split(' ')[0] : '';
        });
      }

      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text += `${item.text.replace(/\n/g, ' : ')} || `;
        });
        row.specifications = [
          {
            text: text,
          },
        ];
      }

      if (row.manufacturerDescription) {
        row.manufacturerDescription.forEach(item => {
          item.text = item.text.replace(/(\s*[\r\n]\s*)+/g, ' ').trim();
        });
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          item.text = item.text.replace('.', ',');
        });
      }
      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace(',', '').replace('.', ',');
        });
      }
      if (row.listPrice) {
        row.listPrice.forEach(item => {
          item.text = item.text.replace(',', '').replace('.', ',');
        });
      }
      if (row.category) {
        let cat = false;
        row.category.forEach(item => {
          if (item.text === 'Hogar') {
            cat = true;
          }
        });
        // @ts-ignore
        if (cat === true) {
          row.category.shift();
        }
      }
      if (row.videos) {
        row.videos.forEach(item => {
          item.text = 'https://youtu.be/' + item.text
        });
      }
      if (row.ratingCount) {
        row.ratingCount.forEach(item => {
          item.text = item.text.trim().replace(",", '');
          item.text = Number(item.text)
        });
      }
      if (row.manufacturerImages) {
        row.manufacturerImages.forEach(item => {
          if (item.text.includes('https:')) {
            item.text = item.text;
          } else {
            item.text = 'https:' + item.text;
          }
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
