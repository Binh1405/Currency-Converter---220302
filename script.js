const API_KEY = "904d578e3437f803ddf1ecda"
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`
const getSupportedCodes = async() =>{
    try {
        const response = await fetch(`${BASE_URL}/codes`)
        if(response.ok){
            const data = await response.json()
            const codes = data["supported_codes"]
            console.log("codes", codes)
            return codes
        }
    } catch (error) {
        console.log(error)
        return []
    }
}
// getSupportedCodes().then((result)=> console.log(result)) 

const getConversionRate = async(baseCode, targetCode)=>{
    try {
        const response = await fetch(`${BASE_URL}/pair/${baseCode}/${targetCode}`)
        console.log("response", response)
        if(response.ok){
            const data = await response.json()
            console.log("data", data)
            const rate = data["conversion_rate"]
            return rate
        }
    } catch (error) {
        console.log(error)
        return 0
    }
}
// getConversionRate("USD", "VND").then((result)=> console.log(result))

const baseUnit = document.querySelector("#base-unit")
const targetRate = document.querySelector("#target-rate")

const inputBaseAmount = document.querySelector("#base-amount")
const selectBaseCode = document.querySelector("#base-code")
const inputTargetAmount = document.querySelector("#target-amount")
const selectTargetCode = document.querySelector("#target-code")

const errorMessage = document.querySelector("#error-message")
let supportedCodes = [];
let conversionRate = 0;

const updateExchangeRate = async()=>{
    const baseCode = selectBaseCode.value
    const targetCode = selectTargetCode.value
    errorMessage.textContent = "Loading data.."
    conversionRate = await getConversionRate(baseCode, targetCode)
    if(conversionRate===0){
        errorMessage.textContent = "can not get conversion rate"
        return 
    }
    errorMessage.textContent = ""
    const baseName = supportedCodes.find((code) => code[0] = baseCode)[1]
    const targetName = supportedCodes.find((code) => code[0] === targetCode)[1]
    baseUnit.textContent = `1 ${baseName} equals`
    targetRate.textContent = `${conversionRate} ${targetName}`
    console.log("conversion rate", conversionRate)
}
const initialize = async() =>{
    errorMessage.textContent = "Loading data.."
    supportedCodes = await getSupportedCodes()
    // console.log("supportedCodes", supportedCodes)
    if(!supportedCodes.length){
        errorMessage.textContent = "no supported codes"
        return 
    }
    errorMessage.textContent = ""
    supportedCodes.forEach((code) => {
        const baseOption = document.createElement("option")
        baseOption.value = code[0]
        baseOption.textContent = code[1]
        selectBaseCode.appendChild(baseOption)
    })

    supportedCodes.forEach((code) => {
        const targetOption = document.createElement("option")
        targetOption.value = code[0]
        targetOption.textContent = code[1]
        selectTargetCode.appendChild(targetOption)
    })
    selectBaseCode.value = "VND"
    selectTargetCode.value = "USD"
    await updateExchangeRate()
    selectBaseCode.addEventListener("change", updateExchangeRate)
    selectTargetCode.addEventListener("change", updateExchangeRate)
    inputBaseAmount.addEventListener("input", ()=>{
        inputTargetAmount.value = Math.round((inputBaseAmount.value * conversionRate)*(10**4))/(10**4)
    })
    inputTargetAmount.addEventListener("input", ()=>{
        inputBaseAmount.value = Math.round((inputTargetAmount.value / conversionRate)*(10**4))/(10**4)
    })
}
initialize()

