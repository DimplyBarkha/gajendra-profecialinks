/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  data.forEach(el => {
    el.group.forEach((gr, index) => {
      try {
        gr['rankOrganic'] = [{ text: index + 1 }];
        gr['rank'] = [{ text: index + 1 }];
        if (gr && gr.input && gr.input.length) gr['_input'] = gr.input;
        if (gr && gr.url && gr.url.length) gr['_url'] = gr.url;
      } catch (e) {
        console.log(e);
      }
    });
  });
  return data;
};
module.exports = { transform };
