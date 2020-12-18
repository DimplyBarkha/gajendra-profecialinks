/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    const cleanUp = (data, context) => {
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
        data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
            el.text = clean(el.text);
        }))));
        return data;
    };    

    var p_count = 1;

    for (const { group } of data) {
        for (let row of group) {          
            if (row.rankOrganic && row.rank) {
                row.rankOrganic = [{'text':p_count}];
                row.rank = [{'text':p_count}];
                p_count = p_count + 1;
            }    

             if (row.aggregateRating) {
                row.aggregateRating.forEach(item => {  
                item.text = parseFloat(item.text.replace(/\D/g,'')) / 20;
                item.text = item.text.toFixed(1);                                       
                item.text = Number(item.text.trim());
                });
            }   

            if (row.thumbnail) {
                row.thumbnail.forEach(item => {  
                    item.text = "https:" + item.text
                });
            } 
            
            if (row.productUrl) {
                row.productUrl.forEach(item => {  
                    item.text = "https:" + item.text
                });
            }     
        }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };