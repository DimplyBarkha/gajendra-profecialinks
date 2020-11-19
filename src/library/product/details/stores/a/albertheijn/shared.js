
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
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
    .trim();

  for (const { group } of data) {
    for (const row of group) {
      if (row.description) {
        const text = row.description.map(elm => elm.text.replace(/<li([^>]*)>/g, '<li> || ').replace(/(<([^>]+)>)/ig, '').trim());
        row.description = [{ text: text.join(' | ') }];
      }
      if (row.dietarySymbols) {
        const text = row.dietarySymbols.map(elm => elm.text.trim()).join(' | ');
        row.dietarySymbols = [{ text }];
        row.dietaryInformation = [{ text }];
      }
      if (row.ingredientsList) {
        const text = row.ingredientsList.map(elm => elm.text.trim()).join(' | ');
        row.ingredientsList = [{ text }];
      }
      if (row.pricePerUnit) {
        const values = row.pricePerUnit.map(elm => elm.text).filter(elm => elm.trim());
        if (values.length > 1) {
          const pricePerUnit = values.slice(2).join(' ');
          const pricePerUnitUom = values[1];
          row.pricePerUnit = [{ text: pricePerUnit.trim() }];
          row.pricePerUnitUom = [{ text: pricePerUnitUom.trim() }];
        } else {
          const pricePerUnit = values[0].replace('Prijs per', '').trim().match(/^[^\s]+/)[0];
          const pricePerUnitUom = values[0].replace('Prijs per', '').trim().match(/^[^\s]+(.+)/)[1];
          row.pricePerUnit = [{ text: pricePerUnit.trim() }];
          row.pricePerUnitUom = [{ text: pricePerUnitUom.trim() }];
        }
      }
      if (row.promotion) {
        const text = row.promotion.map(elm => elm.text.trim()).join(' | ');
        row.promotion = [{ text }];
      }
      if (row.availabilityText) {
        const text = row.availabilityText[0].text === 'Alleen in de winkel' ? 'In Store Only' : 'In Stock';
        row.availabilityText = [{ text }];
      } else {
        row.availabilityText = [{ text: 'Out of Stock' }];
      }
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  return data;
};

module.exports = { transform };
