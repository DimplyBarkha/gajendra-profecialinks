/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  data.forEach(el => {
    el.group.forEach((gr) => {
      try {
        if (gr) {
          if (gr.url && gr.url.length) {
            // gr['_url'] = gr.url;

            // gr['sku'] = [
            //   {
            //     text: gr.url[0].text.match(/\/product\/(.*?)\//)[1],
            //   },
            // ];
            // gr['_input'] = [
            //   {
            //     text: gr.url[0].text.match(/\/product\/(.*?)\//)[1],
            //   },
            // ];
          }
          if (gr.btnText[0].text === 'Añadir al carro') {
            gr['availabilityText'] = [{ text: 'In Stock' }];
          };

          if (gr.alternateImages.length) {
            gr.alternateImages.shift();
            gr['secondaryImageTotal'] = [{ text: gr.alternateImages.length }];
          };

          if (gr.unitPrice) {
            gr['pricePerUnit'] = [
              {
                text: gr.unitPrice[0].text.replace(/[^0-9,]/g, '').replace(',', '.'),
              },
            ];
            gr['pricePerUnitUom'] = [
              {
                text: gr.unitPrice[0].text.replace(/[^a-zA-Z]/g, ''),
              },
            ];
          }
        };
      } catch (e) {
        console.log(e);
      }
    });
  });
  return data;
};
module.exports = { transform };
