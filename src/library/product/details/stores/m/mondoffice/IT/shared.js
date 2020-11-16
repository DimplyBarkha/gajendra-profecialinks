
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  data.forEach(e => {
    e.group.forEach(gr => {
      gr.online_price[0].text = gr.online_price[0].text.replace(/[^\d,]+/g, '');
      gr.rpc[0].text = gr.rpc[0].text.replace(/[^\d,]+/g, '');
      gr.retailer_product_code[0].text = gr.retailer_product_code[0].text.replace(/[^\d,]+/g, '');
      gr.online_price_currency[0].text = gr.online_price_currency[0].text.replace(/[\d\., ]/g, '').charAt(0);
      gr.products_per_page[0].text = gr.products_per_page[0].text = 0;
      gr.mpc = [gr.mpc.find(el => el.text.includes('MPN'))];
      gr.mpc[0].text = gr.mpc[0].text.substring(5, 20);
    });
  });
  return data;
};

module.exports = { transform };
