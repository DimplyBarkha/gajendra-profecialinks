/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const onlyNumbers = /[^\d,]+/g;

  data.forEach(el => {
    el.group.forEach((gr, index) => {
      try {
        gr['rank'] = [{ text: index + 1 }];
        gr['rankOrganic'] = [{ text: index + 1 }];
        if (gr && gr.price && gr.price.length) gr.price[0].text = gr.price[0].text.replace(onlyNumbers, '');
        if (gr && gr.reviewCount && gr.reviewCount.length) {
          gr.reviewCount[0].text = gr.reviewCount[0].text.replace(onlyNumbers, '');
          gr['aggregateRating'] = gr.reviewCount;
        }
        if (gr && gr.productUrl && gr.productUrl.length) gr.productUrl = [{ text: 'https://www.kalunga.com.br' + gr.productUrl[0].text }];
        if (gr && gr.id && gr.id.length) {
          const text = gr.id[0].text;
          gr.id[0].text = gr.id[0].text = text.substring(text.length - 6);
          gr['gtin'] = gr.id;
        }
      } catch (e) {
        console.log(e);
      }
    });
  });
  return data;
};
module.exports = { transform };