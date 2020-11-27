
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
        gr.category.shift();
        if (gr && gr.brandText) {
          const info = JSON.parse(gr.brandText.find(e => e.text.includes('brand')).text);
          if (info) gr.brandText = [{ text: info.brand }];
          if (info) gr.name = [{ text: info.description }];
        }
        if (gr && gr.aggregateRating) gr.aggregateRating[0].text = onlyNumbersAndDot(gr.aggregateRating[0].text);

      } catch (e) {
        console.log(e);
      }
    });
  });
  return data;
};

module.exports = { transform };
