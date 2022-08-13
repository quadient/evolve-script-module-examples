# Csv Transformation Example

## Build the script

As was described in the main README:
In commandline switch to the folder `csv-transform-example` and run the
following command:

$ bb b

As a result, there should be a file a.js in folder dist. This is the javascript
that should be uploaded to Evolve.

## Create Pipeline

Following pictures illustrate the pipeline.

**Note**: In the "Print" step it is necessary to provide a real path to
the `LifeInsuranceQuote_jsonInput.wfd` file in the `ICM Sample Solutions` folder.

The `DataInput` must point to the `request.json` file in the `Working Folder`.

![](doc/pipeline-1.png)

![](doc/pipeline-2.png)

![](doc/pipeline-3.png)

![](doc/pipeline-4.png)

## The request

Change:
- `YOUR_API_KEY` to the real API key from the Inspire Cloud and
- `YOUR_PIPELINE` to the Pipeline ID.

```
POST /production/v2/onDemandPipelineCustomData/YOUR_PIPELINE_ID HTTP/1.1
Host: neubauer.inspireclouduat.net
Authorization: Bearer YOUR_API_KEY
Content-Type: text/plain
Content-Length: 1294

CustID,CustName,CustMid,CustSur,CustMail,FromMail,CustPhone,FromPhone,Subject,CustGen,CustCompany,CustStreet,CustCity,CustZIP,CustCountry,CustState,CountryLong,Manager,Internet,Phone,Consultant,CustOption,Date,Open,High,Low,Close,Change,LastDate,LastOpen,LastHigh,LastLow,LastClose,LastChange,Initial_Amount,Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec
1,"Johannes","","Planck","jp@example.com","example@example.com",420123456789,420123456789,"Life Insurance Quotes",1,"","Kopernikstrasse 54","Kiel",44612,"D","","Germany","Thomas Müller",1,1,1,1,"21.9.2001","0,761000","0,765210","0,707836","0,757446","-18,91%","28.12.2001","1,022044","1,035114","1,022044","1,032020","2,81%","17000,00","6412,78","6377,56","6204,42","6194,22","6223,57","6201,49","5999,19","5222,12","3787,23","4820,26","5150,97","5160,1",
2,"Elizabeth","","Miles","example@example.com","example@example.com",420123456789,420123456789,"Life Insurance Quotes",2,"Fiberplan AG","Watson Street","Liverpool","SW45AJ","E","Hampshire","United Kingdom","Samuel Ray",0,1,1,5,"3.8.2001","2,079150","2,079150","2,047620","2,066330","1,84%","28.12.2001","1,985710","2,002720","1,982370","1,987260","2,13%","3000,00","2781,3","2660,5","2457,68","2163,41","2101,23","2215,1","2084,79","1916,8","1423,19","1768,96","1900,57","1987,26",
```