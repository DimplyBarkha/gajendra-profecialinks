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
    .replace(/[^\x00-\x7F]/g, '');

  for (const { group } of data) {
    for (const row of group) {
      try {
        if (row.asin) {
          row.asin = [{ text: row.asin[0].text.replace(/.+\/dp\//g, '').trim() }];
        }
        if (row.warnings) {
          row.warnings = [{ text: row.warnings[0].text.replace(/Safety Information/g, '').trim() }];
        }
        if (row.shippingWeight) {
          row.shippingWeight = [{ text: row.shippingWeight[0].text.replace(/\s\(/g, '').trim() }];
        }
        if (row.grossWeight) {
          row.grossWeight = [{ text: row.grossgWeight[0].text.replace(/\s\(/g, '').trim() }];
        }
        if (row.manufacturerDescription) {
          row.manufacturerDescription = [{ text: row.manufacturerDescription[0].text.replace(/Read more/g, '').replace(/View larger/g, '').replace(/\n/g, '').trim() }];
        }
        if (row.specifications) {
          let text = '';
          row.specifications.forEach(item => {
            text += `${item.text.replace(/\n \n/g, ':')} || `;
          });
          row.specifications = [
            {
              text: text.slice(0, -4),
            },
          ];
        }
        //nedds  work
        if (row.otherSellersPrime) {
          row.otherSellersPrime.forEach(item => {
            if(item.text.includes("rime")){
              item.text = 'YES';
            }else{
              item.text = 'NO';
            }
          });
        }
        //needs work
        if (row.otherSellersShipping) {
          row.otherSellersShipping.forEach(item => {
            if(item.text.includes('ree') || item.text.includes('REE')){
              item.text = '$0.00';
            }else{
              item.text = '$1.00';
            }
          });
        }
        //needs work
        if (row.largeImageCount) {
          let regex = /SL1500\_\.jpg/g;
          row.largeImageCount = [
            {
              text: (row.largeImageCount[0].text.match(regex) || []).length
            }
          ]
        }
        if (row.featureBullets) {
          let text = '';
          row.featureBullets.forEach(item => {
            text += `${item.text} | `;
          });
          row.featureBullets = [
            {
              text: text.slice(0, -2),
            },
          ];
        }
        if (row.primeFlag) {
          let text = false;
          row.featureBullets.forEach(item => {
            if(item === "Yes"){
              text = true
            }
          });
          if(!!text){
            row.primeFlag =[{text: 'Yes'}]
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
