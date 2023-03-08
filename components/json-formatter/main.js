let codeColors = {
  property: `#ff79c6`,
  value: `#bd93f9`,
  string: `#50fa7b`,
  default: `#ffffff`,
  alt: `#aaa`
}

function formatJson(json) {
  if (ValidateJson(json)) {
    json = JSON.parse(json)
  }

  return {
    html: handleParseDataType(findParseDataType(json), json, true),
    json: JSON.stringify(json, null, 2)
  }

  function findParseDataType(json) {
    let returnData = typeof json

    if (Array.isArray(json)) {
      returnData = `array`
    }

    return returnData
  }

  function handleParseDataType(datatype, json, ignoreDropdown = false) {
    if (datatype === `object`) {
      return ObjectConverter(json, ignoreDropdown)
    } else if (datatype === `array`) {
      return ArrayConverter(json)
    } else {
      return DefaultsConverter(json)
    }
  }

  function ObjectConverter(json, ignoreDropdown) {
    let returnData = ``

    Object.entries(json).forEach(objectElement => {
      let objectProperty = objectElement[0]
      let objectValue = objectElement[1]
      objectValue = handleParseDataType(findParseDataType(objectElement[1]), objectElement[1])

      returnData += `<div style="display: flex;"><span style="color: ${codeColors.property};">&quot;${objectProperty}&quot;</span>: ${objectValue}</div>`
    });

    if (!ignoreDropdown) {
      returnData = `<div style="padding-left: 2ch;">${returnData}</div>`
    }

    return `${!ignoreDropdown ? `<details style="display: inline;"><summary style="color: ${codeColors.alt}"><span style="color: ${codeColors.property};">Object <span style="color: ${codeColors.value}">${Object.entries(json).length}</span> {}</span></summary>` : ``}${returnData}${!ignoreDropdown ? `</details>` : ``}`
  }

  function ArrayConverter(json, ignoreDropdown = false) {
    let returnData = ``

    json.forEach((arrayElement, arrayIndex) => {
      let arrayValue = handleParseDataType(findParseDataType(arrayElement), arrayElement)

      returnData += `<div style="display: flex;">${arrayIndex}: ${arrayValue}</div>`
    });
    returnData += `<div style="display: flex;"><span style="color: ${codeColors.property};">Length</span>: <span style="color: ${codeColors.value};">${json.length}</span></div>`

    if (!ignoreDropdown) {
      returnData = `<div style="padding-left: 2ch;">${returnData}</div>`
    }

    return `${!ignoreDropdown ? `<details style="display: inline;"><summary style="color: ${codeColors.alt}"><span style="color: ${codeColors.property};">Array <span style="color: ${codeColors.value}">${json.length}</span> []</span></summary>` : ``}${returnData}${!ignoreDropdown ? `</details>` : ``}`
  }
  
  function DefaultsConverter(json) {
    if (findParseDataType(json) === `string`) {
      json = `<span style="color: ${codeColors.string};">&quot;${json}&quot;</span>`
    } else {
      json = `<span style="color: ${codeColors.value};">${json}</span>`
    }
    return json
  }

  function ValidateJson(json) {
    try {
        JSON.parse(json);
    } catch (error) {
        return false;
    }
    return true;
  }
}
