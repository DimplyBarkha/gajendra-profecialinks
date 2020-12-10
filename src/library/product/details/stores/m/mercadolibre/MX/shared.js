/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  data.forEach(el => {
    el.group.forEach((gr, index) => {
      try {
        gr['_url'] = gr.url;
        if (gr && gr.brandText) {
          const mainInfo = JSON.parse(gr.brandText[0].text);
          gr.brandText = [{ text: mainInfo.brand }];
          gr.sku = [{ text: mainInfo.sku }];
          gr.variantId = [{ text: mainInfo.productID }];
          gr.weightNet = [{ text: mainInfo.weight }];
          gr.ratingCount = [{ text: mainInfo.aggregateRating.reviewCount }];
          gr.aggregateRating = [{ text: mainInfo.aggregateRating.ratingValue }];
        }
        if (gr && gr.gtin) {
          const text = gr.gtin[0].text;
          const start = text.indexOf('SKU: ');
          if (start !== -1) {
            gr.gtin[0].text = text.substring(start + 5, text.length);
          } else {
            gr.gtin = [];
          }
        }
      } catch (e) {
        console.log(e);
      }
    });
  });
  return data;
};
module.exports = { transform };
