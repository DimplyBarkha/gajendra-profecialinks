/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
    let dataStr = JSON.stringify(data);
    dataStr = dataStr.replace(/(?:\\r\\n|\\r|\\n)/g, ' ')
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

    return JSON.parse(dataStr);
  };
  for (const { group } of data) {
    for (const row of group) {
      if (row.ingredientsList) {
        let text = '';
        row.ingredientsList.forEach(item => {
          text += ` ${item.text.trim()}`;
        });
        row.ingredientsList = [
          {
            text: text.trim(),
          },
        ];
      }
      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text += item.text.trim();
        });
        row.manufacturerDescription = [
          {
            text: cleanUp(text.trim()),
          },
        ];
      }
      if (row.sku) {
        const item = row.sku[0];
        row.sku = [
          {
            text: parseInt(item.text, 10).toString(),
          },
        ];
      }
      if (row.variantId) {
        const item = row.variantId[0];
        row.variantId = [
          {
            text: parseInt(item.text, 10).toString(),
          },
        ];
      }
      if (row.price) {
        row.price.forEach(price => {
          price.text = price.text.replace('.', '').replace(',', '.').trim();
        });
      }
      if (row.listPrice) {
        row.listPrice.forEach(listPrice => {
          listPrice.text = listPrice.text.replace('.', '').replace(',', '.').trim();
        });
      }
    }
  }
  return data;
};
module.exports = { transform };
