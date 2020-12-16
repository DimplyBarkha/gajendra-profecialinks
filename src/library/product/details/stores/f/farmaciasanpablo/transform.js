/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
    // Default transform function
    const clean = (text) =>
      text
        .toString()
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
    data.forEach((obj) =>
      obj.group.forEach((row) =>
        Object.keys(row).forEach((header) =>
          row[header].forEach((el) => {
            el.text = clean(el.text);
          }))));
  
    for (const { group } of data) {
      for (const row of group) {
        try {
          // if (row.ratingCount) {
          //   row.ratingCount = [{ text: row.ratingCount[0].text.split(' ')[2] }];
          // }
          if (row.availabilityText) {
            row.availabilityText = [
              { text: row.availabilityText[0].text === 'true' ? 'In Stock' : 'Out of Stock' },
            ];
          }
          if(row.price){
            console.log(row.price);
            let price_All=row.price;
            let price_Arr=row.price[0].text.split(' ');
            let price_Arr_Length=price_Arr.length;
            console.log(price_Arr);
            console.log(price_Arr_Length);
           
            if(price_Arr_Length>2){
              let ur_price=price_Arr[1]+' MXN';
            row.price=[{text:ur_price}];
            }
            else{
              let price_single=price_Arr[0]+ ' MXN';
             row.price=[{text:price_single}];
            }
          }
        } catch (exception) {
          console.log('Error in transform', exception);
        }
      }
    }
    return data;
  };
  
  module.exports = { transform };
  