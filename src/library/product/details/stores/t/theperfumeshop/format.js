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
      var brandTextStr=''; var nameExtendedSr='';
      for (let row of group) {
        if(row.brandText){
          row.brandText.forEach(item=>{
            brandTextStr=item.text;
          });
        }
        if(row.nameExtended){
          row.nameExtended.forEach(item=>{
            nameExtendedSr=item.text;
          });
        }
        if(row.availabilityText){
          row.availabilityText=[{"text":'In Stock'}];
        }
        if(row.pricePerUnitUom){
          row.pricePerUnitUom.forEach(item=>{
            var UomStr=item.text.replace(' -','');
            item.text=UomStr.replace(/[^a-z]/gi, '');
          });
        }
        if(row.pricePerUnit){
          var priceUn=[];
          row.pricePerUnit.forEach(item=>{
            priceUn=item.text.split('|');
          });
          row.pricePerUnit=[{"text":priceUn.pop()}];
        }
        if(row.quantity){
          row.quantity.forEach(item=>{
            item.text=item.text.replace(' -','').trim();
          })
        }
        if(row.description){
          var tdNo=0;var trDataArr=[]; var tdData=''; var allDataArr=[];
          row.description.forEach(item=>{
            //trDataArr.push(item.text.replace(/\s*\n\s*\n\s*/g, '').trim());
            //trDataArr.push();
            allDataArr=item.text.split(/\s*\n\s*\n\s*/g);
            //var allDataArr=item.text.split('/\n \n/');
            allDataArr.forEach(element => {
              //console.log('tdNo :',tdNo);
              //console.log('tdData :',tdData);
              if(tdNo==0){
                tdData=element;
              }
              if(tdNo==1){
                tdData=tdData+" : "+element;
              }
              tdNo++;
              //console.log('tdNo1 :',tdNo);
              //console.log('tdData1 :',tdData);
              if(tdNo==2){
                trDataArr.push(tdData);tdNo=0;tdData='';
              }
              //console.log('trDataArr :',trDataArr);  
            });
          });
          var tmpStr=trDataArr.join(' || ');
          //console.log('tmpStr :',tmpStr);
          row.description=[{"text":tmpStr}];
        }
        if(row.secondaryImageTotal){
          var tot=1
          row.secondaryImageTotal.forEach(item=>{
            tot++;
          })
          row.secondaryImageTotal=[{"text":tot}];
        }
        if(brandTextStr!=''){
          row.nameExtended=[{"text":brandTextStr+' '+nameExtendedSr}];
        }
      }
    }
    return cleanUp(data);
  };
  module.exports = { transform };