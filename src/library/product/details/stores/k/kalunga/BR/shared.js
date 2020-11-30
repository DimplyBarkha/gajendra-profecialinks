
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
        if (gr.description) {
          gr.description.forEach(el => {
            el.text = el.text.replace(/\s+/g, ' ').trim();
          });
        };
        if (gr.listPrice) gr.listPrice[0].text = gr.listPrice[0].text.replace(onlyNumbers, '');
        if (gr.variantId) gr.variantId[0].text = gr.variantId[0].text.replace(onlyNumbers, '');
        if (gr.additional_desc_bullet_count) gr.additional_desc_bullet_count = [{ text: gr.additional_desc_bullet_count.length }];
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
        if (gr.url) gr['_url'] = gr.url;
        if (gr.secondaryImageTotal) gr.secondaryImageTotal = [{ text: gr.secondaryImageTotal.length }];
      } catch (e) {
        console.log(e);
      }
    });
  });
  return data;
};

module.exports = { transform };
