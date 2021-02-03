var respJson = {};



const express = require('express')
const app = express()
const port = 3001
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/transformData', (req, res) => {
    var jPayload = req.body;
    respJson.name = jPayload.payload.name;
respJson.valueType = jPayload.payload.valueType;
    var transformedData = transformData(jPayload);
    
    res.json(transformedData);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

function transformData(jPayload){

if (respJson.valueType == 'array') {
    var valueArr = getValueArray(jPayload.payload.value,jPayload);
    respJson.value = valueArr;
}
else if (respJson.valueType == 'string') {
    respJson.value = getstringVal(jPayload.payload.value,jPayload);
}
return respJson;
}


function getValueArray(valueArrayObj,jPayload) {
    var valueObjArrry = []
    for (var i = 0; i < valueArrayObj.length; i++) {
        var objData = {
            name: valueArrayObj[i].name,
            valueType: valueArrayObj[i].valueType,
            value: valueArrayObj[i].value
        }

        if (objData.valueType == 'array') {
            objData.value = getValueArray(objData.value,jPayload);
        }
        else if (objData.valueType == 'string') {
            objData.value = getstringVal(objData.value,jPayload);
        }
        valueObjArrry.push(objData)
    }
    return valueObjArrry;
}

function getstringVal(stringValData,jPayload) {
    const parseArr = ['REF_MSISDN', 'REF_IMSI', 'REF_SERVPROFID'];
    //var convertToJson = JSON.parse(stringValData);
    var strRepl = '';
    for (var i = 0; i < parseArr.length; i++) {
        if(stringValData.includes('{')){
        if (stringValData.includes('{' + parseArr[i] + '}')) {
            
            var mySubString = stringValData.substring(
                stringValData.lastIndexOf("{") + 1,
                stringValData.lastIndexOf("}"));
            //console.log(mySubString);

            if (mySubString in jPayload.referenceData) {
                //console.log(jPayload.referenceData[parseArr[i]]);

                strRepl = stringValData.replace('{' + mySubString + '}', jPayload.referenceData[parseArr[i]]);


            }
            else{
                strRepl=stringValData;
            }
        }
       
    }
    else{
        strRepl=stringValData;
    }


    }

    return strRepl;

}