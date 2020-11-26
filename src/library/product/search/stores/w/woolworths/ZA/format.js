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
            
            if (row.id) {
                let prod_id = '';
                row.id.forEach(item => {                                        
                 prod_id = item.text.replace( /^\D+/g, '');
                 if (prod_id) {
                    row.id = [{'text': prod_id,'xpath':row.id[0].xpath}];
                  }
                });
            } 

            if (row.rankOrganic && row.rank) {
                row.rankOrganic = [{'text':p_count}];
                row.rank = [{'text':p_count}];
                p_count = p_count + 1;
            } 

            if (row.productUrl) {
                row.productUrl.forEach(item => {                                        
                item.text = "https://www.woolworths.co.za" + item.text;
                });
            }  
                  
        }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };