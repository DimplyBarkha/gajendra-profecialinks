
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
      const mainData = JSON.parse(gr.sku[0].text);
      if (mainData) {
        if (mainData) gr.sku[0].text = mainData.sku;
        if (mainData.brand) gr.brandText[0].text = mainData.brand.name;
        if (mainData.brand) gr.brandLink[0].text = mainData.brand.url;
        if (mainData) gr.url[0].text = mainData.url;
        if (mainData) gr.gtin[0].text = mainData.gtin13;
        if (mainData) gr.variantId[0].text = mainData.sku;
        if (mainData) gr.product_description[0].text = mainData.name;
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
    });
  });
  return data;
};

module.exports = { transform };
