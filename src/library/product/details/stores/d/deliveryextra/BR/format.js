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
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = item.text.replace('x200x200', '');
        });
        row.alternateImages = row.alternateImages.filter((item) => item.text !== row.image[0].text);
        row.alternateImages = row.alternateImages.filter((thing, index, self) => self.findIndex(t => t.text === thing.text) === index);
        row.secondaryImageTotal = [{ text: row.alternateImages.length }];
      }
      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach(item => {
          text += item.text + ' || ';
        });
        row.additionalDescBulletInfo = [{ text: text.slice(0, -2).trim() }];
      }
      if (row.servingSize) {
        if (row.servingSize[0].text.length && row.servingSize[0].text.includes('porção de')) {
          var test = '';
          var demo = row.servingSize[0].text;
          var regExString = new RegExp('(?:' + 'porção de' + ')(.[\\s\\S]*)(?:' + 'g' + ')', 'g');
          test = regExString.exec(demo);
          test = test[1].trim() + 'g';
          row.servingSize[0].text = test;
          row.servingSizeUom = [{ text: 'g' }];
        } else if (row.servingSize[0].text.length && row.servingSize[0].text.includes('Porção de')) {
          var test1 = '';
          var demo1 = row.servingSize[0].text;
          var regExString1 = new RegExp('(?:' + 'Porção de' + ')(.[\\s\\S]*)(?:' + 'g' + ')', 'g');
          test1 = regExString1.exec(demo1);
          test1 = test1[1].trim() + 'g';
          row.servingSize[0].text = test1;
          row.servingSizeUom = [{ text: 'g' }];
        }
      }
      if (row.category) {
        row.category.pop();
      }
      if (row.proteinPerServing && row.proteinPerServing[0].text.length) {
        row.proteinPerServingUom = [{ text: 'g' }];
      }
      if (row.sodiumPerServing && row.sodiumPerServing[0].text.length) {
        row.sodiumPerServingUom = [{ text: 'mg' }];
      }
      if (row.totalCarbPerServing && row.totalCarbPerServing[0].text.length) {
        row.totalCarbPerServingUom = [{ text: 'g' }];
      }
      if (row.ingredientsList) {
        row.ingredientsList[0].text = row.ingredientsList[0].text.replace(/Ingredientes:\n /, '');
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
