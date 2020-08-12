/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
  // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');

  for (const { group } of data) {
    for (const row of group) {
      try {
        if (row.category && row.category[0] && row.category[0].text) {
          let jsonObj = row.category[0].text;
          jsonObj = jsonObj.replace(/\n \n/g, '').trim();
          jsonObj = jsonObj.replace('window.dataLayer = window.dataLayer || [];', '').replace('dataLayer.push(', '');
          jsonObj = jsonObj.split('function Tracking(){}')[0].slice(0, -2);
          const jsonDetails = JSON.parse(jsonObj);
          const detailObj = jsonDetails.ecommerce.detail.products[0];
          const category = detailObj.category;
          row.category = [{ text: category }];

        //   row.asin = [{ text: row.asin[0].text.replace('Walmart', '').replace('#', '').trim() }];
        }

        Object.keys(row).forEach(header => row[header].forEach(el => {
          el.text = clean(el.text);
        }));
      } catch (exception) { console.log('Error in transform', exception); }
    }
  }
  return data;
};

module.exports = { transform };
