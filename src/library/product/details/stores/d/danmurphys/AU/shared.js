/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  data.forEach(el => {
    el.group.forEach(gr => {
      try {
        if (gr.alternateImages) gr.alternateImages.shift();
      } catch (e) {
        console.log(e);
      }
    });
  });
  return data;
};
module.exports = { transform };
