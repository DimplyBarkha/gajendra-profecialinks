
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
      if (row.caloriesPerServing) {
        if (row.caloriesPerServing[0].text.includes('kcal')) {
          if (row.caloriesPerServing[0].text.match(/(.*)(kj*\/*)(\d*) kcal/)) {
            row.caloriesPerServing = [{ text: row.caloriesPerServing[0].text.replace(/(.*)(kj*\/*)(\d*) kcal/, '$3') }];
          }
          if (row.caloriesPerServing[0].text.match(/(^\d*) kcal/)) {
            row.caloriesPerServing = [{ text: row.caloriesPerServing[0].text.replace(/(^\d*) kcal/, '$1') }];
          }
        } else {
          row.caloriesPerServing = [{ text: row.caloriesPerServing[0].text.replace(/(\d*) kj(.*)/, '$1 kj') }];
        }
      }
      if (row.ingredientsList) {
        let desc = '';
        row.ingredientsList.forEach(item => {
          desc += `${item.text} `;
        });
        row.ingredientsList = [
          {
            text: desc,
          },
        ];
      }
      if (row.manufacturer) {
        row.manufacturer = [{ text: row.manufacturer[0].text.replace(/\n/g, ' ').replace(/Nom de l'exploitant : (.*) Adress(.*)/, '$1') }];
      }
      if (!row.magnesiumPerServing && row.magnesiumPerServing1) {
        row.magnesiumPerServing = row.magnesiumPerServing1;
        if (!row.magnesiumPerServingUom && row.magnesiumPerServingUom1) {
          row.magnesiumPerServingUom = row.magnesiumPerServingUom1;
        }
      }
      if (!row.calciumPerServing && row.calciumPerServing1) {
        row.calciumPerServing = row.calciumPerServing1;
        if (!row.calciumPerServingUom && row.calciumPerServingUom1) {
          row.calciumPerServingUom = row.calciumPerServingUom1;
        }
      }
      if (!row.sodiumPerServing && row.sodiumPerServing1) {
        row.sodiumPerServing = row.sodiumPerServing1;
        if (!row.sodiumPerServingUom && row.sodiumPerServingUom1) {
          row.sodiumPerServingUom = row.sodiumPerServingUom1;
        }
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
