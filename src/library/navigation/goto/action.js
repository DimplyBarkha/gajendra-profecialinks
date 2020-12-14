module.exports = {
  parameters: [
    {
      name: 'domain',
      description: 'The top private domain of the website (e.g. amazon.com)',
    },
    {
      name: 'timeout',
      description: 'Timeout for loading',
      type: 'number',
      optional: true,
    },
    {
      name: 'jsonToTable',
      description: 'will check if the json collected is properly parsed into a table',
      type: 'boolean',
      optional: true,
    },
  ],
  inputs: [
    {
      name: 'url',
      description: 'The URL to go to',
      type: 'string',
    },
    {
      name: 'zipcode',
      description: 'Set location ',
      type: 'string',
    },
    {
      name: 'storeId',
      description: 'storeId for product',
      type: 'string',
      optional: true,
    },
  ],
  dependencies: {
    setZipCode: 'action:navigation/goto/setZipCode',
  },
  path: './goto/domains/${domain[0:2]}/${domain}',
  implementation: async (inputs, parameters, context, dependencies) => {
    const { timeout = 10000, jsonToTable } = parameters;
    const { url, zipcode, storeId } = inputs;
    await context.goto(url, { timeout, waitUntil: 'load', checkBlocked: true });

    if (jsonToTable && url.split('[!opt!]')[1] && url.split('[!opt!]')[1].includes('"type":"json"')) {
      let isTableReady = true;
      await context.waitForXpath('//table//tbody//td', timeout)
        .catch(() => { isTableReady = false; });

      if (!isTableReady) {
      // load the json into a table manually
        isTableReady = await context.evaluate(() => {
          let body;
          try {
          // if this line fails, it means that the response had an issue, therefore no valid results are there
            body = JSON.parse(document.body.innerText);
          } catch (error) {
            console.error(error);
            return false;
          }
          // transform the json into an html table
          const appendRow = (obj, depth, headers) => {
            return headers.reduce((acc, key) => {
              const value = obj[key] || '';
              if (typeof value === 'object' || Array.isArray(value)) {
                return `${acc}<td class="${key} depth_${depth}">${obj2HTMLTable(value, depth + 1)}</td>`;
              }
              return `${acc}<td class="${key} depth_${depth}">${value.toString()}</td>`;
            }, '<tr>') + '</tr>';
          };
          const obj2HTMLTable = (origin, depth) => {
            if (!Array.isArray(origin)) return obj2HTMLTable([origin], depth);
            const arr = typeof origin[0] === 'object' ? origin : origin.map(val => ({ LISTITEM: val }));
            const headers = [...new Set(arr.reduce((acc, obj) => [...Object.keys(obj)], []))];
            const tHead = headers
              .reduce((acc, key) => `${acc}<th>${key}</th>`, '<table><thead><tr>') + '</tr></thead>';
            return arr.reduce((acc, obj) => {
              return acc + appendRow(obj, depth, headers);
            }, `${tHead}<tbody>`) + '</tbody></table>';
          };
          const htmlString = obj2HTMLTable(body, 0);
          document.write(htmlString);
          document.close();
          return htmlString;
        });
      }
    }

    console.log(zipcode);
    if (zipcode || storeId) {
      await dependencies.setZipCode(inputs);
    }
  },
};
