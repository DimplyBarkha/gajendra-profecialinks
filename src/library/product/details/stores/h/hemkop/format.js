/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
    data
      .toString()
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
  };
  for (const { group } of data) {
    for (const row of group) {
      if (row.variants) {
        const variantArray = row.variants.map((item) => {
          return item.text;
        });
        row.variants = [{ text: variantArray.join('|'), xpath: row.variants[0].xpath }];
      }
      if (row.availabilityText) {
        const availabilityTextArr = row.availabilityText.map((item) => {
          return (typeof (item.text) === 'string') && (item.text.trim() === 'Slut online') ? 'Out of Stock' : 'In Stock';
        });
        row.availabilityText = [{ text: availabilityTextArr.join(), xpath: row.availabilityText[0].xpath }];
      }
      if (row.category) {
        console.log(row.category);
        const categoryArray = row.category.map((item) => {
          return item.text.trim();
        });
        const cat = categoryArray[0].split('/');
        cat.shift();
        row.category = cat.map((item) => {
          return { text: item, xpath: row.category[0].xpath };
        });
      }
      if (row.description) {
        const descriptionArr = row.description.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/\n \n \n/g, '').replace(/\n \n/g, '') : '';
        });
        row.description = [{ text: descriptionArr.join('|'), xpath: row.description[0].xpath }];
      }
      if (row.pricePerUnit) {
        const pricePerUnit = row.pricePerUnit[0].text.trim().split(' ')[0];
        row.pricePerUnit = [{ text: pricePerUnit, xpath: row.pricePerUnit[0].xpath }];
        row.pricePerUnitUom = [{ text: 'kr', xpath: row.pricePerUnit[0].xpath }];
      }
    }
  }

  return data;
};

module.exports = { transform };
