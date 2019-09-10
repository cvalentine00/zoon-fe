// Converts a subject metadata object into an array of feedback objects
function metadataToRules (metadata = {}) {
  const metadataKeys = Object.keys(metadata)
  const rules = metadataKeys.reduce(function (result, key) {
    const [prefix, ruleIndex, propKey] = key.split('_')
    const value = metadata[key]
    const stringValue = (value !== null && value !== undefined) ? value.toString() : ''

    if (prefix === '#feedback' && stringValue) {
      if (isNaN(ruleIndex)) {
        console.error(`Subject metadata feedback rule index ${ruleIndex} is improperly formatted. The feedback rule index should be an integer.`)
      }
      const rule = result[ruleIndex] || {}
      rule[propKey] = value
      result[ruleIndex] = rule
    }

    return result
  }, [])

  return rules.filter(Boolean)
}

export default metadataToRules
