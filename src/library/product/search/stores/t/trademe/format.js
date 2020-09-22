/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      let rank = 1;
      for (const row of group) {
        if (row.productUrl) {
          row.productUrl.forEach(item => {
            item.text = "https://www.trademe.co.nz" + item.text;
            item.text = item.text.toString();
          });
        }
        if (row.thumbnail) {
          row.thumbnail.forEach(item => {
            item.text = item.text.match(/\(([^)]+)\)/)[1].slice(1,-1);
            item.text = item.text.toString();
          });
        }
        if (row.brandText) {
          row.brandText.forEach(item => {
            let itemmatch = item.text.match(/Dyson/);
            if (itemmatch) {
              item.text = 'Dyson';
            } else {
              delete row.brandText;
            }
          });
        }
        if (row.variantId) {
          row.variantId.forEach(item => {
              item.text = item.text.replace(/\?.*$/g, '').trim();
              item.text = item.text.replace(/\D/g, ' ').trim();
              item.text = item.text.replace(/\s/g, '').trim();
              item.text = item.text.toString();
            });
        }
        if (row.price) {
          row.price.forEach(item => {
              item.text = item.text;
          });
        }
        else {
          row.price = row.listprice ;
        }
       if (row.id) {
        row.id.forEach(item => {
            item.text = item.text.replace(/\?.*$/g, '').trim();
            item.text = item.text.replace(/\D/g, '').trim();
            item.text = item.text.replace(/\s/g, '').trim();
            item.text = item.text.toString();
          });
      }
      row.rank = row.rankOrganic = [{"text":rank}];
      rank++;      
    } 
  }
  return data;
};
module.exports = { transform };