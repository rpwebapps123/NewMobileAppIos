export interface IEventReqestBody {
    body: string

};
export interface IDateRange {
    startDate: string;
    endDate: string;
    username: string;
    password: string;
    GroupId: number

}
export var EventReqestBodyText:string =
    `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
<soapenv:Header>
<username>[[username]]</username>
<password>[[password]]</password></soapenv:Header>
<soapenv:Body>
<tem:EventsGetBetween>
<!--Optional:-->
<tem:GroupId>[[GroupId]]</tem:GroupId>
<!--Optional:-->
<tem:StartDate>[[StartDate]]</tem:StartDate>
<!--Optional:-->
<tem:EndDate>[[EndDate]]</tem:EndDate>
<!--Optional:-->
<tem:IncidentOnly>false</tem:IncidentOnly>
</tem:EventsGetBetween>
</soapenv:Body>
</soapenv:Envelope>`