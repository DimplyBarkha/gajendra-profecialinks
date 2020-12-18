
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  function onlyNumbersAndDot (string) {
    return string.replace(',', '.').replace(/[^\d\.]/g, '').replace(/\./, 'x').replace(/\./g, '').replace(/x/, ".");string = Math.round( parseFloat(string) * 100) / 100;
  }
  data.forEach(el => {
    el.group.forEach(gr => {
      try {
        gr['_url'] = gr.url;
        gr['_input'] = gr.input;
        if (gr && gr.category && gr.category.length) gr.category.shift();
        if (gr && gr.brandText && gr.brandText.length) {
          let info;
          try {
            info = JSON.parse(gr.brandText.find(e => e.text.includes('brand')).text);
          } catch (e) {
            info = {};
          }
          if (info && info.brand && info.brand.length) gr.brandText = [{ text: info.brand }];
          else gr.brandText = [];
          if (info && info.description && info.description.length) gr.name = [{ text: info.description }];
          else gr.name = [];
        }
        if (gr && gr.aggregateRating && gr.aggregateRating.length) gr.aggregateRating[0].text = onlyNumbersAndDot(gr.aggregateRating[0].text);
        if (gr && gr.variantCount && gr.variantCount.length) gr.variantCount = [{ text: gr.variantCount.length }];
        if (gr && gr.secondaryImageTotal && gr.secondaryImageTotal.length) gr.secondaryImageTotal = [{ text: gr.secondaryImageTotal.length - 1 }];
        try {
          if (gr && gr.specifications && gr.specifications.length) {
            gr.specifications.forEach(el => {
              el.text = el.text.replace(/\s+/g, ' ').trim();
            });
          };
          if (gr && gr.aggregateRatingText && gr.aggregateRatingText.length) {
            const numbers = gr.aggregateRatingText.map(e => +onlyNumbersAndDot(e.text));
            gr.aggregateRatingText = [{ text: numbers.reduce((a, b) => a + b, 0) }];
          }
        } catch (e) {
          gr.specifications = [];
          gr.aggregateRatingText = [];
        }
      } catch (e) {
        console.log(e);
      }
    });
  });
  return data;
};

module.exports = { transform };
