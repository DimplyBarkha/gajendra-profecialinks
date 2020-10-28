/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  const clean = text => text.toString().replace(/\r\n|\r|\n/gm, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[^\x00-\x7F]/g, '');

  for (const { group } of data) {
    for (const row of group) {
      if (row.availabilityText) {
        const availabilityTextArr = row.availabilityText.map((item) => {
          return (typeof (item.text) === 'string') && (item.text.includes('Ajouter au panier')) ? 'In Stock' : 'Out of Stock';
        });
        row.availabilityText = [{ text: availabilityTextArr.join(), xpath: row.availabilityText[0].xpath }];
      }
      if (row.description) {
        const descriptionArr = row.description.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/\n/gm, '').replace(/\//g, '') : '|';
        });
        row.description = [{ text: descriptionArr.join('|'), xpath: row.description[0].xpath }];
      }
      if (row.manufacturer) {
        const manufacturerArr = row.manufacturer.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/\n/g, ' ') : '|';
        });
        row.manufacturer = [{ text: manufacturerArr.join('|'), xpath: row.manufacturer[0].xpath }];
      }
      if (row.ingredientsList) {
        const ingredientsListArr = row.ingredientsList.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/\n/g, ' ') : '|';
        });
        row.ingredientsList = [{ text: ingredientsListArr.join('|'), xpath: row.ingredientsList[0].xpath }];
      }
      if (row.quantity) {
        const quantityArr = row.quantity.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/\n/g, '') : '|';
        });
        row.quantity = [{ text: quantityArr.join('|'), xpath: row.quantity[0].xpath }];
      }
      if (row.variants) {
        const variantsArr = row.variants.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/\n/g, '|') : '|';
        });
        row.variants = [{ text: variantsArr.join('|'), xpath: row.variants[0].xpath }];
      }
      if (row.nameExtended) {
        const nameExtendedArr = row.nameExtended.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/\n/g, ' ') : '|';
        });
        row.nameExtended = [{ text: nameExtendedArr.join('|'), xpath: row.nameExtended[0].xpath }];
      }
    }
  }
  data.forEach(obj =>
    obj.group.forEach(row =>
      Object.keys(row).forEach(header =>
        row[header].forEach(el => {
          el.text = clean(el.text);
        }),
      ),
    ),
  );
  return data;
};

module.exports = { transform };
