/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  function onlyNumbersAndDot (string) {
    return string.replace(',', '.').replace(/[^\d\.]/g, '').replace(/\./, 'x').replace(/\./g, '').replace(/x/, '.');
    string = Math.round(parseFloat(string) * 100) / 100;
  }

  function cleanText (str) {
    return str.replace(/(\r\n|\n|\r)/gm, '').replace(/\s+/g, ' ').trim();
  }

  function findField (entryPoint, fieldName) {
    return JSON.parse(entryPoint.find(e => e.text.includes(fieldName)).text)[fieldName];
  }

  data.forEach(el => {
    el.group.forEach(gr => {
      try {
        if (gr.alternateImages) gr.alternateImages.shift();
        if (gr.category) gr.category.shift();
        if (gr.secondaryImageTotal) gr.secondaryImageTotal = [{ text: gr.secondaryImageTotal.length - 1 }];
        if (gr.brandText) {
          try {
            gr.brandText = [{ text: findField(gr.brandText, 'brand') }];
            if (!gr.brandText[0].text) gr.brandText = gr.brandText2;
          } catch (e) {
            el.group = [];
          }
        }
        if (gr.aggregateRating) {
          gr.aggregateRating = [{ text: onlyNumbersAndDot(gr.aggregateRating[0].text) }];
          gr.aggregateRating2 = gr.aggregateRating;
          gr.aggregateRating2[0].text = gr.aggregateRating2[0].text.replace('.', ',');
        }
        if (!gr.promotion) gr.promotion = [{ text: '%0 İndirim 0 TL Kazanç' }];
        if (gr.manufacturerDescription) gr.manufacturerDescription = [{ text: cleanText(gr.manufacturerDescription[0].text) }];
        if (gr.specifications) {
          gr.specifications = [{ text: gr.specifications.map(e => cleanText(e.text)).join(' | ') }];
        }
      } catch (e) {
        console.log(e);
      }
    });
  });
  return data;
};

module.exports = { transform };
