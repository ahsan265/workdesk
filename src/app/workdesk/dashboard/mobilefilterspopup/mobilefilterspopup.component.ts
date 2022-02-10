import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { count } from 'console';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { element } from 'protractor';
import { GigaaaApiService } from 'src/app/service/gigaaaapi.service';
import { gigaaasocketapi } from 'src/app/service/gigaaasocketapi.service';
import { MessageService } from 'src/app/service/messege.service';
import { sharedres_service } from 'src/app/service/sharedres.service';
interface IRange {
  value: Date[];
  label: string;
  timeslot:string;
}
@Component({
  selector: 'app-mobilefilterspopup',
  templateUrl: './mobilefilterspopup.component.html',
  styleUrls: ['./mobilefilterspopup.component.css']
})
export class MobilefilterspopupComponent implements OnInit {
  countrychecked:boolean=true;
  defaultlang_ids=[];
  defaultcount_ids=[];
  selectedtimeSlot:any;
dateonefrompicker:any;
datesecondfrompicker:any;
  showmainfilters:boolean=false;
  showselectedrange:boolean=false;
  showlocationfilter:boolean=false;
  showlanguagefilter:boolean=false;
  showcustomdatefilter:boolean=false;
  countrylist:any;
  countryArray:any;
  rangeSelected:any;
  languageselected:any;
  countrySelected:any;
  datepreviewstart:any;
  datepreviewend:any;
  lang=[];
  id_soflanguages=[];
  id_sofcountries=[];
  countryallChecked:boolean=true;

  sendDate_from:any;
  sendDate_to:any;

  selectedlanguages:any;
  allselectedtag:boolean;
   // get last week days 
   beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000)
   beforeOneWeek2 = new Date(this.beforeOneWeek);

 day = this.beforeOneWeek.getDay()
 diffToMonday = this.beforeOneWeek.getDate() - this.day + (this.day === 0 ? -6 : 1)
 lastMonday = new Date(this.beforeOneWeek.setDate(this.diffToMonday))
 lastSunday = new Date(this.beforeOneWeek2.setDate(this.diffToMonday + 6));

   dayd = new Date().getDay();
   Startdayofweek=  new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + (this.dayd == 0?-6:1)-this.dayd );
   Enddayofweek=  new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + (this.dayd  == 0?0:7)-this.dayd );
   ranges: IRange[] = [
    {
      value: [new Date(new Date().setDate(new Date().getDate())),new Date()],
      label: 'Today',
      timeslot:"today",
    }
    ,{
      value: [new Date(new Date().setDate(new Date().getDate() - 1)),new Date(new Date().setDate(new Date().getDate() - 1))],
      label: 'Yesterday',
      timeslot:"yesterday",
    },{
      value: [this.Startdayofweek,this.Enddayofweek],
      label: 'This week',
    timeslot:"this_week",
  }, {
    value: [this.lastMonday,this.lastSunday],
    label: 'Last week',
    timeslot:"last_week",
  }, {
    value: [new Date(new Date().getFullYear(), new Date().getMonth(), 1),  new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)],
    label: 'This month',
    timeslot:"this_month",
  },
  {
    value: [new Date(new Date().getFullYear(), new Date().getMonth()-1, 1),  new Date(new Date().getFullYear(), new Date().getMonth(), 0)],
    label: 'Last month',
    timeslot:"last_month",
  },
  {
    value: [new Date(new Date().getFullYear(), 0, 1), new Date(new Date().getFullYear(), 11, 31)],
    label: 'This year',
    timeslot:"this_year",
  },
  {
    value: [new Date(new Date().getFullYear()-1, 0, 1), new Date(new Date().getFullYear()-1, 11, 31)],
    label: 'Last year',
    timeslot:"last_year",
  }];
  bsValue:Date[];
  @ViewChild(BsDaterangepickerDirective, { static: false }) dateRangePicker: BsDaterangepickerDirective;
 date=new Date(new Date().setDate(new Date().getDate()))
  bsConfig={
    containerClass:"theme-white",
    displayOneMonthRange:false,
    showWeekNumbers:false ,
    adaptivePosition: true,
    dateInputFormat: 'YYYY-MM-DD',
    ranges: this.ranges,
    todayHighlight: true,
    preventChangeToNextMonth: false,  
    startView:2,
    customTodayClass:'custom-today-class',
    showPreviousMonth: false,
    returnFocusToInput: false 
  };
  constructor(private messageservie:MessageService,
    private gigaaaservice:GigaaaApiService,
    public dialogRef: MatDialogRef<MobilefilterspopupComponent>,
    private sharedres:sharedres_service,
    private cdRef: ChangeDetectorRef,   
    @Inject(MAT_DIALOG_DATA) public data,) { }

  ngOnInit(): void {
    this.showselectedpanel("main");
    this.getallthecountries();
    this.getlllangugaes();
    this.onDateChange([this.ranges[0].value[0],this.ranges[0].value[1]]);
    this.cdRef.detectChanges(); 

  }
