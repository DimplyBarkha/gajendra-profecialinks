
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
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
    return data;
  };
  for (const { group } of data) {
    for (const row of group) {

      if (row.ratingCount) {
        row.ratingCount.forEach(item => {
          item.text = item.text.replace('(', '').trim();
          item.text = item.text.replace(')', '').trim();
          console.log('item.text',item.text);
        });
      }

      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          item.text = item.text.replace('product-rating-stars is--', '').trim();
          console.log('item.text',item.text);
        });
      }

      if (row.productUrl) {
        row.productUrl.forEach(item => {
          item.text = 'https://www.worldofsweets.de/' + item.text
        })
      }

      if (row.ingredientsList) {
        console.log("row.ingredientsList",row.ingredientsList);
        row.ingredientsList.forEach(item => {
          console.log(" item.text", item.text)
          item.text = item.text.replace('Zutaten', '').trim();
          console.log(" item.text", item.text)
        });
      }

      if (row.availabilityText) {
        row.availabilityText.forEach(item => {
          if (item.text == "true"){

            item.text = "In Stock";

          }
          else{
             item.text = "Out Of Stock";

          }

        })
      }
    }

}
  return cleanUp(data);
};

module.exports = { transform };
