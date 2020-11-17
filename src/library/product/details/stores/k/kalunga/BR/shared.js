
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const onlyNumbers = /[^\d,]+/g;
  const currency = /[\d\., ]/g;
  data.forEach(el => {
    el.group.forEach(gr => {
      try {
        if (gr.rpc) gr.rpc[0].text = gr.rpc[0].text.replace(onlyNumbers, '');
        if (gr.price) gr.price[0].text = gr.price[0].text.replace(onlyNumbers, '');
        if (gr.uniqCode) gr.uniqCode[0].text = gr.uniqCode[0].text.replace(onlyNumbers, '');
        if (gr.listPrice) gr.listPrice[0].text = gr.listPrice[0].text.replace(onlyNumbers, '');
        if (gr.currency) gr.currency[0].text = gr.currency[0].text.replace(currency, '').charAt(1);
      } catch (e) {
        console.log(e);
      }
    });
  });
  return data;
};

module.exports = { transform };
