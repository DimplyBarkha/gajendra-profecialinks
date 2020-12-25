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
          try {
            gr.ratingCount = [{ text: mainInfo.aggregateRating.reviewCount }];
          } catch (e) {
            gr.ratingCount = [];
          }
          try {
            gr.aggregateRating = [{ text: mainInfo.aggregateRating.ratingValue }];
          } catch (e) {
            gr.aggregateRating = [];
          }
        }
        if (gr && gr.gtin) {
          const text = gr.gtin[0].text;
          const start = text.indexOf('SKU: ');
          if (start !== -1) {
            const t = text.substring(start + 5, text.length);
            try {
              const a = t.indexOf('\n');
              gr.gtin[0].text = t.substring(0, a);
            } catch (e) {
              gr.gtin[0].text = t;
            }
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
