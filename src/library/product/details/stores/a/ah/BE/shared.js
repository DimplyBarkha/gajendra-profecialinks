
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const onlyText = /[a-zA-Z]+/g;
  const whiteSpace = /\s+/g;
  function onlyNumbersAndDot (string) {
    return string.replace(',', '.').replace(/[^\d\.]/g, '').replace(/\./, 'x').replace(/\./g, '').replace(/x/, ".");string = Math.round( parseFloat(string) * 100) / 100;
  }
  function uom (text) {
    return text.match(onlyText).join().replace('Per', '').replace(',', '');
  }
  function table (data, text, onlyNumb = false, onlySize = false) {
    const a = data.find(e => e.text.includes(text));
    if (!onlyNumb && !onlySize) return [{ text: a.text.replace(text, '').replace(whiteSpace, ' ').trim() }];
    else if (onlyNumb) return [{ text: a.text.replace(text, '').replace(whiteSpace, ' ').replace(a.text.replace(text, '').replace(whiteSpace, ' ').match(onlyText).join(), '').trim() }];
    else if (onlySize) return [{ text: a.text.replace(text, '').replace(whiteSpace, ' ').match(onlyText).join().trim() }];
  }
  data.forEach(el => {
    el.group.forEach(gr => {
      try {
        gr['_url'] = gr.url;
        if (gr && gr.category && gr.category.length) gr.category.shift();
        if (gr && gr.variantId && gr.variantId.length) {
          const mainData = JSON.parse(gr.variantId[0].text);
          gr.variantId[0].text = mainData.sku;
          gr['_input'] = [{ text: mainData.sku }];
          if (gr && gr.quantity.length) gr.quantity[0].text = mainData.weight;
        }
        if (gr && gr.direction && gr.direction.length) {
          const data = gr.direction.find(e => e.text.includes('Bewaren'));
          if (data) {
            gr.direction = [{ text: data.text.slice(8, 10000) }];
            gr.storage = [{ text: data.text.slice(8, 10000) }];
          } else {
            gr.direction = [];
            gr.storage = [];
          }
        }
        if (gr && gr.servingSize && gr.servingSize.length) {
          const size = onlyNumbersAndDot(gr.servingSize[0].text);
          gr.servingSize[0].text = 'Per ' + size;
        }
        try {
          gr.servingSizeUom[0].text = uom(gr.servingSizeUom[0].text);
        } catch (e) {
          gr.servingSizeUom[0].text = [];
        }
        try {
          gr.caloriesPerServing = table(gr.caloriesPerServing, 'Energie');
        } catch (e) {
          gr.caloriesPerServing = [];
        }
        try {
          gr.totalFatPerServing = table(gr.totalFatPerServing, 'Vet', true, false);
          gr.totalFatPerServingUom = table(gr.totalFatPerServingUom, 'Vet', false, true);
        } catch (e) {
          gr.totalFatPerServing = [];
          gr.totalFatPerServingUom = [];
        }
        try {
          gr.saturatedFatPerServingUom = table(gr.saturatedFatPerServingUom, 'Waarvan verzadigd', false, true);
          gr.saturatedFatPerServing = table(gr.saturatedFatPerServing, 'Waarvan verzadigd', true, false);
        } catch (e) {
          gr.saturatedFatPerServing = [];
          gr.saturatedFatPerServingUom = [];
        }
        try {
          gr.sodiumPerServing = table(gr.sodiumPerServing, 'Nitraten', true, false);
          gr.sodiumPerServingUom = table(gr.sodiumPerServingUom, 'Nitraten', false, true);
        } catch (e) {
          gr.sodiumPerServing = [];
          gr.sodiumPerServingUom = [];
        }
        try {
          gr.totalCarbPerServing = table(gr.totalCarbPerServing, 'Koolhydraten', true, false);
          gr.totalCarbPerServingUom = table(gr.totalCarbPerServingUom, 'Koolhydraten', false, true);
        } catch (e) {
          gr.totalCarbPerServing = [];
          gr.totalCarbPerServingUom = [];
        }
        try {
          gr.dietaryFibrePerServing = table(gr.dietaryFibrePerServing, 'Waarvan suikers', true, false);
          gr.dietaryFibrePerServingUom = table(gr.dietaryFibrePerServingUom, 'Waarvan suikers', false, true);
        } catch (e) {
          gr.dietaryFibrePerServing = [];
          gr.dietaryFibrePerServingUom = [];
        }
        try {
          gr.totalSugarsPerServing = table(gr.totalSugarsPerServing, 'Waarvan suikers', true, false);
          gr.totalSugarsPerServingUom = table(gr.totalSugarsPerServingUom, 'Waarvan suikers', false, true);
        } catch (e) {
          gr.totalSugarsPerServing = [];
          gr.totalSugarsPerServingUom = [];
        }
      } catch (e) {
        console.log(e);
      }
    });
  });
  return data;
};

module.exports = { transform };
