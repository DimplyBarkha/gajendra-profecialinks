/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
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
  for (const {
      group
    } of data) {
    for (let row of group) {
      if (row.category) {
        if (row.category.length) {
          row.category.splice(0, 1)
        }
        if (row.category.length) {
          row.category.splice(row.category.length - 1, 1);
        }
      }
      if (row.image) {
        row.image.forEach(item => {
          item.text = 'https://zdravcity.ru/' + item.text
        });
      }
      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace('.', ',');
        });
      }
      if (row.listPrice) {
        row.listPrice.forEach(item => {
          item.text = item.text.replace('.', ',');
        });
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = 'https://zdravcity.ru/' + item.text
        });
      }
      if (row.manufacturer) {
        row.manufacturer.forEach(item => {
          item.text = item.text.replace(/Производитель\s*:/, '').trim();
        });
      }
      if (row.countryOfOrigin) {
        row.countryOfOrigin.forEach(item => {
          item.text = item.text.replace(/Страна\s+производства\s*:/, '').trim();
        });
      }
    }
  }
  return cleanUp(data);
};

module.exports = {
  transform
};