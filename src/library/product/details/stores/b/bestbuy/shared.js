/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data, context) => {
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
      if (row.variantCount) {
        row.variantCount.forEach(item => {
          if (item.text === '0') {
            item.text = '1';
          }
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
  return data;
};

module.exports = { transform };
