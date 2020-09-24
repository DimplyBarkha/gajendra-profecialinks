
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {    
    for (const { group } of data) {
        var rank_temp = 1
        for (const row of group) {            
            row.rankOrganic = [{'text':rank_temp}];
            row.rank = [{'text':rank_temp}];
            rank_temp = rank_temp + 1;
            if (row.productUrl) {
                row.productUrl.forEach(item => {
                    item.text = 'https://www.manor.ch' + item.text;
                });
            }
            if (row.thumbnail) {
                row.thumbnail.forEach(item => {
                    item.text = 'https://www.manor.ch' + item.text;
                });
            }
            if (row.price) {
                row.price.forEach(item => {
                    item.text = item.text.replace('.',',');
                });
            }
            if (row.aggregateRating2) {
                row.aggregateRating2.forEach(item => {
                    item.text = item.text.replace('.',',');
                });
            }
            if (row.name) {
                var final_name = '';
                if (row.brandText) {
                    final_name = row.brandText[0].text;
                }
                if (row.subTitle) {
                    final_name = final_name + '-' + row.subTitle[0].text;
                }
                final_name =  final_name + ' ' + row.name[0].text;
                row.name = [{'text':final_name}]
                row.nameExtended = [{'text':final_name}]                
            }
            delete row.subTitle;
        }        
    }
    return data;
  };
  
  module.exports = { transform };