
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
        if(row.image){
          row.image.forEach(item => {
            item.text='https://www.mediaexpert.pl'+item.text;
          });
        }

        if(row.alternateImages){
          row.alternateImages.forEach(item => {
            item.text='https://www.mediaexpert.pl'+item.text;
          });
        }

        if (row.manufacture) {
          row.manufacture.forEach(item => {
            var myRegexp = /producenta\/importera\s+\n(.+?)\s*\n/g;
            var match = myRegexp.exec(item.text);
            if(match.length){
                item.text = match[1].trim();
            }else{
                item.text = "";
            }
          });
        }
        if (row.warranty) {
          row.warranty.forEach(item => {
            var myRegexp = /Gwarancja\s+\n\s*(.+)/g;
            var match = myRegexp.exec(item.text);
            if(match.length){
                item.text = match[1].trim();
            }else{
                item.text = "";
            }
          });
        }
      }
    }
    return data;
  };
  
  module.exports = { transform };
  