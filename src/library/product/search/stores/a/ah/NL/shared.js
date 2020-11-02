/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const transformData = [];
  data.forEach(el => {
    const group = [];
    el.group.forEach(element => {
    // eslint-disable-next-line no-unused-expressions
      element.url[0].text = 'https://www.ah.nl' + element.url[0].text;
      element.price = [{ text: element.price.map(p => p.text).join('') + ' €' }];
      element.discount = [{ text: element.discount.map(d => d.text).join('') + ' €' }];
      group.push(element);
    });
    transformData.push(group);
  });
  return transformData;
};

module.exports = { transform };
