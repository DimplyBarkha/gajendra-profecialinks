
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
      if (row.ratingCount) {
        row.ratingCount.forEach(item => {
          item.text = item.text.replace('(', '').trim();
          item.text = item.text.replace(')', '').trim();
        });
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          item.text = item.text.replace('product-rating-stars is--', '').trim();
        });
      }
      if (row.productUrl) {
        row.productUrl.forEach(item => {
          item.text = 'https://www.worldofsweets.de/' + item.text;
        });
      }
      if (row.ingredientsList) {
        row.ingredientsList.forEach(item => {
          item.text = item.text.replace('Zutaten:', '').trim();
        });
      }
      if (row.availabilityText) {
        row.availabilityText.forEach(item => {
          if (item.text === 'true') {
            item.text = 'In Stock';
          } else {
            item.text = 'Out Of Stock';
          }
        });
      }
      if (row.caloriesPerServing1) {
        row.caloriesPerServing1.forEach(item => {
          let caloriesText = item.text.substr(0, item.text.indexOf('(kJ)'));
          // item.text = caloriesText.replace(/Brennwert:/g, '').replace('Kilokalorien (kcal)','kcal').replace('Kilojoule (kJ)','kJ');
          caloriesText = caloriesText.replace(/Brennwert:/g, '').split('(kcal)');
          caloriesText = caloriesText[1] + '/' + caloriesText[0];
          item.text = caloriesText.replace('Kilokalorien', 'kcal').replace('Kilojoule', 'kJ').split(' ').join('').trim();
        });
        row.caloriesPerServing = row.caloriesPerServing1;
        delete row.caloriesPerServing1;
      }
    }
  }
  return cleanUp(data);
};
module.exports = { transform };
