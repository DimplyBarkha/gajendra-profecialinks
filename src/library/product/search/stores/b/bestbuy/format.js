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
            if (row.price) {
                row.price.forEach(item => {                    
                    item.text = item.text.replace(/(\s*,\s*)+/isg, '').trim();                    
                });
            }
            if (row.rankOrganic && row.rank) {
                row.rankOrganic = [{'text':p_count}];
                row.rank = [{'text':p_count}];
                p_count = p_count + 1;
            }
            if (row.reviewCount) {
                row.reviewCount.forEach(item => {                    
                    item.text = item.text.replace(/(\s*\(|reseñas|\)\s*)+/isg, '').trim();                    
                });
            }
            if (row.name) {
                row.name.forEach(item => {                    
                    item.text = item.text.replace(/(\s*\¡Nuevo\!\s*)+/isg, '').trim();                    
                });
            }
            if (row.ratingCount) {
                row.ratingCount.forEach(item => {
                    item.text = item.text.replace(/(\s*\(|reseñas|\)\s*)+/isg, '').trim();
                });
            }            
        }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };