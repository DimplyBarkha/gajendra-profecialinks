
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
        if(row.productUrl){
          row.productUrl.forEach(item => {
            item.text='https://www.mediaexpert.pl'+item.text;
          });
        }

        if(row.thumbnail){
          row.thumbnail.forEach(item => {
            item.text='https:'+item.text;
          });
        }

        if(row.aggregateRating){
          var totRatting=0;
      
          row.aggregateRating.forEach(item => {
            if(item.text.indexOf('is-full') !== -1){
              totRatting=totRatting+1;
            }
          });
          row.aggregateRating = [{"text":totRatting, "xpath": row.aggregateRating[0]['xpath']}];
        }

        /*if (row.manufacture) {
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
        }*/
      }
    }
    return data;
  };
  
  module.exports = { transform };
  