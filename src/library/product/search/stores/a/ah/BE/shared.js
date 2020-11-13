/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  data.forEach(el => {
    el.group.forEach(element => {
      element.url[0].text = 'https://www.ah.be' + element.url[0].text;
      element.price = [{ text: element.price.map(p => p.text).join('') + ' €' }];
      element.discount = [{ text: element.discount.map(d => d.text).join('') + ' €' }];
    });
  });
  return data;
};

module.exports = { transform };
