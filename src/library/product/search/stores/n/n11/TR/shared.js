
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  function onlyNumbersAndDot (string) {
    return string.replace(',', '.').replace(/[^\d\.]/g, '').replace(/\./, 'x').replace(/\./g, '').replace(/x/, ".");string = Math.round( parseFloat(string) * 100) / 100;
  }
  const searchTerms = [];
  const url = [];
  data.forEach(element => {
    searchTerms.push(element.group.find(e => e.input));
    url.push(element.group.find(e => e.url));
  });
  const filterSearch = searchTerms.filter(e => e)[0].input;
  const productUrl = url.filter(e => e)[0].url;
  data.forEach(el => {
    el.group.forEach(gr => {
      try {
        gr['_input'] = filterSearch;
        gr['_url'] = productUrl;
        if (gr && gr.aggregateRating) {
          switch (onlyNumbersAndDot(gr.aggregateRating[0].text)) {
            case '100':
              gr.aggregateRating[0].text = 5;
              break;
            case '90':
              gr.aggregateRating[0].text = 4.5;
              break;
            case '80':
              gr.aggregateRating[0].text = 4;
              break;
            case '70':
              gr.aggregateRating[0].text = 3.5;
              break;
            case '60':
              gr.aggregateRating[0].text = 3;
              break;
            case '50':
              gr.aggregateRating[0].text = 2.5;
              break;
            case '40':
              gr.aggregateRating[0].text = 2;
              break;
            case '30':
              gr.aggregateRating[0].text = 1.5;
              break;
            case '20':
              gr.aggregateRating[0].text = 1;
              break;
            case '10':
              gr.aggregateRating[0].text = 0.5;
              break;
          }
        }
      } catch (e) {
        console.log(e);
      }
    });
  });
  return data;
};
module.exports = { transform };