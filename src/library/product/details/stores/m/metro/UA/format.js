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
      for (let row of group) {
        if (row.brandText) {
          var tmpArray = []
          var strBrandName = ''
          row.brandText.forEach((item,index) => {
            tmpArray = item.text.split('\n')
            if(tmpArray[0] == 'Бренд'){ //brand name
              strBrandName = tmpArray[2]
            }
          })
          row.brandText = [{"text": strBrandName, "xpath": row.brandText[0].xpath }]
        }
        // if (row.description) {
        //   row.description.forEach(item => {
        //     // var strFulltext = item.text
        //     // var strRegProdName = strFulltext.match(/.*?(\.)(?=\s[^\x00-\x7F])/);
        //     // //console.log('Prod Name: ' + strRegProdName)

        //     // var strRemText = strFulltext.substring(strRegProdName.length)
        //     // console.log(strRemText)
            
        //     // var result = strRemText.matchAll(/(?<key>[^:]+):(?<value>[^\.]+)\.?/g);
        //     // //console.log('result:' + result)
        //     // for(const keyItem of result){
        //     //   console.log(keyItem.groups['key'] + ':' + keyItem.groups['value'])
        //     // }

        //   });
        // }
      
      }
    }
    return cleanUp(data);
  };
module.exports = { transform };