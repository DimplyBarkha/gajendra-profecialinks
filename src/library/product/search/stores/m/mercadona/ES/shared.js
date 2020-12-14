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
        gr['_input'] = gr.input;
        gr['_url'] = gr.url;
      } catch (e) {
        console.log(e);
      }
    });
  });
  return data;
};
module.exports = { transform };
