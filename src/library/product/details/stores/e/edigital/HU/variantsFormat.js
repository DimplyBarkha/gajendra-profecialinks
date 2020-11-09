/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {            
    for (let group of data) {
        let pro_url = group["url"];
        for (const row of group["group"]) {    
            if (row.variant){
                let info = [];          
                row.variant.forEach(item => {              
                    info.push(item.text.trim());
                });                
                if (info.length>0){
                    row.variant = [{'text':info.join(' | '),'xpath':row.variant[0].xpath}];            
                }
            }
            if (row.variantId) {                
                row.variantId.forEach(item => {
                    if(item.text == '#'){
                        //console.log(pro_url);
                        item.text = pro_url;
                    }
                    var matches = /.+-p(\d+)/isg.exec(item.text);
                    if (matches){                  
                      item.text = matches[1];
                    }                    
                });
            }
            if (row.variantUrl) {                
                row.variantUrl.forEach(item => {
                    if(item.text == '#'){
                        //console.log(pro_url);
                        item.text = pro_url;
                    }
                    else{
                        item.text = "https://edigital.hu" + item.text;
                    }
                });
            }
        }
    }    
    return data;
  };
  
  module.exports = { transform };