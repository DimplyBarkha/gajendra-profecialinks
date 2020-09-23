/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.shippingDimensions) {
        row.shippingDimensions.forEach(item => {
          const locText = item.text;
          if (locText.indexOf('###') > 0) {
            item.text = locText.substring(0, locText.indexOf('###'));
          } else if (locText.indexOf('###') === 0) {
            item.text = locText.replace('###', '');
          }
          console.log(item.text);
        });
      }
      if (row.specifications) {
        const nDesc = [];
        let newDesc = '';
        let idx = 0;
        row.specifications.forEach(item => {
          nDesc[0] = item;
          if (idx > 0) {
            newDesc = newDesc + ' || ';
          }
          newDesc = newDesc + item.text;
          idx++;
        });
        console.log(newDesc);
        nDesc.forEach(item => {
          item.text = newDesc;
        });
        row.specifications = nDesc;
      }
      if ((!row.listPrice || !row.listPrice.length) && row.price) {
        row.listPrice = row.price;
      }
      if (row.price && row.price[0]) {
        row.price[0].text = row.price[0].text.replace(/\s/, ',');
      }
      if (row.listPrice && row.listPrice[0]) {
        row.listPrice[0].text = row.listPrice[0].text.replace(/\s/, ',');
      }
      if (row.aggregateRating) {
        row.aggregateRating = [
          {
            text: row.aggregateRating[0].text.replace(/./, ','),
          },
        ];
      }
      if (row.description) {
        const nDesc = [];
        let newDesc = '';
        let idx = 0;
        row.description.forEach(item => {
          nDesc[0] = item;
          if (idx > 0) {
            newDesc = newDesc + '||';
          }
          newDesc = newDesc + item.text;
          idx++;
        });
        console.log(newDesc);
        nDesc.forEach(item => {
          item.text = newDesc;
        });
        row.description = nDesc;
      }
    }
  }
  return data;
};
module.exports = { transform };
