/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  data.forEach(el => {
    el.group.forEach(element => {
    // eslint-disable-next-line no-unused-expressions
      element.product_image.forEach(el => {
        el.text = el.text.replace('//', '');
      });
      element.productUrl.forEach(el => {
        el.text = 'https://www.mondoffice.com' + el.text;
      });
    });
  });
  return data;
};

module.exports = { transform };
