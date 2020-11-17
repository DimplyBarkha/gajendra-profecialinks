
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
        const mainData = JSON.parse(gr.rpc[0].text);
        if (mainData) {
          if (mainData) gr.rpc[0].text = mainData.sku;
          if (mainData.brand) gr.brandText[0].text = mainData.brand.name;
          if (mainData.brand) gr.brandLink[0].text = mainData.brand.url;
          gr.url[0].text = mainData.url;
          gr.gtin[0].text = mainData.gtin13;
          gr.variantId[0].text = mainData.sku;
          gr.product_description[0].text = mainData.name;
          if (gr.total_fat_per_serving) gr.total_fat_per_serving[0].text = onlyNumbersAndDot(gr.total_fat_per_serving[0].text);
          if (gr.total_carb_per_serving) gr.total_carb_per_serving[0].text = onlyNumbersAndDot(gr.total_carb_per_serving[0].text);
          if (gr.total_fat_per_serving) gr.dietary_fibre_per_serving[0].text = onlyNumbersAndDot(gr.dietary_fibre_per_serving[0].text);
          if (gr.dietary_fibre_per_serving) gr.total_sugars_per_serving[0].text = onlyNumbersAndDot(gr.total_sugars_per_serving[0].text);
          if (gr.protein_per_serving) gr.protein_per_serving[0].text = onlyNumbersAndDot(gr.protein_per_serving[0].text);
          if (gr.salt_per_serving) gr.salt_per_serving[0].text = onlyNumbersAndDot(gr.salt_per_serving[0].text);
          if (gr.total_fat_per_serving_uom) gr.total_fat_per_serving_uom[0].text = gr.total_fat_per_serving_uom[0].text.match(/[a-zA-Z]+/g).join();
          if (gr.total_carb_per_serving_uom) gr.total_carb_per_serving_uom[0].text = gr.total_carb_per_serving_uom[0].text.match(/[a-zA-Z]+/g).join();
          if (gr.dietary_fibre_per_serving_uom) gr.dietary_fibre_per_serving_uom[0].text = gr.dietary_fibre_per_serving_uom[0].text.match(/[a-zA-Z]+/g).join();
          if (gr.total_sugars_per_serving_uom) gr.total_sugars_per_serving_uom[0].text = gr.total_sugars_per_serving_uom[0].text.match(/[a-zA-Z]+/g).join();
          if (gr.protein_per_serving_uom) gr.protein_per_serving_uom[0].text = gr.protein_per_serving_uom[0].text.match(/[a-zA-Z]+/g).join();
          if (gr.salt_per_serving_uom) gr.salt_per_serving_uom[0].text = gr.salt_per_serving_uom[0].text.match(/[a-zA-Z]+/g).join();
        };
        if (gr.sub_Category) gr.sub_Category = gr.sub_Category.splice(2, 10);
        if (gr.price_per_unit) gr.price_per_unit[0].text = '€ ' + onlyNumbersAndDot(gr.price_per_unit[0].text);
        if (gr.price_per_unit_uom) gr.price_per_unit_uom[0].text = gr.price_per_unit_uom[0].text.match(/(\b[A-Z][A-Z]+|\b[A-Z]\b)/g).join();
        if (gr.harvested_price) gr.harvested_price = [{ text: '€ ' + gr.harvested_price.map(e => e.text).join('') }];
        if (gr.online_price) gr.online_price = [{ text: gr.online_price.map(e => e.text).join('') }];
        if (gr.online_price_currency) gr.online_price_currency[0].text = gr.online_price_currency[0].text = '€';
        if (gr.size) {
          const indexSpace = gr.size[0].text.indexOf(' ');
          gr.size[0].text = gr.size[0].text.slice(0, indexSpace + 2);
          if (gr.net_weight) gr.net_weight[0].text = gr.net_weight[0].text.slice(0, indexSpace + 2);
        }
        if (gr.storage) gr.storage = [gr.storage.find(e => e.text.includes('Bewaren')).text.slice(8, 200)];
        if (gr.Country_of_origin) gr.Country_of_origin = [gr.Country_of_origin.find(e => e.text.includes('Land van oorsprong')).text];
      } catch (e) {
        console.log(e);
      }
    });
  });
  return data;
};

module.exports = { transform };
