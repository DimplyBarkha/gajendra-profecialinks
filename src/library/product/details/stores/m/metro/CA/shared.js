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
        if (gr.category) {
          gr.category.shift();
          gr.category.forEach(e => {
            e.text = cleanText(e.text);
          });
        }
        if (gr.listPrice) gr.listPrice[0].text = gr.listPrice[0].text.replace('$', '').trim().replace(',', '.');
        if (gr.sku) gr['_input'] = [{ text: gr.sku[0].text }];
        if (gr.description) gr.description[0].text = cleanText(gr.description[0].text);
        if (gr.price) {
          try {
            const obj = gr.price.find(e => e.text.includes('ou'));
            const start = obj.text.indexOf('ou');
            const end = obj.text.indexOf('$');
            const price = obj.text.slice(start + 2, end).trim();
            gr.price = [{ text: price.replace(',', '.') }];
          } catch (e) {
            const end = gr.price[0].text.indexOf('$');
            gr.price = [{ text: end >= 0 ? gr.price[0].text.slice(0, end).replace(',', '.') : gr.price[0].text }];
          }
        }
        if (gr.nameExtended) {
          gr.nameExtended = [{ text: gr.nameExtended.map(e => e.text).join(' ') }];
        }
      } catch (e) {
        console.log(e);
      }
    });
  });
  return data;
};

module.exports = { transform };
