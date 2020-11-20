
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
        if (gr.retailer_product_code) gr.retailer_product_code[0].text = gr.retailer_product_code[0].text.replace(onlyNumbers, '');
        if (gr.listPrice) gr.listPrice[0].text = gr.listPrice[0].text.replace(onlyNumbers, '');
        if (gr.currency) gr.currency[0].text = gr.currency[0].text.replace(currency, '').charAt(1);
        if (gr.sub_category) {
          gr.sub_category.shift();
          gr.sub_category = [{ text: gr.sub_category.map(e => e.text).join(' > ') }];
        }
        if (gr.brand) {
          const mainData = JSON.parse(gr.brand[0].text);
          if (mainData) {
            if (mainData.brand) gr.brand[0].text = mainData.brand.name;
            gr.sku_number[0].text = mainData.sku;
          }
        }
      } catch (e) {
        console.log(e);
      }
    });
  });
  return data;
};

module.exports = { transform };
