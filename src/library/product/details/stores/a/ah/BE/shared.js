
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const onlyText = /[a-zA-Z]+/g;
  const whiteSpace = /\s+/g;
  function cleanText (str) {
    return str.replace(/(\r\n|\n|\r)/gm, '').replace(/\s+/g, ' ').trim();
  }
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
        try {
          gr['descriptionBullets'] = [{ text: (gr.description2 && gr.description2.length) ? gr.description2.length + gr.description.length : gr.description.length }];
        } catch (e) {
          gr['descriptionBullets'] = [{ text: gr.description2.length }];
        }
        if (gr && gr.category && gr.category.length) gr.category.shift();
        if (gr && gr.promotion && gr.promotion.length) gr.promotion[0].text = cleanText(gr.promotion[0].text);
        if (gr && (gr.description1 && gr.description1.length) && (gr.description && gr.description.length)) gr.description = gr.description.concat(gr.description1.map(e => e));
        if (gr && (gr.description2 && gr.description2.length) && (gr.description && gr.description.length)) gr.description = gr.description.concat(gr.description2.map(e => e));
        if (gr && gr.variantId && gr.variantId.length) {
          const mainData = JSON.parse(gr.variantId[0].text);
          gr.variantId[0].text = mainData.sku;
          gr['quantity'] = [{ text: mainData.weight }];
          gr['brandText'] = [{ text: mainData.brand.name }];
          gr['gtin'] = [{ text: mainData.gtin13 }];
        }
        if (gr && gr.storage && gr.storage.length) {
          const data = gr.storage.find(e => e.text.includes('Bewaren'));
          if (data) {
            gr.direction = [{ text: data.text.slice(8, 10000) }];
            gr.storage = [{ text: data.text.slice(8, 10000) }];
          } else {
            gr.direction = [];
            gr.storage = [];
          }
        }
        if (gr.price && gr.price.length) {
          gr.price = [{ text: gr.price.map(e => e.text).join('') + ' €' }];
        }
        if (gr.size && gr.size.length) {
          if (gr && gr.sizePrice && gr.sizePrice.length) {
            const end = gr.size[0].text.indexOf(gr.sizePrice[0].text);
            gr.size = [{ text: gr.size[0].text.slice(0, end) }];
            gr.nameExtended[0].text = gr.nameExtended[0].text + ' ' + gr.size[0].text;
          } else {
            const text = gr.sizeContent[0].text;
            const end = text.indexOf(' ');
            const cutStr = text.slice(0, end);
            const res = gr.size[0].text.indexOf(cutStr);
            gr.size = [{ text: cleanText(gr.size[0].text.slice(0, res)) }];
          }
        }
        if (gr && gr.servingSize && gr.servingSize.length) {
          const size = onlyNumbersAndDot(gr.servingSize[0].text);
          gr.servingSize[0].text = 'Per ' + size;
          gr.servingSize[0].text = gr.servingSize[0].text.replace('.', '');
        }
        try {
          gr.servingSizeUom[0].text = uom(gr.servingSizeUom[0].text);
        } catch (e) {
          gr.servingSizeUom = [];
        }
        try {
          gr.caloriesPerServing = table(gr.caloriesPerServing, 'Waarvan verzadigd');
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
