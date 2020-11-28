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
  for (const { group } of data) {
    for (const row of group) {
      if (row.specifications) {
        var arrSpecs = [];
        row.specifications.forEach(item => {
          item.text = item.text.replace(/\n\s*\n/g, ' : ');
          arrSpecs.push(item.text);
        });
        row.specifications = [{ text: arrSpecs.join(' || ') }];
      }
      if (row.price) {
        row.price.forEach(item => {
          // item.text = item.text.replace(',', '');
          item.text = item.text.replace('.', ',');
          item.text = '€ ' + item.text;
        });
      }
      if (row.listPrice) {
        row.listPrice.forEach(item => {
          // item.text = item.text.replace(',', '');
          item.text = item.text.replace('.', ',');
        });
      }
      if (row.ratingCount) {
        var dataJson = JSON.parse(row.ratingCount[0].text);
        if (dataJson.aggregateRating) {
          if (dataJson.aggregateRating.ratingValue) {
            row.aggregateRating = [{ text: dataJson.aggregateRating.ratingValue }];
          }
          if (dataJson.aggregateRating.reviewCount) {
            row.ratingCount = [{ text: dataJson.aggregateRating.reviewCount }];
          }
        }
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };
