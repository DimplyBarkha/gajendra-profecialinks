
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
          if (row.caloriesPerServing[0].text.match(/(.*)(kj*\/*)([0-9]+[.]?[0-9]*) kcal/)) {
            row.caloriesPerServing = [{ text: row.caloriesPerServing[0].text.replace(/(.*)(kj*\/*)([0-9]+[.]?[0-9]*) kcal/, '$3') }];
          }
          if (row.caloriesPerServing[0].text.match(/(^[0-9]+[.]?[0-9]*) kcal/)) {
            row.caloriesPerServing = [{ text: row.caloriesPerServing[0].text.replace(/(^[0-9]+[.]?[0-9]*) kcal/, '$1') }];
          }
        } else {
          if (row.caloriesPerServing[0].text.match(/([0-9]+[.]?[0-9]*) kj(.*)/)) {
            row.caloriesPerServing = [{ text: row.caloriesPerServing[0].text.replace(/([0-9]+[.]?[0-9]*) kj(.*)/, '$1 kj') }];
          }
        }
      }
      if (row.ingredientsList) {
        let desc = '';
        row.ingredientsList.forEach(item => {
          desc += `${item.text}`;
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
      if (!row.magnesiumPerServing && row.ingredientsList) {
        if (row.ingredientsList[0].text.match(/(.*)(Magnésium Mg\+\+|magnésium Mg\+\+)(:?|=?) ([0-9]+[,]?[0-9]*)(,?|\/?|;?)(.*)/)) {
          row.magnesiumPerServing = [{ text: row.ingredientsList[0].text.replace(/(.*)(Magnésium Mg\+\+|magnésium Mg\+\+)(:?|=?) ([0-9]+[,]?[0-9]*)(,?|\/?|;?)(.*)/, '$4').replace(/([0-9]+[,]?[0-9]*),$/, '$1') }];
        }
        if (row.ingredientsList[0].text.match(/(.*)(Magnésium|magnésium) (:?|=?) ([0-9]+[,]?[0-9]*)(,?|\/?|;?)(.*)/)) {
          row.magnesiumPerServing = [{ text: row.ingredientsList[0].text.replace(/(.*)(Magnésium|magnésium) (:?|=?) ([0-9]+[,]?[0-9]*)(,?|\/?|;?)(.*)/, '$4').replace(/([0-9]+[,]?[0-9]*),$/, '$1') }];
        }
      }
      if (!row.magnesiumPerServingUom && row.magnesiumPerServingUom1) {
        row.magnesiumPerServingUom = row.magnesiumPerServingUom1;
      }
      if (!row.calciumPerServing && row.ingredientsList) {
        if (row.ingredientsList[0].text.match(/(.*)(calcium|Calcium|Calcium Ca\+\+|calcium Ca\+\+) (:?|=?) ([0-9]+[,]?[0-9]*)(,?|\/?|;?)(.*)/)) {
          row.calciumPerServing = [{ text: row.ingredientsList[0].text.replace(/(.*)(calcium|Calcium|Calcium Ca\+\+|calcium Ca\+\+) (:?|=?) ([0-9]+[,]?[0-9]*)(,?|\/?|;?)(.*)/, '$4').replace(/([0-9]+[,]?[0-9]*),$/, '$1') }];
        }
      }
      if (!row.calciumPerServingUom && row.calciumPerServingUom1) {
        row.calciumPerServingUom = row.calciumPerServingUom1;
      }
      if (!row.sodiumPerServing && row.ingredientsList) {
        if (row.ingredientsList[0].text.match(/(.*)(sodium|Sodium|sodium Na\+|Sodium Na\+) (:?|=?) ([0-9]+[,]?[0-9]*)(,?|\/?|;?)(.*)/)) {
          row.sodiumPerServing = [{ text: row.ingredientsList[0].text.replace(/(.*)(sodium|Sodium|sodium Na\+|Sodium Na\+) (:?|=?) ([0-9]+[,]?[0-9]*)(,?|\/?|;?)(.*)/, '$4').replace(/([0-9]+[,]?[0-9]*),$/, '$1') }];
        }
      }
      if (!row.sodiumPerServingUom && row.sodiumPerServingUom1) {
        row.sodiumPerServingUom = row.sodiumPerServingUom1;
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