showselectedpanel(val)
{ this.selectDatetab(this.data?.rangeSelected);
  this.getCalenderSelected(this.data?.rangeSelected);
  if(val=="main")
  {
    this.showmainfilters=false;
    this.showselectedrange=true;
    this.showlocationfilter=true;
    this.showlanguagefilter=true;
    this.showcustomdatefilter=true;
  

  }
  else if(val=="selectedrange"){
    this.showmainfilters=true;
    this.showselectedrange=false;
    this.showlocationfilter=true;
    this.showlanguagefilter=true;
    this.showcustomdatefilter=true;

  }
  else if(val=="location")
  {
    this.showmainfilters=true;
    this.showselectedrange=true;
    this.showlocationfilter=false;
    this.showlanguagefilter=true;
    this.showcustomdatefilter=true;

  }
  else if(val=="languages")
  {
    this.showmainfilters=true;
    this.showselectedrange=true;
    this.showlocationfilter=true;
    this.showlanguagefilter=false;
    this.showcustomdatefilter=true;

  }
  else if(val=="custom")
  {
    this.showmainfilters=true;
    this.showselectedrange=true;
    this.showlocationfilter=true;
    this.showlanguagefilter=true;
    this.showcustomdatefilter=false;
  }
}
 // get all country 
 public async getallthecountries(): Promise<void>
 {
  const getdata = JSON.parse(localStorage.getItem('gigaaa-user'))
  var accesstoken=getdata?.api_token;
  try{
    var data= await this.gigaaaservice.getAllCountries(accesstoken);
    var countrylist= data.map((item, i) => Object.assign(item,{ status: false}));
      countrylist=data;
     this.countrylist= countrylist.sort((a, b)=> {
      var textA = a.name;
      var textB = b.name;
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  });
  this.countryArray=this.countrylist;
  this.getselectedcountry(this.data?.country_ids)
  this.countrylist.forEach(element => {
    this.defaultcount_ids.push(element.id);
  });
  }
  catch(err){
    this.messageservie.setErrorMessage(err.error.error);
  }
   

 }
 // get all languages
 public async getlllangugaes(): Promise<void>{
  const getdata = JSON.parse(localStorage.getItem('gigaaa-user'))
  var accesstoken=getdata.api_token;
  var subsid=getdata.subscription_id.subsid.uuid;
  const intid = JSON.parse(localStorage.getItem('intgid'))
  try{
   var languagee=[{name:'Arabic' ,status:false},
    {name:'English' ,status:false},
    {name:'German' ,status:false},
    {name:'Russian' ,status:false},
    {name:'Spanish' ,status:false},
    {name:'Turkish' ,status:false},
  ];
    var  language= await this.gigaaaservice.getAllLanguages(accesstoken,subsid,intid.int_id)
    let  updatearr = language.map((item, i) => Object.assign({}, item, languagee[i]));
    this.lang=updatearr;
    this.getselectedlanguages(this.data?.languages_id);
    this.lang.forEach(element=>{
      this.defaultlang_ids.push(element.id);
     })
  }
  catch(err){
    this.messageservie.setErrorMessage(err.error.error)
  }
  }

 // get selected languages
   getselectedlanguages(val:Array<any>)
   {
      val.forEach(ele=>{
      var  index = this.lang.findIndex(x => x.id ==ele);
      this.id_soflanguages.push(ele)
      this.lang[index].status=true;
     
    });
     this.languageselected=this.id_soflanguages.length +"\xa0"+"Selected";
      if(this.id_soflanguages.length==this.lang.length)
      {
          this.languageselected="All Selected"
          this.allselectedtag=true;
      }

   }
    // get selected country
    getselectedcountry(val:Array<any>)
    {
       val.forEach(ele=>{
       var  index = this.countrylist.findIndex(x => x.id ==ele);
       this.id_sofcountries.push(ele)
       this.countrylist[index].status=true;
      
    });
      this.countrySelected=this.id_sofcountries.length +"\xa0"+"Selected";
       if(this.id_sofcountries.length==249)
       {
           this.countrySelected="All Selected"
          //  this.allselectedtag=true;
       }
 
    }
     // select languages one by one 
     selectlanguagesonebyone(e:any,id:any)
     {

     if(e==true)
     { var objIndex = this.lang.findIndex((obj => obj.id == id));

       this.lang[objIndex].status = true;
      this.id_soflanguages.push(id);
      if(this.id_soflanguages.length==this.lang.length)
      {
        this.languageselected="All Selected"
      }
      else{
        this.languageselected=this.id_soflanguages.length +"\xa0"+"Selected"
      }

    }
    else if(e==false)
    { var objIndex = this.lang.findIndex((obj => obj.id == id));

     this.lang[objIndex].status = false;
     var index = this.id_soflanguages.indexOf(id);
     if (index !== -1) {
       this.id_soflanguages.splice(index, 1);
     }
     if(this.id_soflanguages.length==0)
     {
      this.languageselected="Not Selected";
     }
     else{
      this.languageselected=this.id_soflanguages.length +"\xa0"+"Selected"
    }


    }}
    // select country one by one 
    selectcountryonebyone(e:any,id:any)
    {
      if(e==true)
      { var objIndex = this.countrylist.findIndex((obj => obj.id == id));
  
        this.countrylist[objIndex].status = true;
       this.id_sofcountries.push(id);
       if(this.id_sofcountries.length==249)
       {
        this.countrySelected="All Selected"
        this.countryallChecked=true;
      }
       else{
        this.countrySelected=this.id_sofcountries.length +"\xa0"+"Selected";
       }
   
  
     }
     else if(e==false)
     { var objIndex = this.countrylist.findIndex((obj => obj.id == id));
  
      this.countrylist[objIndex].status = false;
      var index = this.id_sofcountries.indexOf(id);
      if (index !== -1) {
        this.id_sofcountries.splice(index, 1);
      }
      if(this.id_sofcountries.length==0)
      {
        this.countrySelected="Not Selected";
       

      }
      else{
        this.countrySelected=this.id_sofcountries.length +"\xa0"+"Selected";
      }
      this.countryallChecked=false;
    }
    }
 //selectionpanel for selecting the panes
 onDateChange(event: Array<Date>)
 { 

       var ismatched=false;
       var d = new Date(event[0]);
       var d1 = new Date(event[1]);
      this.ranges.filter(x=>{
      if(x.value[0].toDateString()==d.toDateString()&&x.value[1].toDateString()==d1.toDateString())
       {
         this.rangeSelected=x.label;
         this.selectedtimeSlot=x.timeslot;
         var  month = '' + (d.getMonth() + 1);
         var   day = '' +(d.getDate());
         var  year = d.getFullYear();
   
       if (month.length < 2) 
        {
         month = '0' + month;
   
        }
       if (day.length < 2) 
         {
           day = '0' + day;
   
         }
         var dateStart1= [day,month,year].join('/');
         var senddateStart1= [year,month,day].join('-');
         this.sendDate_from=senddateStart1;
         var  month1 = '' + (d1.getMonth() + 1);
       var   day1 = '' +( d1.getDate());
       var  year1 = d1.getFullYear();
 
     if (month1.length < 2) 
      {
       month1 = '0' + month1;
 
      }
     if (day1.length < 2) 
       {
         day1 = '0' + day1;
 
       }
       var dateEnd1= [day1,month1,year1].join('/');
       var senddateEnd1=[year1,month1,day1].join('-');
       this.sendDate_to=senddateEnd1;
         this.datepreviewstart=dateStart1;
         this.datepreviewend=dateEnd1;
         ismatched=true;
        
        //   $('.btn').addClass('.selected');
       
       }
     })
     if(ismatched==false)
     {
       var  month = '' + (d.getMonth() + 1);
       var   day = '' +(d.getDate());
       var  year = d.getFullYear();
 
     if (month.length < 2) 
      {
       month = '0' + month;
 
      }
     if (day.length < 2) 
       {
         day = '0' + day;
 
       }
       var dateStart= [day,month,year].join('/');
       var SenddateStart=[year,month,day].join('-');
       this.sendDate_from=SenddateStart;
       var  month1 = '' + (d1.getMonth() + 1);
       var   day1 = '' +( d1.getDate());
       var  year1 = d1.getFullYear();
 
     if (month1.length < 2) 
      {
       month1 = '0' + month1;
 
      }
     if (day1.length < 2) 
       {
         day1 = '0' + day1;
        
       }
       this.selectedtimeSlot="custom";
       var dateEnd= [day1,month1,year1].join('/');
       var senddateEnd= [year1,month1,day1].join('-');
       this.sendDate_to=senddateEnd;
       this.rangeSelected= "Custom";
       this.datepreviewstart=dateStart;
       this.datepreviewend=dateEnd;
           
     }
 }
   isActive(tabId:any): boolean {
  return this.rangeSelected === tabId;
}
 selectDatetab(tabId:any)
 {
   this.rangeSelected= tabId;
 }

   getTheDaterange(val:any)
     {    
     if(val!="Custom")
     { this.selectDatetab(val);
      //this.getCalenderSelected(val);
      this.ranges.forEach(element=>{
      
        if(element.label===val)
        { 
          this.selectedtimeSlot=element.timeslot;
         this.rangeSelected=element.label
          var date1 = new Date(element.value[0]);
          var date2 = new Date(element.value[1]);
          var  month2 = '' + (date2.getMonth() + 1);
          var   day2 = '' +(date2.getDate());
          var  year2 = date2.getFullYear();

     if (month2.length < 2)
      {
       month2 = '0' + month2;

      }
     if (day2.length < 2)
       {
         day2 = '0' + day2;

       }
       var dateEnd= [day2,month2,year2].join('/');
       var dateEnd1= [year2,month2,day2].join('-');
       this.datepreviewend=dateEnd;
       /////////////////////////////////////////////
       var  month1 = '' + (date1.getMonth() + 1);
       var   day1 = '' +(date1.getDate());
       var  year1 = date1.getFullYear();

     if (month1.length < 2)
      {
       month1 = '0' + month1;

      }
     if (day1.length < 2)
       {
         day1 = '0' + day1;

       }
       var dateStart= [day1,month1,year1].join('/');
       var dateStart1= [year1,month1,day1].join('-');

       this.datepreviewstart=dateStart;
       date1.setHours(0,0,0,0)
      var userTimezoneOffset = date1.getTimezoneOffset() * 60000;
      var userTimezoneOffset1 = date2.getTimezoneOffset() * 60000;

      date1= new Date(date1.getTime() - userTimezoneOffset);
      date2.setHours(23,59,59,0);
      date2= new Date(date2.getTime() - userTimezoneOffset1);
      this.sharedres.send_param_from_dashboard({dashboard_name:this.data.dashboard_name,countryids:this.id_sofcountries,languageids:this.id_soflanguages,daterangetab:this.rangeSelected,
        daterangeslot:this.selectedtimeSlot,
      fromdate:dateStart1,todate:dateEnd1}) 
       this.dialogRef.close(); 

        }
      })
     }
      else if(val=="Custom")
      {
        this.selectDatetab(val);
        var date1 = this.dateonefrompicker;
        var date2 = this.datesecondfrompicker;
        var  month2 = '' + (date2.getMonth() + 1);
        var   day2 = '' +(date2.getDate());
        var  year2 = date2.getFullYear();
 
      if (month2.length < 2)
       {
        month2 = '0' + month2;
 
       }
      if (day2.length < 2)
        {
          day2 = '0' + day2;
 
        }
        var dateEnd= [day2,month2,year2].join('/');
        var dateEnd1= [year2,month2,day2].join('-');

        this.datepreviewend=dateEnd;
        /////////////////////////////////////////////
        var  month1 = '' + (date1.getMonth() + 1);
        var   day1 = '' +(date1.getDate());
        var  year1 = date1.getFullYear();
 
      if (month1.length < 2)
       {
        month1 = '0' + month1;
 
       }
      if (day1.length < 2)
        {
          day1 = '0' + day1;
 
        }
        var dateStart= [day1,month1,year1].join('/');
        var dateStart1= [year1,month1,day1].join('-');

        this.datepreviewstart=dateStart;
        date1.setHours(0,0,0,0)
       var userTimezoneOffset = date1.getTimezoneOffset() * 60000;
       var userTimezoneOffset1 = date2.getTimezoneOffset() * 60000;
 
       date1= new Date(date1.getTime() - userTimezoneOffset);
       date2.setHours(23,59,59,0);
       date2= new Date(date2.getTime() - userTimezoneOffset1);
       this.sharedres.send_param_from_dashboard({dashboard_name:this.data.dashboard_name,countryids:this.id_sofcountries,languageids:this.id_soflanguages,daterangetab:this.rangeSelected,
        daterangeslot:this.selectedtimeSlot,
       fromdate:dateStart1,todate:dateEnd1}) 
          this.dialogRef.close(); 
 
      }
    
    }
        // calenderselected
        getCalenderSelected(val:any)
        {
         if(val!="Custom")
         {
         this.ranges.forEach(element=>{
         if(element.label==val)
         {
          this.bsValue=element.value
         }
         })
         }
        else if(val=="Custom")
        {
          var dateString1 = this.data.start_date; 
          var dateParts = dateString1.split("-");
          var dateObject = new Date(+dateParts[0], dateParts[1] - 1, +dateParts[2]);

          var dateString2 = this.data.end_date; 
          var dateParts1 = dateString2.split("-");
          var dateObject1 = new Date(+dateParts1[0], dateParts1[1] - 1, +dateParts1[2]);
          this.bsValue = [dateObject,dateObject1];
     
        }
  
  }
  // send data to dashboardpage 

  senddatatodashbaord()
  {
    if(this.data.dashboard_name=="Users"||this.data.dashboard_name=="Visitors")
    {
      this.sharedres.send_param_from_dashboard({dashboard_name:this.data.dashboard_name,countryids:this.id_sofcountries,languageids:this.id_soflanguages,daterangetab:this.rangeSelected,
        daterangeslot:this.selectedtimeSlot,
        fromdate:this.sendDate_from,todate:this.sendDate_to}) 
        this.dialogRef.close(); 
    }
    else  if(this.data.dashboard_name=="Calls"){
      this.sharedres.send_param_from_dashboard({dashboard_name:this.data.dashboard_name,countryids:this.id_sofcountries,languageids:this.id_soflanguages,daterangetab:this.rangeSelected,
        daterangeslot:this.selectedtimeSlot,
        fromdate:this.sendDate_from,todate:this.sendDate_to}) 
      this.dialogRef.close(); 
    }
 
  }
  // clear filter 
  Clearfilter()
  {
    if(this.data.dashboard_name=="Users"||this.data.dashboard_name=="Visitors")
    {
      this.sharedres.send_param_from_dashboard({dashboard_name:this.data.dashboard_name,countryids:this.defaultcount_ids,languageids:this.defaultlang_ids,daterangetab:"Today",
      daterangeslot:"this_week",
      fromdate:this.gettodaydate().fromdate,todate:this.gettodaydate().todate}) 
    this.dialogRef.close();
    }
    else if(this.data.dashboard_name=="Calls"){
      this.sharedres.send_param_from_dashboard({dashboard_name:this.data.dashboard_name,countryids:this.defaultcount_ids,languageids:this.defaultlang_ids,daterangetab:"Today",
        daterangeslot:"this_week",
        fromdate:this.gettodaydate().fromdate,todate:this.gettodaydate().todate}) 
      this.dialogRef.close(); 
    }
  }
  // get today date 
  gettodaydate()
  {
   var startdate = this.ranges[2].value[0];
   var enddate =  this.ranges[2].value[1];
   var  month = '' + (startdate.getMonth() + 1);
   var   day = '' +(startdate.getDate());
   var  year = startdate.getFullYear();
   var  month1 = '' + (enddate.getMonth() + 1);
   var   day1 = '' +(enddate.getDate());
   var  year1 = enddate.getFullYear();
   var dateStart1= [year,month,day].join('-');
   var enddate1=[year1,month1,day1].join('-');

 return  {fromdate:dateStart1,todate:enddate1};

  }


   // search country list
   search(term:string,field:Array<any>) {  
    
    let result=this.countryArray.filter((obj ,i)=> {
     if(obj['name']!=null)
     {
      return obj['name'].toLowerCase().includes(term.toLowerCase());
     }
     else  if(obj['name']==null)
     {
       return obj['name'].toLowerCase().includes(term.toLowerCase());
     }
   });
  //  console.log(result);
  //  var mergedArrayWithoutDuplicates = this.countryArray.concat(
  //  this.countrylist.filter(seccondArrayItem => !this.countryArray.includes(seccondArrayItem))
  // );
        this.countrylist=result;

  }

       // get all countries
       getallcountriesshow(val)
       {
          var udpatedcountry=[];
          var countryid=[];
          var checked;
          this.countrylist.forEach(element=>{
          var index = countryid.indexOf(element.id);
          if (index !== -1) {
            countryid.splice(index, 1);
    
          }
            })
          if(val==true)
          {
    
          this.countrylist.forEach(element => {
          udpatedcountry.push({name:element.name,status:true,id:element.id})
          countryid.push(element.id)
        });
        this.countrylist=udpatedcountry;
        this.id_sofcountries=countryid;
    
        this.countrySelected=countryid.length +"\xa0"+"Selected";
          if(countryid.length==249)
          {
            this.countrySelected="All Selected";
              this.countryallChecked=true;
          }
    
          }
         else if(val==false){
          this.countrylist.forEach(element => {
            udpatedcountry.push({name:element.name,status:false,id:element.id})
         var index = countryid.indexOf(element.id);
          if (index !== -1) {
            countryid.splice(index, 1);
          }
    
          });
          this.countrylist=udpatedcountry;
          this.id_sofcountries=countryid;
          this.countryallChecked=false;
          this.countrySelected="Not Selected";
          checked=false;
  
    
    
      }
    
       }
}
