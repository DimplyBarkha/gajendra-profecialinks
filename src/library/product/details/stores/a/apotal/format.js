/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    // var rank = 1;
    for (const row of group) {
      if (row.image) {
        const image = row.image.map((item) => {
          return 'https://shop.apotal.de' + item.text;
        });
        console.log('image ----> ', image);
        row.image = [{ text: image, xpath: row.image[0].xpath }];
      }
      if (row.availabilityText) {
        const availabilityTextArr = row.availabilityText.map((item) => {
          return (typeof (item.text) === 'string') && (item.text.trim() === 'sofort lieferbar') ? 'In Stock' : 'Out of Stock';
        });
        row.availabilityText = [{ text: availabilityTextArr.join(), xpath: row.availabilityText[0].xpath }];
      }
      if (row.description) {
        const descriptionArr = row.description.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/\n \n \n \n/g, '').replace(/\n \n \n \n \n/g, '') : '';
        });
        row.description = [{ text: descriptionArr.join('|'), xpath: row.description[0].xpath }];
      }
      if (row.ratingCount) {
        const ratingCount = row.ratingCount[0].text.replace('(', '').replace(')', '');
        // const ratingCount = row.ratingCount.map((item) => {
        //   return typeof (item.text) === 'string' ? item.text.replace('(', '').replace(')', '') : '';
        // });
        row.ratingCount = [{ text: Math.floor(ratingCount), xpath: row.ratingCount[0].xpath }];
      }
      if (row.category) {
        console.log(row.category);
        // const categoryArray = row.category.map((item) => {
        //   return item.text.trim();
        // });
        const cat = row.category[0].text.split('\n');
        console.log('cat -> ', cat);
        cat.shift();
        row.category = cat.map((item) => {
          return { text: item, xpath: row.category[0].xpath };
        });
      }
      // const updatedRank = rank++;
      // row.rankOrganic = [{ text: updatedRank }];
      // row.rank = [{ text: updatedRank }];
    }
  }

  const clean = text =>
    text
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
