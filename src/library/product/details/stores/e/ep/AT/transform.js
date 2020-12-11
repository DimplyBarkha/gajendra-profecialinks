
/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text = text + (text ? ' ' : '') + item.text;
        });
        row.description = [{ text }];
      }

      if (row.aggregateRating) {
        let text = '';
        row.aggregateRating.forEach(item => {
          text = item.text.replace('.', ',');
        });
        row.aggregateRating = [{ text }];
      }

      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text = text + item.text + '||';
        });
        text = text.substring(0, text.length - 2);
        row.manufacturerDescription = [{ text }];
      }

      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text = text + item.text + '|';
        });
        text = text.substring(0, text.length - 1);
        row.specifications = [{ text }];
      }

      if (row.price) {
        let text = '';
        row.price.forEach(item => {
          text = item.text.toString().replace('.', ',');
        });
        row.price = [{ text }];
      }

      if (row.listPrice) {
        let text = '';
        row.listPrice.forEach(item => {
          text = item.text.toString().replace('.', ',');
        });
        row.listPrice = [{ text }];
      }

      if (row.inTheBoxUrl && row.inTheBoxUrl[0]) {
        row.inTheBoxUrl.forEach(item => {
          if (item.text.includes(' 200w')) {
            const imgUrl = item.text.split(' 200w, ')[0];
            if (!(item.text.includes('http'))) {
              item.text = 'https:' + imgUrl;
            }
          }
        });
      }
    }
  }

  // Clean up data
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
