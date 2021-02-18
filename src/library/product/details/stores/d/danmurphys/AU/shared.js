/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  function cleanText (str) {
    return str.replace(/(\r\n|\n|\r)/gm, '').replace(/\s+/g, ' ').trim();
  }

  data.forEach(el => {
    el.group.forEach(gr => {
      try {
        if (gr.alternateImages) gr.alternateImages.shift();
        if (gr.price) {
          const price = gr.price[0].text.replace('$', '');
          const end = price.indexOf(' ');
          gr.price = [{ text: price.slice(0, end) }];
        }
        if (gr.sku) {
          const start = gr.sku[0].text.indexOf('product/');
          gr.sku[0].text = gr.sku[0].text.slice(start, gr.sku[0].text.length).replace('product/', '');
        }
        if (gr.videos) gr.videos = gr.videos.filter(el => !el.text.includes('undefined'));
        if (gr.availabilityText && gr.availabilityText[0].text !== 'Out of stock') gr.availabilityText[0].text = 'In stock';
        if (gr.description) gr.description[0].text = cleanText(gr.description[0].text);
      } catch (e) {
        console.log(e);
      }
    });
  });
  return data;
};
module.exports = { transform };
