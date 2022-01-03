import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { element } from 'protractor';
import { GigaaaApiService } from 'src/app/service/gigaaaapi.service';
import { MessageService } from 'src/app/service/messege.service';
import { sharedres_service } from 'src/app/service/sharedres.service';
import { MobilefiltersforagentsComponent } from '../../mobilefiltersforagents/mobilefiltersforagents.component';
interface IRange {
  value: Date[];
  label: string;
}
@Component({
  selector: 'app-call-mobile-popup-filter',
  templateUrl: './call-mobile-popup-filter.component.html',
  styleUrls: ['./call-mobile-popup-filter.component.css']
})
export class CallMobilePopupFilterComponent implements OnInit {
selectedTabname:any;
selectedStartDaterange:any;
selectedEndDaterange:any;

dateonefrompicker:any;
datesecondfrompicker:any;

  idsoflanguages=[];
searchpanel:boolean=false;
languagepanel:boolean=false;
locationpanel:boolean=false;
daterangepanel:boolean=false;

  showmainfilters:boolean=false;
  showselectedrange:boolean=false;
  showlocationfilter:boolean=false;
  showsearchfilter:boolean=false;
  showlanguagefilter:boolean=false;
  showcustomdatefilter:boolean=false;
  countrylist:any;
  rangeSelected:any;
  datepreviewstart:any;
  datepreviewend:any;
  lang:any;
  id_soflanguages=[];
  selectedlanguages:any;
  allselectedtag:boolean;
   // get last week days 
   beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000)
   day = this.beforeOneWeek.getDay()
   diffToMonday = this.beforeOneWeek.getDate() - this.day + (this.day === 0 ? -6 : 1)
   lastMonday = new Date(this.beforeOneWeek.setDate(this.diffToMonday))
   lastSunday = new Date(this.beforeOneWeek.setDate(this.diffToMonday + 6));
  ranges: IRange[] = [
    {
      value: [new Date(new Date().setDate(new Date().getDate())),new Date()],
      label: 'Today'
    }
    ,{
      value: [new Date(new Date().setDate(new Date().getDate() - 1)),new Date(new Date().setDate(new Date().getDate() - 1))],
      label: 'Yesterday'
    },{
    value: [new Date(new Date().setDate(new Date().getDate()-new Date().getDay()+1)),new Date(new Date().setDate(new Date().getDate()-new Date().getDay()+7))],
    label: 'This week'
  }, {
    value: [this.lastMonday,this.lastSunday],
    label: 'Last week'
  }, {
    value: [new Date(new Date().getFullYear(), new Date().getMonth(), 1),  new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)],
    label: 'This month'
  },
  {
    value: [new Date(new Date().getFullYear(), new Date().getMonth()-1, 1),  new Date(new Date().getFullYear(), new Date().getMonth(), 0)],
    label: 'Last month'
  },
  {
    value: [new Date(new Date().getFullYear(), 0, 1), new Date(new Date().getFullYear(), 11, 31)],
    label: 'This year'
  },
  {
    value: [new Date(new Date().getFullYear()-1, 0, 1), new Date(new Date().getFullYear()-1, 11, 31)],
    label: 'Last year'
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
    public dialogRef: MatDialogRef<MobilefiltersforagentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private cdRef: ChangeDetectorRef,   
    private shared_res:sharedres_service) 
    {     
    }

  form = new FormGroup({
    search: new FormControl('', [
      Validators.required,
    ]),
   });

  ngOnInit(): void {
    this.get_recent_search_data();
    this.showselectedpanel("main");
    this.showcalltypepanel();
    this.getallthecountries();
    this.getlllangugaes();
    this.cdRef.detectChanges(); 

  //  this.onDateChange([this.ranges[0].value[0],this.ranges[0].value[1]]);
 
  }
