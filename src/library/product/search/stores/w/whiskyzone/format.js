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
    for (const { group } of data) {
      var rank = 1;
      for (let row of group) {
        if(row.aggregateRating){
            var tot=0;var decimalPoint=false;
            row.aggregateRating.forEach(item => {
                if(item.text=='icon--star'){
                    tot=tot+1;
                }else if(item.text=='icon--star-half'){
                  decimalPoint=true;
                }
            });
            if(decimalPoint == false){
              var totStr=tot.toString();
            }else{
              var totStr=tot.toString()+'.5';
            }
            row.aggregateRating=[{"text":totStr,"xpath":row.aggregateRating[0]['xpath']}];
        }
        if(row.price){
            var test=row.price[0]['text'].replace(' *','');
            row.price[0]['text']=test.replace('*','');
        }
        row.rank = [{ "text": rank }];
        row.rankOrganic = [{ "text": rank }];
        rank++;
      }
    }
    return cleanUp(data);
  };
  module.exports = { transform };