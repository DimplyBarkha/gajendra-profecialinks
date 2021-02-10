
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
        // .replace(/"\s{1,}/g, '"')
        // .replace(/\s{1,}"/g, '"')
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
      for (const row of group) {
          if(row.variantId){
            try{
            let str=(row.variantId[0].text)?(row.variantId[0].text):'';
            row.variantId = [{ text: str.replace(/^0+/, '')}];}
            catch(e){
              console.log("error, ",e);
            }
          } 
          if(row.quantity){
            try{
            let stringForQuant=(row.quantity[0].text)?(row.quantity[0].text):'';
            let lastWordInString=stringForQuant.split(" ").slice(-1);
            let secondLastWord=stringForQuant.split(" ").slice(-2,-1);
            if(/\d/.test(lastWordInString[0])){
                row.quantity = [{ text: lastWordInString[0]}];
            }
            else if(/\d/.test(secondLastWord[0])){
                let lastTowWord=stringForQuant.split(" ").slice(-2);
                let finalQuantity=lastTowWord.toString().replace(',',' ');
                row.quantity = [{ text: finalQuantity}];
            }}
            catch(e){
              console.log(e);
            }
          }
         if(row.storage){
           try{
             let fullText=(row.storage[0].text)?(row.storage[0].text):'';
             let nextText=(row.storage[1].text)?(row.storage[1].text):'';
             let firstText=fullText.replace(nextText,'');
             let finalText=firstText+' '+nextText;
             row.storage = [{ text: finalText}];
         }
        catch(e){
          console.log(e);
        }
        }
      }}
    
    return cleanUp(data);
  };
  
  module.exports = { transform };
