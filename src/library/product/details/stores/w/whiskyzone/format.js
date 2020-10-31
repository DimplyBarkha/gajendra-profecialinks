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
      var videoExists=false;
      for (let row of group) {
        if(row.videos){
          videoExists=true;
        }
        if(row.description){
          var tmp=[];
          row.description.forEach(item => {
            tmp.push(item.text);
          });
          row.description=[{"text":"|| "+tmp.join(' || '),"xpath":row.description[0]['xpath']}];
        }
        if (row.listPrice) {
          row.listPrice.forEach(item=>{
            item.text=item.text.replace('*','').trim();
          })
        }
        if (row.price) {
          row.price.forEach(item=>{
            item.text=item.text.replace('*','').trim();
          })
        }
        if (row.manufacturer) {
          var info=[];
          row.manufacturer.forEach(item => {
            info.push(item.text);
          });
          var textData=info[info.length-1];
          var myRegexp = /Hersteller\s*:\s*(.+?)\n/g;
          var match = myRegexp.exec(textData);
          console.log('match :',match);
          if(match.length){
              row.manufacturer=[{"text":match[1].trim()}];
              row.brandText=[{"text":match[1].trim()}];
          }
          console.log("manufacturer : ",info.length);
        }
        if(row.quantity){
          row.quantity.forEach(item=>{
            var tmp=item.text.replace(' (','');
            item.text=tmp[0];
          })
        }
      }
    }
    return cleanUp(data);
  };
  module.exports = { transform };