/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
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
    const state = context.getState();
    let orgRankCounter = state.orgRankCounter || 0;
    let rankCounter = state.rankCounter || 0;
    const productCodes = state.productCodes || [];
    for (const { group } of data) {
      for (const row of group) {      
        //var test = row.id;
  
        //  if(row.id){
        //      debugger;
        //   row.id = [{ text: row.id[0].text.split('.')[0]}];
        //   console.log(row.id);
        //} 
        
  
        // console.log("startIdx :-" , row.id.indexOf('('));
        // console.log("startIdx :-" , row.id.indexOf(')'));
        // const startIdx = row.id.indexOf('(');
        // const endIdx = test.indexOf(')');
        //  console.log(startIdx);
        // console.log(endIdx);  
  
        // function to get the json data from the string
        // function findJsonData (scriptSelector, startString, endString) {
        //   try {
        //     //const xpath = `//script[contains(.,'${scriptSelector}')]`;
        //     const xpath = scriptSelector;
        //     const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        //     const scriptContent = element.textContent;
        //     const startIdx = scriptContent.indexOf(startString);
        //     const endIdx = scriptContent.indexOf(endString);
        //     let jsonStr = scriptContent.substring(startIdx + startString.length, endIdx);
        //     jsonStr = jsonStr.trim();
        //     return JSON.parse(jsonStr);
        //   } catch (error) {
        //     console.log(error.message);
        //   }
        // }
  
  
         // elements from data Layer object
        // const dataObj = findJsonData(row.id, '(', ')');
         // Check for the data and append to DOM
        //  console.log("print:-  ", dataObj)
        //  if (dataObj) {
           
        //  }    
  
  
  
  
        rankCounter += 1;
        if (!row.sponsored) {
          orgRankCounter += 1;
          row.rankOrganic = [{ text: orgRankCounter }];
        }
        row.rank = [{ text: rankCounter }];
        Object.keys(row).forEach(header => row[header].forEach(el => {
          el.text = clean(el.text);
        }));
      }
    }
    context.setState({ rankCounter });
    context.setState({ orgRankCounter });
    context.setState({ productCodes });
    console.log(productCodes);
    return data;
  };
  module.exports = { transform };
  