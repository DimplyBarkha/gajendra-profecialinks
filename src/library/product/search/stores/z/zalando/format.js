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
                row.rankOrganic = [{'text':p_count}];
                row.rank = [{'text':p_count}];
                p_count = p_count + 1;
            }
            if (row.id) {
                row.id.forEach(item => {                    
                    item.text = item.text.substr(0, item.text.lastIndexOf('.html'));
                    var path_arr = item.text.split('-');
                    path_arr = path_arr.reverse();
                    item.text = path_arr[1]+"-"+path_arr[0];
                });
            }
            if (row.productUrl) {
                row.productUrl.forEach(item => {                    
                    item.text = "https://www.zalando.fr" + item.text;
                });
            }
        }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };