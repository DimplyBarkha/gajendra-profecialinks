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
          if (gr.btnText[0].text === 'Añadir al carro') {
            gr['availabilityText'] = [{ text: 'In Stock' }];
          };

          if (gr.alternateImages.length) {
            gr.alternateImages.shift();
            gr['secondaryImageTotal'] = [{ text: gr.alternateImages.length }];
          };

          if (gr.unitPrice) {
            const unitPriceFormat = gr.unitPrice[0].text.includes('/100')
              ? `€${gr.unitPrice[0].text.replace(/[^0-9,/]/g, '')}`.replace(',', '.')
              : `€${gr.unitPrice[0].text.replace(/[^0-9,]/g, '').replace(',', '.')}`;
            gr['pricePerUnit'] = [
              {
                text: unitPriceFormat,
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
