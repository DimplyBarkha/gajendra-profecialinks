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
        if (gr.category) {
          gr.category.shift();
          gr.category.forEach(e => {
            e.text = cleanText(e.text);
          });
        }
        if (gr.listPrice) gr.listPrice[0].text = gr.listPrice[0].text.replace('$', '').trim();
        if (gr.price) {
          try {
            const obj = gr.price.find(e => e.text.includes('ou'));
            const start = obj.text.indexOf('ou');
            const end = obj.text.indexOf('$');
            const price = obj.text.slice(start + 2, end).trim();
            gr.price = [{ text: price }];
          } catch (e) {
            const end = gr.price[0].text.indexOf(' ');
            gr.price = [{ text: gr.price[0].text.slice(0, end) }];
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
