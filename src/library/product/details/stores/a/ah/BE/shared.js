/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const onlyText = /[a-zA-Z]+/g;
  const whiteSpace = /\s+/g;

  function onlyNumbersAndDot (string) {
    return string.replace(',', '.').replace(/[^\d\.]/g, '').replace(/\./, 'x').replace(/\./g, '').replace(/x/, '.');
    string = Math.round(parseFloat(string) * 100) / 100;
  }

  function uom (text) {
    if (text) {
      return text.match(onlyText).join().replace('Per', '').replace(',', '');
    } else {
      return [];
    }
  }

  function table (data, text, onlyNumb = false, onlySize = false) {
    let a;
    let findText;
    if (typeof text !== 'string') {
      text.forEach(el => {
        if (data.find(e => e.text.includes(el))) {
          a = data.find(e => e.text.includes(el));
          findText = el;
        }
      });
    } else {
      a = data.find(e => e.text.includes(text));
      findText = text;
    }
    if (!onlyNumb && !onlySize) {
      return [{ text: a.text.replace(findText, '').replace(whiteSpace, ' ').trim() }];
    } else if (onlyNumb) {
      return [{ text: a.text.replace(findText, '').replace(whiteSpace, ' ').replace(a.text.replace(findText, '').replace(whiteSpace, ' ').match(onlyText).join(), '').trim() }];
    } else if (onlySize) return [{ text: a.text.replace(findText, '').replace(whiteSpace, ' ').match(onlyText).join().trim() }];
  }

  data.forEach(el => {
    el.group.forEach(gr => {
      try {
        gr['_url'] = gr.url;
        if (gr.sizeText && gr.size) {
          const end = gr.size[0].text.indexOf(gr.sizeText[0].text);
          gr.size[0].text = gr.size[0].text.slice(0, end);
        }
        if (gr && gr.price && gr.price.length) gr.price[0].text = gr.price[0].text.replace('.', ',');
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
        if (gr && gr.servingSizeUom) gr.servingSizeUom[0].text = uom(gr.servingSizeUom[0].text);
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
          const text = [
            'Waarvan verzadigd',
            'waarvan verzadigd',
          ];
          gr.saturatedFatPerServingUom = table(gr.saturatedFatPerServingUom, text, false, true);
          gr.saturatedFatPerServing = table(gr.saturatedFatPerServing, text, true, false);
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
          gr.proteinPerServing = table(gr.proteinPerServing, 'Zout', true, false);
          gr.proteinPerServing = table(gr.proteinPerServing, 'Zout', false, true);
        } catch (e) {
          gr.proteinPerServing = [];
          gr.proteinPerServing = [];
        }
        try {
          const text = [
            'Waarvan suikers',
            'waarvan suikers',
          ];
          gr.dietaryFibrePerServing = table(gr.dietaryFibrePerServing, text, true, false);
          gr.dietaryFibrePerServingUom = table(gr.dietaryFibrePerServingUom, text, false, true);
        } catch (e) {
          gr.dietaryFibrePerServing = [];
          gr.dietaryFibrePerServingUom = [];
        }
        try {
          const text = [
            'Waarvan suikers',
            'waarvan suikers',
          ];
          gr.totalSugarsPerServing = table(gr.totalSugarsPerServing, text, true, false);
          gr.totalSugarsPerServingUom = table(gr.totalSugarsPerServingUom, text, false, true);
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
