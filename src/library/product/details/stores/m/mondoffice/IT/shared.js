
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  data.forEach(e => {
    e.group.forEach(gr => {
      gr.image.forEach(im => {
        im.text = im.text.replace('//', '');
      });
      gr.alternateImages.forEach(am => {
        am.text = am.text.replace('//', '');
      });
    });
  });
  return data;
};

module.exports = { transform };
