/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  data.forEach(el => {
    el.group.forEach((gr, index) => {
      try {
        gr['_input'] = gr.input;
        gr['_url'] = gr.url;
        gr['rankOrganic'] = [{ text: index + 1 }];
      } catch (e) {
        console.log(e);
      }
    });
  });
  return data;
};
module.exports = { transform };
