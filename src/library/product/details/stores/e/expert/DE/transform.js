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
        if (row.gtin && row.gtin[0] && row.gtin[0].text) {
          let jsonObj = row.gtin[0].text;
          console.log(jsonObj)
          jsonObj = jsonObj.replace('window.emos3.send(', '').slice(0, -2).replace(/\'/gm, '"').trim();
          console.log(jsonObj)
          const jsonDetails = JSON.parse(jsonObj);
          const gtin = jsonDetails.ec_Event ? (jsonDetails.ec_Event[0] ? jsonDetails.ec_Event[0].pid : '') : '';
          row.gtin[0].text = gtin;
          row.upc[0].text = gtin;
        }
        if (row.category && row.category[0] && row.category[0].text) {
          // let jsonObj = row.category[0].text;
          // jsonObj = jsonObj.replace(/\n/gm, '').replace(/\n \n/g, '').trim();
          // jsonObj = jsonObj.replace('window.dataLayer = window.dataLayer || [];', '').replace('dataLayer.push(', '');

          // console.log('jsonObj');
          // console.log(jsonObj);
          // jsonObj = jsonObj.split('(function')[0];
          // jsonObj = jsonObj.split('function Tracking(){}')[0];
          // jsonObj = jsonObj.slice(0, -2);
          // console.log('JSON');
          // console.log(jsonObj);
          // const jsonDetails = JSON.parse(jsonObj);
          // const detailObj = jsonDetails.ecommerce.detail.products[0];
          // const category = detailObj.category;
          // row.category = [{ text: category }];

        //   row.asin = [{ text: row.asin[0].text.replace('Walmart', '').replace('#', '').trim() }];
        }

        if (row.specifications) {
          const text = [];
          row.specifications.forEach(item => {
            if (item.text.length > 0) { text.push(item.text); }
          });
          if (text.length > 0) {
            row.specifications = [
              {
                text: text.join(' || ').trim(),
              },
            ];
          }
        }

        if (row.packaging) {
          const text = [];
          row.packaging.forEach(item => {
            if (item.text.length > 0) { text.push(item.text); }
          });
          if (text.length > 0) {
            row.packaging = [
              {
                text: text.join(' || ').trim(),
              },
            ];
          }
        }

        if (row.shippingInfo) {
          const text = [];
          row.shippingInfo.forEach(item => {
            if (item.text.length > 0) { text.push(item.text); }
          });
          if (text.length > 0) {
            row.shippingInfo = [
              {
                text: text.join(' || ').trim(),
              },
            ];
          }
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
