/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.variants) {
        const variantArray = row.variants.map((item) => {
          return item.text;
        });
        row.variants = [{ text: variantArray.join('|'), xpath: row.variants[0].xpath }];
      }
      if (row.additionalDescBulletInfo) {
        const additionalDescBulletInfoArr = row.additionalDescBulletInfo.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/\n/gm, ' || ') : '';
        });
        row.additionalDescBulletInfo = [{ text: additionalDescBulletInfoArr.join('|'), xpath: row.additionalDescBulletInfo[0].xpath }];
      }
      if (row.description) {
        const descriptionArr = row.description.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/\n/gm, ' ') : '';
        });
        row.description = [{ text: descriptionArr.join('|'), xpath: row.description[0].xpath }];
      }
      if (row.manufacturerDescription) {
        const manufacturerDescriptionArr = row.manufacturerDescription.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/\n/gm, ' ') : '';
        });
        row.manufacturerDescription = [{ text: manufacturerDescriptionArr.join('|'), xpath: row.manufacturerDescription[0].xpath }];
      }
      if (row.specifications) {
        const specificationsArr = row.specifications.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/\n/g, '|') : '|';
        });
        row.specifications = [{ text: specificationsArr.join('|'), xpath: row.specifications[0].xpath }];
      }
      // Price
      if (row.price && row.price[0]) {
        row.price[0].text = row.price[0].text.replace(/€/g, ',');
      }
      // List Price
      if (row.listPrice && row.listPrice[0]) {
        row.listPrice[0].text = row.listPrice[0].text.replace(/\./g, ',');
      }
      // Aggregate Rating
      if (row.aggregateRating && row.aggregateRating[0]) {
        row.aggregateRating[0].text = row.aggregateRating[0].text.replace(/\./g, ',');
      }
    }
  }

  return data;
};

module.exports = { transform };
