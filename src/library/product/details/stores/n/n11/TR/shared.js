
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
        if (gr && gr.category.length) gr.category.shift();
        if (gr && gr.brandText.length) {
          const info = JSON.parse(gr.brandText.find(e => e.text.includes('brand')).text);
          if (info) gr.brandText = [{ text: info.brand }];
          if (info) gr.name = [{ text: info.description }];
        }
        if (gr && gr.aggregateRating.length) gr.aggregateRating[0].text = onlyNumbersAndDot(gr.aggregateRating[0].text);
        if (gr && gr.variantCount.length) gr.variantCount = [{ text: gr.variantCount.length }];
        if (gr && gr.secondaryImageTotal.length) gr.secondaryImageTotal = [{ text: gr.secondaryImageTotal.length - 1 }];
        try {
          if (gr && gr.specifications) {
            gr.specifications.forEach(el => {
              el.text = el.text.replace(/\s+/g, ' ').trim();
            });
          };
          if (gr && gr.aggregateRatingText) {
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
