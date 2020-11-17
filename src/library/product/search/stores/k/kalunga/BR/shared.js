/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  function onlyNumbersAndDot (string) {
    return string.replace(',', '.').replace(/[^\d\.]/g, '').replace(/\./, 'x').replace(/\./g, '').replace(/x/, ".");string = Math.round( parseFloat(string) * 100) / 100;
  }
  data.forEach(el => {
    el.group.forEach(gr => {
      try {
        gr.productUrl[0].text = 'https://www.kalunga.com.br' + gr.productUrl[0].text;
        const a = '$ ' + onlyNumbersAndDot(gr.price[0].text);
        const s = a.slice(0, a.length - 2);
        const e = a.slice(a.length - 2, a.length);
        gr.price[0].text = (s + ',' + e).replace('.,', ',');
      } catch (e) {
        console.log(e);
      }
    });
  });
  return data;
};
module.exports = { transform };
