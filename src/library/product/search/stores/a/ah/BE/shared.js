/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  data.forEach(el => {
    el.group.forEach((gr, index) => {
      gr['rankOrganic'] = [{ text: index + 1 }];
      if (gr && gr.productUrl && gr.productUrl.length) {
        gr.productUrl[0].text = 'https://www.ah.be' + gr.productUrl[0].text;
        gr['id'] = [{ text: 'wi' + gr.productUrl[0].text.match(/\d+/g).join() }];
      }
    });
  });
  return data;
};

module.exports = { transform };
