/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  // Default transform function
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

  for (const { group } of data) {
    for (const row of group) {
      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text += item.text.replace(/\s{2,}/g, ' ').replace(/\n/g, ' ').trim();
        });
        row.specifications = [
          {
            text: text,
          },
        ];
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += item.text.replace(/\s{2,}/g, ' ').replace(/\n/g, ' ').trim();
        });
        row.description = [
          {
            text: text,
          },
        ];
      }
      if (row.price) {
        let text = '';
        row.price.forEach(item => {
          text += `${item.text.replace(',', '.')} `;
        });
        row.price = [
          {
            text: text.slice(0, -1),
          },
        ];
      }
      if (row.aggregateRating) {
        let text = '';
        row.aggregateRating.forEach(item => {
          text += `${item.text.replace(',', '.')} `;
        });
        row.aggregateRating = [
          {
            text: text.slice(0, -1),
          },
        ];
      }
      if (row.availabilityText) {
        row.availabilityText.forEach(item => {
          item.text = item.text.replace('in stock', 'In Stock').replace('out of stock', 'Out Of Stock');
        });
      }
      if (row.listPrice) {
        let text = '';
        row.listPrice.forEach(item => {
          text += `${item.text.replace(',', '.')} `;
        });
        row.listPrice = [
          {
            text: text.slice(0, -1),
          },
        ];
      }
      if (row.additionalDescBulletInfo) {
        const variantArray = row.additionalDescBulletInfo.map((item) => {
          return item.text;
        });
        row.additionalDescBulletInfo = [{ text: variantArray.join('||'), xpath: row.additionalDescBulletInfo[0].xpath }];
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += item.text.replace(/\n\n/g, '||').replace(/\n/g, '||').trim();
        });
        row.description = [
          {
            text: text,
          },
        ];
      }
      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.additionalDescBulletInfo = [
          {
            text: text.slice(0, -3),
          },
        ];
      }
      if (row.additionalDescBulletInfo) {
        const variantArray = row.additionalDescBulletInfo.map((item) => {
          return item.text;
        });
        row.additionalDescBulletInfo = [{ text: variantArray.join('||'), xpath: row.additionalDescBulletInfo[0].xpath }];
      }
      if ((!row.quantity || !row.quantity.length) && row.quantity1) {
        console.log('quantity1', row.quantity2);
        row.quantity = row.quantity2;
        console.log('quantity', row.quantity);
      }
      if ((!row.quantity || !row.quantity.length) && row.quantity2) {
        console.log('quantity2', row.quantity2);
        row.quantity = row.quantity2;
        console.log('quantity', row.quantity);
      }
      if (row.quantity1) {
        let text = '';
        row.quantity1.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} `;
        });
        row.quantity1 = [
          {
            text: text.slice(0, -1),
          },
        ];
      }
      if (row.quantity2) {
        let text = '';
        row.quantity2.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} `;
        });
        row.quantity2 = [
          {
            text: text.slice(0, -1),
          },
        ];
      }
    }
  }
  return data;
};

module.exports = { transform };