/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const searchTerms = [];
  const urlCustom = [];
  const hrefs = [];
  const onlyNumbers = /[^\d,]+/g;
  data.forEach(element => {
    searchTerms.push(element.group.find(e => e.input));
    urlCustom.push(element.group.find(e => e.url_custom));
    hrefs.push(element.group.find(e => e.rank));
  });
  const filterSearch = searchTerms.filter(e => e)[0].input;
  const url = urlCustom.filter(e => e)[0].url_custom;
  const hrefData = hrefs.filter(e => e)[0].rank;
  const ranks = [...new Set(hrefData[0].text.split(','))];
  data.forEach(el => {
    el.group.forEach(gr => {
      try {
        gr['rank'] = [{ text: ranks.indexOf(gr.productUrl[0].text) + 1 }];
        gr['rankOrganic'] = [{ text: ranks.indexOf(gr.productUrl[0].text) + 1}];
        gr['_input'] = filterSearch;
        gr['_url'] = url;
        gr.productUrl[0].text = 'https://www.kalunga.com.br' + gr.productUrl[0].text;
        try {
          const text = gr.id[0].text;
          gr.id[0].text = gr.id[0].text = text.substring(text.length - 6);
          // gr.gtin[0].text = gr.gtin[0].text = text.substring(text.length - 6);
        } catch (e) {
          console.log(e);
        }
        // if (gr.price) gr.price[0].text = gr.price[0].text.replace(onlyNumbers, '');
      } catch (e) {
        console.log(e);
      }
    });
  });
  return data;
};
module.exports = { transform };
