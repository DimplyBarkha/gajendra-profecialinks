
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
        if (gr.variantId) gr.variantId[0].text = gr.variantId[0].text.replace(onlyNumbers, '');
        if (gr.online_price_currency) gr.online_price_currency[0].text = gr.online_price_currency[0].text.replace(currency, '').charAt(1);
        if (gr.additional_desc_bullet_count) gr.additional_desc_bullet_count = [{ text: gr.additional_desc_bullet_count.length }];
        if (gr.customer_review_rating) gr.customer_review_rating[0].text = gr.customer_review_rating[0].text.replace(onlyNumbers, '');
        if (gr.retailer_product_code) gr.retailer_product_code[0].text = gr.retailer_product_code[0].text.replace(onlyNumbers, '');
        if (gr.currency) gr.currency[0].text = gr.currency[0].text.replace(currency, '').charAt(1);
        if (gr.category) gr.category.shift();
        if (gr.additional_description) {
          gr.additional_description = [{ text: gr.additional_description.map(e => e.text).join(' || ') }];
        }
        if (gr.packaging) {
          const index = gr.packaging.findIndex(e => e.text.includes('Embalagem'));
          if (index) {
            gr.packaging = [gr.packaging[index + 1]];
          }
        }
        if (gr.warranty) {
          const index = gr.warranty.findIndex(e => e.text.includes('Garantia'));
          if (index) {
            gr.warranty = [gr.warranty[index + 1]];
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
