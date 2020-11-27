
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  data.forEach(e => {
    e.group.forEach(gr => {
      try {
        // if (gr.online_price) gr.online_price[0].text = gr.online_price[0].text.replace(/[^\d,]+/g, '');
        if (gr.sku) gr.sku[0].text = gr.sku[0].text.replace(/[^\d,]+/g, '');
        // const a = gr.retailer_product_code.find(e => e.text.includes('logEvent')).text;
        // if (gr.retailer_product_code && a) {
        //   const indexS = a.indexOf('ProductId=');
        //   const indexE = a.indexOf('&MfgId');
        //   gr.retailer_product_code = [{ text: a.slice(indexS, indexE) }];
        // }
        // if (gr.online_price_currency) gr.online_price_currency[0].text = gr.online_price_currency[0].text.replace(/[\d\., ]/g, '').charAt(0);
        // if (gr.products_per_page) gr.products_per_page[0].text = gr.products_per_page[0].text = 0;
        if (gr.mpc) {
          try {
            gr.mpc = [gr.mpc.find(el => el.text.includes('MPN'))];
            gr.mpc[0].text = gr.mpc[0].text.substring(5, 20);
          } catch (e) {
            gr.mpc = [];
          }
        }
        if (gr.packSize) {
          try {
            const b = gr.packSize.find(e => e.text.includes('Dimensione punta :')).text;
            const index = b.indexOf(':');
            const size = b.slice(index + 1, 100);
            gr.packSize = [{ text: size }];
          } catch (e) {
            gr.packSize = [];
          }
        }
        if (gr.color) {
          try {
            const b = gr.color.find(e => e.text.includes('Colore :')).text;
            const index = b.indexOf(':');
            const size = b.slice(index + 1, 100);
            gr.color = [{ text: size }];
          } catch (e) {
            gr.color = [];
          }
        }
        if (gr && gr.url) gr['_url'] = gr.url;
      } catch (e) {
        console.log(e);
      }
    });
  });
  return data;
};

module.exports = { transform };
