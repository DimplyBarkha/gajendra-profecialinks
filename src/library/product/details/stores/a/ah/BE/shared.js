
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  data.forEach(el => {
    el.group.forEach(gr => {
      const mainData = JSON.parse(gr.sku[0].text);
      if (mainData) {
        if (mainData) gr.sku[0].text = mainData.sku;
        if (mainData.brand) gr.brandText[0].text = mainData.brand.name;
        if (mainData.brand) gr.brandLink[0].text = mainData.brand.url;
        if (mainData) gr.gtin[0].text = mainData.gtin13;
        if (mainData) gr.variantId[0].text = mainData.sku;
      };
    });
  });
  return data;
};

module.exports = { transform };