showselectedpanel(val)
{
  if(val=="main")
  {
    this.showmainfilters=false;
    this.showselectedrange=true;
    this.showsearchfilter=true;
    this.showlanguagefilter=true;
    this.showcustomdatefilter=true;
    this.showlocationfilter=true;
  }
  else if(val=="selectedrange"){
    this.showmainfilters=true;
    this.showselectedrange=false;
    this.showsearchfilter=true;
    this.showlanguagefilter=true;
    this.showcustomdatefilter=true;
    this.showlocationfilter=true;


  }
  else if(val=="location")
  {
    this.showmainfilters=true;
    this.showselectedrange=true;
    this.showsearchfilter=true;
    this.showlanguagefilter=true;
    this.showcustomdatefilter=true;
    this.showlocationfilter=false;


  }
  else if(val=="languages")
  {
    this.showmainfilters=true;
    this.showselectedrange=true;
    this.showsearchfilter=true;
    this.showlanguagefilter=false;
    this.showcustomdatefilter=true;
    this.showlocationfilter=true;


  }
  else if(val=="custom")
  {
    this.showmainfilters=true;
    this.showselectedrange=true;
    this.showsearchfilter=true;
    this.showlanguagefilter=true;
    this.showcustomdatefilter=false;
    this.showlocationfilter=true;

  }
  else if(val=="search")
  {
    this.showmainfilters=true;
    this.showselectedrange=true;
    this.showsearchfilter=false;
    this.showlanguagefilter=true;
    this.showcustomdatefilter=true;
    this.showlocationfilter=true;

  }
}
 // get all country 
 public async getallthecountries(): Promise<void>
 {
  const getdata = JSON.parse(localStorage.getItem('gigaaa-subscription'))
  var accesstoken=getdata?.access_token;
  try{
    var data= await this.gigaaaservice.getAllCountries(accesstoken);
    console.log(data)
     this.countrylist=data;
     this.countrylist= this.countrylist.sort((a, b)=> {
      var textA = a.name;
      var textB = b.name;
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  });
  }
  catch(err){
    this.messageservie.setErrorMessage(err.error.error);
  }
   

 }
 // get all languages
 public async getlllangugaes(): Promise<void>{
  const getdata = JSON.parse(localStorage.getItem('gigaaa-subscription'))
  var accesstoken=getdata.access_token;
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
    let updatearr = language.map((item, i) => Object.assign({}, item, languagee[i]));
      console.log(updatearr)
     this.lang=updatearr;
     this.getselectedlanguages(this.data.languages);
    this.lang.forEach(element => {
        this.idsoflanguages.push(element.id);
    });
  }
  catch(err){
    this.messageservie.setErrorMessage(err.error.error)
  }
}
selectlanguageonebyone(e,id)
 {  
     if(e==true)
     {
       this.id_soflanguages.push(id);
       if(this.id_soflanguages.length==6)
       {
        this.selectedlanguages="All Selected";
        this.allselectedtag=true;
       }
       else{
        this.selectedlanguages=this.id_soflanguages.length +"\xa0"+"Selected";
       }
     }
     else if(e==false)
     {
      var index = this.id_soflanguages.indexOf(id);
      if (index !== -1) {
        this.id_soflanguages.splice(index, 1);
      }
      
      if(this.id_soflanguages.length==0)
      {
       this.selectedlanguages="Not Selected";
      }
      else{
       this.selectedlanguages=this.id_soflanguages.length +"\xa0"+"Selected";
       this.allselectedtag=false;
      }
 
     }

   }
 //selectionpanel for selecting the panes
 onDateChange(event: Array<Date>)
 { 
    
       var ismatched=false;
       this.dateonefrompicker= new Date(event[0]);
       this.datesecondfrompicker= new Date(event[1]);
     this.ranges.filter(x=>{
     if(x.value[0].toDateString()== this.dateonefrompicker.toDateString()&&x.value[1].toDateString()== this.dateonefrompicker.toDateString())
       {
         this.rangeSelected=x.label
         var  month = '' + ( this.dateonefrompicker.getMonth() + 1);
         var   day = '' +( this.dateonefrompicker.getDate());
         var  year =  this.dateonefrompicker.getFullYear();
   
       if (month.length < 2) 
        {
         month = '0' + month;
   
        }
       if (day.length < 2) 
         {
           day = '0' + day;
   
         }
         var dateStart1= [day,month,year].join('/');
         var  month1 = '' + ( this.datesecondfrompicker.getMonth() + 1);
       var   day1 = '' +(  this.datesecondfrompicker.getDate());
       var  year1 =  this.datesecondfrompicker.getFullYear();
 
     if (month1.length < 2) 
      {
       month1 = '0' + month1;
 
      }
     if (day1.length < 2) 
       {
         day1 = '0' + day1;
 
       }
       var dateEnd1= [day1,month1,year1].join('/');
         this.datepreviewstart=dateStart1;
         this.datepreviewend=dateEnd1;
    
         ismatched=true;
        
        //   $('.btn').addClass('.selected');
       
       }
     })
     if(ismatched==false)
     {
       var  month = '' + ( this.datesecondfrompicker.getMonth() + 1);
       var   day = '' +( this.datesecondfrompicker.getDate());
       var  year =  this.datesecondfrompicker.getFullYear();
 
     if (month.length < 2) 
      {
       month = '0' + month;
 
      }
     if (day.length < 2) 
       {
         day = '0' + day;
 
       }
       var dateStart= [day,month,year].join('/');
 
       var  month1 = '' + ( this.datesecondfrompicker.getMonth() + 1);
       var   day1 = '' +(  this.datesecondfrompicker.getDate());
       var  year1 =  this.datesecondfrompicker.getFullYear();
 
     if (month1.length < 2) 
      {
       month1 = '0' + month1;
 
      }
     if (day1.length < 2) 
       {
         day1 = '0' + day1;
 
       }
       var dateEnd= [day1,month1,year1].join('/');
 
       this.rangeSelected= dateStart+ " -"+ dateEnd;
       this.datepreviewstart=dateStart;
       this.datepreviewend=dateEnd;
           
     }

    }
   // send search query
   send_search_query()
   {    if(this.form.get('search').value!="")
        {
       this.shared_res.Send_call_search_filter({call_type:this.data.call_type,search_value:this.form.get('search').value})
        }
        else{
         this.shared_res.Send_call_search_filter({call_type:this.data.call_type,search_value:''})

        }
    
   }
    // send languages query
    send_languages_query()
    {   
        this.shared_res.send_call_languages_filter({call_type:this.data.call_type,languages:this.id_soflanguages})
      
    }
   showcalltypepanel()
   {  let type=this.data.call_type;
     if(type=="incoming")
     {
      this.searchpanel=false;
      this.languagepanel=false;
      this.locationpanel=true;
      this.daterangepanel=true;
     }
     else if(type=="outgoing")
     {
      this.searchpanel=false;
      this.languagepanel=false;
      this.locationpanel=true;
      this.daterangepanel=true;
     }
     else  if(type=="missed"){
      this.searchpanel=false;
      this.languagepanel=false;
      this.locationpanel=true;
      this.daterangepanel=false;
    
     }
     else  if(type=="finished"){
      this.searchpanel=false;
      this.languagepanel=false;
      this.locationpanel=true;
      this.daterangepanel=false;
     
     }
   }
   // get recent search data 
   get_recent_search_data()
   { console.log(this.data)
    this.selectedTabname=this.data.dateRangeLabel;
    this.selectedStartDaterange=this.data.datestartRange;
    this.selectedEndDaterange=this.data.dateendtRange;
   
    this.selectDatetab(this.data.dateRangeLabel);
    this.getCalenderSelected(this.data.dateRangeLabel)
    if(this.data.call_type=="incoming")
    {
     this.form.get("search").setValue(this.data.search_value);
    }
    else if(this.data.call_type=="outgoing")
    {
     this.form.get("search").setValue(this.data.search_value);
    }
    else if(this.data.call_type=="missed")
    {
     this.form.get("search").setValue(this.data.search_value);
    }
    else if(this.data.call_type=="finished")
    {
     this.form.get("search").setValue(this.data.search_value);
    }
    else {
      this.form.get("search").setValue('');

    }
   }
   
   // get selected languages
    getselectedlanguages(val:Array<any>)
    {
       val.forEach(ele=>{
       var  index = this.lang.findIndex(x => x.id ==ele);
       this.id_soflanguages.push(ele)
       console.log(index)
       this.lang[index].status=true;
      
    });
      this.selectedlanguages=this.id_soflanguages.length +"\xa0"+"Selected";
       if(this.id_soflanguages.length==6)
       {
           this.selectedlanguages="All Selected"
           this.allselectedtag=true;
       }
 
    }
    // clear filter function
    clear_filter_for_tabs()
    { let type=this.data.call_type;
      if(type=="incoming")
      {
        this.shared_res.send_call_languages_filter({call_type:this.data.call_type,languages:this.idsoflanguages});
        this.shared_res.Send_call_search_filter({call_type:this.data.call_type,search_value:''});
        this.form.get("search").setValue('');

      }
      else if(type=="outgoing")
      {
        this.shared_res.send_call_languages_filter({call_type:this.data.call_type,languages:this.idsoflanguages})
        this.shared_res.Send_call_search_filter({call_type:'ongoing',search_value:''});
        this.form.get("search").setValue('');

      }
      else  if(type=="missed"){
        this.shared_res.send_call_languages_filter({call_type:this.data.call_type,languages:this.idsoflanguages});
        this.shared_res.Send_call_search_filter({call_type:this.data.call_type,search_value:''});
        this.form.get("search").setValue('');

      }
      else  if(type=="finished"){
        this.shared_res.send_call_languages_filter({call_type:this.data.call_type,languages:this.idsoflanguages});
        this.shared_res.Send_call_search_filter({call_type:'finished',search_value:''});
        this.form.get("search").setValue('');

      }
    }
    
    isActive(tabId:any): boolean {
      return this.selectedTabname === tabId;
    }

    selectDatetab(tabId:any)
    {
      console.log(tabId)
      this.selectedTabname = tabId;
    }

    getTheDaterange(val:any)
    {    
     if(val!="Custom")
     { this.selectDatetab(val);
      this.ranges.forEach(element=>{
      
        if(element.label===val)
        {  console.log(val)
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
       this.selectedEndDaterange=dateEnd;
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
       this.selectedStartDaterange=dateStart;
       date1.setHours(0,0,0,0)
      var userTimezoneOffset = date1.getTimezoneOffset() * 60000;
      var userTimezoneOffset1 = date2.getTimezoneOffset() * 60000;

      date1= new Date(date1.getTime() - userTimezoneOffset);
      date2.setHours(23,59,59,0);
      date2= new Date(date2.getTime() - userTimezoneOffset1);
          this.shared_res.Send_call_daterange_filter({daterangestart: date1.toISOString(),daterangeend:date2.toISOString(),tabslabel:this.selectedTabname,
          datestart:dateStart,dateend:dateEnd});
         this.dialogRef.close(); 

        }
      })
     }
      else if(val=="Custom")
      {
        console.log(val)
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
        this.selectedEndDaterange=dateEnd;
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
        this.selectedStartDaterange=dateStart;
        date1.setHours(0,0,0,0)
       var userTimezoneOffset = date1.getTimezoneOffset() * 60000;
       var userTimezoneOffset1 = date2.getTimezoneOffset() * 60000;
 
       date1= new Date(date1.getTime() - userTimezoneOffset);
       date2.setHours(23,59,59,0);
       date2= new Date(date2.getTime() - userTimezoneOffset1);
           this.shared_res.Send_call_daterange_filter({daterangestart: date1.toISOString(),daterangeend:date2.toISOString(),tabslabel:this.selectedTabname,
           datestart:dateStart,dateend:dateEnd});
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
            var dateString1 = this.data.datestartRange; 
            var dateParts = dateString1.split("/");
            var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);

            var dateString2 = this.data.dateendtRange; 
            var dateParts1 = dateString2.split("/");
            var dateObject1 = new Date(+dateParts1[2], dateParts1[1] - 1, +dateParts1[0]);
            this.bsValue = [dateObject,dateObject1];
            console.log( this.bsValue)
          }
    
    }
}
