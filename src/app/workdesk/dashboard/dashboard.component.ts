import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as Chart from 'chart.js';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { time } from 'console';
import {  Label } from 'ng2-charts';
import { defineLocale, enGbLocale } from 'ngx-bootstrap/chronos';
import { BsDaterangepickerDirective, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { element } from 'protractor';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { GigaaaApiService } from 'src/app/service/gigaaaapi.service';
import { MessageService } from 'src/app/service/messege.service';
import { sharedres_service } from 'src/app/service/sharedres.service';
import { MobilefilterspopupComponent } from './mobilefilterspopup/mobilefilterspopup.component';
declare var $: any;
interface IRange {
  value: Date[];
  label: string;
  timeslot:string;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  starting_flag:number=0;
  starting_flag1:number=0;
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
    label: 'This Month',
    timeslot:"this_month",
  },
  {
    value: [new Date(new Date().getFullYear(), new Date().getMonth()-1, 1),  new Date(new Date().getFullYear(), new Date().getMonth(), 0)],
    label: 'Last Month',
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
  datepreviewstart_calls:any;
  datepreviewend_calls:any;

  datepreviewstart_chats:any;
  datepreviewend_chats:any;

  datepreviewstart_tickets:any;
  datepreviewend_tickets:any;
  date_one_selected:any;
  date_two_selected:any;

  firstDate:any;
  lastDate:any;
  rangeSelected:any;
  rangeSelected1:any=this.ranges[0].label;
  rangeSelected2:any=this.ranges[0].label;
  rangeSelected3:any=this.ranges[0].label;

  selectedtabs:any;

  lang1=[];
  lang2=[];
  lang3=[];

  idsoflanguages=[];
  idsoflanguages1=[];
  idsoflanguages2=[];
  idsoflanguages3=[];

  mob_idsoflanguages1=[];
  mob_idsoflanguages2=[];
  mob_idsoflanguages3=[];

  selectedlanguages_calls:any;
  selectedlanguages_chats:any;
  selectedlanguages_tickets:any;

  selectedcountries_calls:any;
  selectedcountries_chats:any;
  selectedcountries_tickets:any;

  charttimeslot1:any;
  charttimeslot2:any;
  charttimeslot3:any;

  mob_chart_slot1:any=this.ranges[2].label;
  mob_chart_slot2:any=this.ranges[2].label;
  mob_chart_slot3:any=this.ranges[2].label;
  mob_date_from_chat:any;
  mob_date_to_chat:any;
  mob_date_from_user:any;
  mob_date_to_user:any;

  mob_date_from_visitor:any;
  mob_date_to_visitor:any;

  all_agent=[{},{},{},{},{}]
  showtopticketedagent:boolean;
  selecteddashboard:any;
  showcallsdashboard:boolean=false;
  showchatsdashboard:boolean=false;
  showvisitordashboard:boolean=false;
  showticketsdashboard:boolean=false;
  showuserdashboard:boolean=false;
  listofdashboard=[{name:"Calls",status:true},{name:"Users",status:false},{name:"Visitors",status:false}];
   myChart:any;
   myChart1:any;
   myChart2:any;
   myChart3:any;
   // line chart variable 
   linechart_user1:any;
   linechart_user2:any;
     // visitors chart variable 
     linechart_visitor1:any;
     linechart_visitor2:any;
   // line chart and call chart daterange:
   datefrom_call:any;
   dateto_call:any;
   datefrom_user:any;
   dateto_user:any;
   datefrom_visitor:any;
   dateto_visitor:any;
   subscription: Subscription;
   // get last current month days
  bsValueCall=this.ranges[2].value
  bsValueUser=this.ranges[2].value
  bsValueVisitor=this.ranges[2].value

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
  public barChartOptions: ChartOptions = {
    responsive: true,
    showLines:false,
    maintainAspectRatio: false,

    layout:{
      padding:{
        bottom:24
      }
    },
    legend:{
      position:'top',
      align:'center'
    },

     tooltips: {
      enabled: true,
      mode: 'nearest',
      displayColors: false,

      callbacks: {
          title: function () {
              return null;
          },

      }
   },
   hover: {
      mode: 'index',
      intersect: false
   },
    scales: {

      xAxes: [{
          gridLines: {
              display:false
          },

      },

    ],
      yAxes: [{
          gridLines: {
              display:false
          },
          ticks: {
            display: false,
            beginAtZero: true

        },
      }],

  }
  };

  public barChartLabels: Label[] = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor : [
        "#64DFDF", "#715DFF", "#64DFDF", "#715DFF", "#64DFDF","#715DFF","#64DFDF"
      ],
      radius:[24],
      hoverRadius:24,
      hitRadius:24,
      borderCapStyle:'round',
      maxBarThickness:96,
      fill: false,
      hoverBackgroundColor: [
        "#64DFDF", "#715DFF", "#64DFDF", "#715DFF", "#64DFDF","#715DFF","#64DFDF"
      ]
    },

  ];
  newVar:any;
  answered:any;
  answeredbyai:any;
  totalmissed:any;
  totalincoming:any;

  answeredper:any;
  answeredbyaiper:any;
  totalmissedper:any;
  totalincomingper:any;
   ansper:any;
   ansbyai:any;
   totalmissper:any;
   totalincper:any;
   countrylist=[];
   callchecked:boolean=true;
  userchecked:boolean=true;
  visitorchecked:boolean=true;

  countrylist_calls=[];
  countrylist_chats=[];
  countrytlist_ticket=[];

  idsof_countries=[];
  idsof_countries1=[];
  idsof_countries2=[];
  idsof_countries3=[];

  mob_idsof_countries1=[];
  mob_idsof_countries2=[];
  mob_idsof_countries3=[];
  lang=[];

  calls_first_data1:any;
  calls_first_data2:any;
  calls_first_data3:any;
  calls_first_data4:any;

  visit_first_data1:any;
  visit_first_data2:any;

  user_first_data:any;
  chartInterval_id:any;
  // user cards variable 
  totalUser:any=0;
  uniqueUser:any=0;
  sessionUser:any=0;

  totalUserper:any=0;
  uniqueUserper:any=0;
  sessionUserper:any=0;
  totalUserres:any=0;
  uniqueUserres:any=0;
  sessionUserres:any=0;
  // visitor cards variable 
  totalVisitor:any=0;
  uniqueVisitor:any=0;
  sessionVisitor:any=0;
  totalVisitorper:any=0;
  uniqueVisitorper:any=0;
  sessionVisitorper:any=0;
  totalVisitorres:any=0;
  uniqueVisitorres:any=0;
  sessionVisitorres:any=0;

  vsForTimeLable_calls:any="last week";
  vsForTimeLable_users:any="last week";
  vsForTimeLable_visitors:any="last week";

  constructor(private sharedres:sharedres_service,
    private router:Router,
    private localeService: BsLocaleService,
    public dialog: MatDialog,
     private gigaaaservice:GigaaaApiService,private messageservie:MessageService,
    private authService: AuthService
     ) {
      enGbLocale.weekdaysShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
      enGbLocale.week.dow = 1;
      defineLocale('en-gb', enGbLocale);
      this.localeService.use('en-gb');
      this.localeService.currentLocale;
      //this.sharedres.getuserole();
      this.sharedres.agentrole$.subscribe(data=>{
       if(data?.is_admin==true)
       {
          this.showtopticketedagent=false;

       }
       else{
            this.showtopticketedagent=true;
       }
      })

     }

    // get inetervise data for calls / chat / visitors 
    // call the endpoint functions
     callFunctionCharts()
     {
      if(this.selectedtabs=="Calls")
      {          

        if(this.idsoflanguages1.length==6 && this.idsof_countries1.length==249)
        {
          this.getcallcharts(this.charttimeslot1,[],[],0,this.datefrom_call,this.dateto_call);
          this.getcallstats(this.charttimeslot1,[],[],this.datefrom_call,this.dateto_call);
        }
        else if(this.idsoflanguages1.length==6)
        {
          this.getcallcharts(this.charttimeslot1,[],this.idsof_countries1,0,this.datefrom_call,this.dateto_call);
          this.getcallstats(this.charttimeslot1,[],this.idsof_countries1,this.datefrom_call,this.dateto_call);
        }
        else if(this.idsof_countries1.length==249)
        {
          this.getcallcharts(this.charttimeslot1,this.idsoflanguages1,[],0,this.datefrom_call,this.dateto_call);
          this.getcallstats(this.charttimeslot1,this.idsoflanguages1,[],this.datefrom_call,this.dateto_call);

        }
        else{
          this.getcallcharts(this.charttimeslot1,this.idsoflanguages1,this.idsof_countries1,0,this.datefrom_call,this.dateto_call);
          this.getcallstats(this.charttimeslot1,this.idsoflanguages1,this.idsof_countries1,this.datefrom_call,this.dateto_call);

        }
        this.vsForTimeLable_calls= this.setVsFunctionForcards(this.charttimeslot1);

      }
      else if(this.selectedtabs=="Visitors")
      {
        if(this.idsoflanguages3.length==6 && this.idsof_countries3.length==249)
        {          
          this.getuser_and_call_chart("Visitors",this.datefrom_visitor,this.dateto_visitor,[],[],0,this.charttimeslot3);
          this.getVisitorTotalCard(this.charttimeslot3,[],[],this.datefrom_visitor,this.dateto_visitor);
        }
        else if(this.idsoflanguages3.length==6)
        {
          this.getuser_and_call_chart("Visitors",this.datefrom_visitor,this.dateto_visitor,[],this.idsof_countries3,0,this.charttimeslot3);
          this.getVisitorTotalCard(this.charttimeslot3,[],this.idsof_countries3,this.datefrom_visitor,this.dateto_visitor);
        }
        else if(this.idsof_countries3.length==249)
        {
          this.getuser_and_call_chart("Visitors",this.datefrom_visitor,this.dateto_visitor,this.idsoflanguages3,[],0,this.charttimeslot3);
          this.getVisitorTotalCard(this.charttimeslot3,this.idsoflanguages3,[],this.datefrom_visitor,this.dateto_visitor);

        }
        else{
          this.getuser_and_call_chart("Visitors",this.datefrom_visitor,this.dateto_visitor,this.idsoflanguages3,this.idsof_countries3,0,this.charttimeslot3);
          this.getVisitorTotalCard(this.charttimeslot3,this.idsoflanguages3,this.idsof_countries3,this.datefrom_visitor,this.dateto_visitor);

        }
        this.vsForTimeLable_visitors= this.setVsFunctionForcards(this.charttimeslot3);
      }
      else if(this.selectedtabs=="Users")
      {
        if(this.idsoflanguages2.length==6 && this.idsof_countries2.length==249)
        {
          this.getuser_and_call_chart("Users",this.datefrom_user,this.dateto_user,[],[],0,this.charttimeslot2);
          this.getUserTotalCard(this.charttimeslot2,[],[],this.datefrom_user,this.dateto_user);


        }
        else if(this.idsoflanguages2.length==6)
        {
          this.getuser_and_call_chart("Users",this.datefrom_user,this.dateto_user,[],this.idsof_countries2,0,this.charttimeslot2);
          this.getUserTotalCard(this.charttimeslot2,[],this.idsof_countries2,this.datefrom_user,this.dateto_user);

        }
        else if(this.idsof_countries2.length==249)
        {
          this.getuser_and_call_chart("Users",this.datefrom_user,this.dateto_user,this.idsoflanguages2,[],0,this.charttimeslot2);
          this.getUserTotalCard(this.charttimeslot2,this.idsoflanguages2,[],this.datefrom_user,this.dateto_user);


        }
        else
        {
          this.getuser_and_call_chart("Users",this.datefrom_user,this.dateto_user,this.idsoflanguages2,this.idsof_countries2,0,this.charttimeslot2);
          this.getUserTotalCard(this.charttimeslot2,this.idsoflanguages2,this.idsof_countries2,this.datefrom_user,this.dateto_user);

        }
        this.vsForTimeLable_users=  this.setVsFunctionForcards(this.charttimeslot2);

      }
     }
  
    getDataTimeInterval()
    {
     this.chartInterval_id= setInterval(() =>{
       this.callFunctionCharts()
      },60000);
    }
     getlistofdashboard(val)
     {
       
       this.selectedtabs=val
       if(val=="Calls")
       {
         this.showcallsdashboard=false;
         this.showchatsdashboard=true;
         this.showvisitordashboard=true;
         this.showticketsdashboard=true
         this.showuserdashboard=true;
       }
       else if(val=="Chats"){
        this.showcallsdashboard=true;
        this.showchatsdashboard=false;
        this.showvisitordashboard=true;
        this.showticketsdashboard=true;
        this.showuserdashboard=true;


       }
       else if(val=="Visitors")
       {
        this.showcallsdashboard=true;
        this.showchatsdashboard=true;
        this.showvisitordashboard=false;
        this.showticketsdashboard=true;
        this.showuserdashboard=true;
        this.createoschart();
        this.createdevicechart();
        this.createbrowerschart();
        if(this.starting_flag==0)
        {
          this.callFunctionCharts();
          this.starting_flag=1
        }
        
       }
       else if(val=="Tickets")
       {
        this.showcallsdashboard=true;
        this.showchatsdashboard=true;
        this.showvisitordashboard=true;
        this.showticketsdashboard=false;
        this.showuserdashboard=true;
        


    this.createtickettypechart();
    this.createprioritticketchart();
       }
       else if(val=="Users")
       {
        this.showuserdashboard=false;
        this.showcallsdashboard=true;
        this.showchatsdashboard=true;
        this.showvisitordashboard=true;
        this.showticketsdashboard=true;
         if(this.starting_flag1==0)
        {
          this.callFunctionCharts();
          this.starting_flag1=1;
        }
     
      
       }
      this.selecteddashboard=val;
     }

     // get all country
     public async getallthecountries(): Promise<void>
     {
      const getdata = JSON.parse(localStorage.getItem('gigaaa-user'))
      var accesstoken=getdata?.api_token;
      try{
        
        var idsof_countries=[];
        var data= await this.gigaaaservice.getAllCountries(accesstoken);
       
         
         var countrylist= data.map((item, i) => Object.assign(item,{ status: false}));
        var countrylist= countrylist.sort((a, b)=> {
          var textA = a.name;
          var textB = b.name;
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
         });
        countrylist.forEach(element => {
          idsof_countries.push(element.id);
         });
         this.idsof_countries1=this.idsof_countries;
         this.idsof_countries2=this.idsof_countries;
         this.idsof_countries3=this.idsof_countries;
         this.countrylist=countrylist;
         this.countrylist_calls=countrylist;
         this.countrytlist_ticket=countrylist;
         this.countrylist_chats=countrylist;
         this.getallcountriesshow("Calls",true,0)
         this.getallcountriesshow("Users",true,0)
         this.getallcountriesshow("Tickets",true,0)
         this.showselectedNumberofcountries("Calls","All Selected")
         this.showselectedNumberofcountries("Users","All Selected")
         this.showselectedNumberofcountries("Tickets","All Selected")

      }
      catch(err){
        this.messageservie.setErrorMessage(err.error.error);
      }


     }
     // get all countries
     getallcountriesshow(tabs,val,signal)
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
  
  
      this.showselectedNumberofcountries(this.selectedtabs,countryid.length +"\xa0"+"Selected")
        if(countryid.length==249)
        {
            this.showselectedNumberofcountries(this.selectedtabs,"All Selected")
            checked=true;
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
        this.showselectedNumberofcountries(this.selectedtabs,"Not Selected")
        checked=false;

  
  
    }
  
  
  
   if(tabs=="Calls")
   {
     this.countrylist_calls=udpatedcountry;
     this.idsof_countries1=countryid;
     this.mob_idsof_countries1=countryid;
     this.callchecked=checked;
     if(signal==1)
     {
      this.callFunctionCharts()
     }
  
   }
   else if(tabs=="Users")
   {
     this.countrylist_chats=udpatedcountry;
     this.idsof_countries2=countryid;
     this.mob_idsof_countries2=countryid;
     this.userchecked=checked;

   if(signal==1)
     {
      this.callFunctionCharts()  
     }
  
   }
   else if(tabs=="Tickets")
   {
     this.countrytlist_ticket=udpatedcountry;
     this.idsof_countries3=countryid;
     this.mob_idsof_countries3=countryid;
     this.visitorchecked=checked;
  
     if(signal==1)
     {
      this.callFunctionCharts()  
     }
     }
  
     }
     // get all languages
     public async getlllangugaes(): Promise<void>{
       const getdata = JSON.parse(localStorage.getItem('gigaaa-user'))
       const accesstoken=getdata.api_token;
       const subsid=getdata.subscription_id?.subsid?.uuid;
       const intid = JSON.parse(localStorage.getItem('intgid'))
       if(intid?.int_id!=null && accesstoken!=null&&subsid!=null)
        {
          await this.Updatelanguageendpoint(accesstoken,subsid,intid.int_id)
        
      }
    
    }
    public async Updatelanguageendpoint(accesstoken:any,subsid:any,intid:any): Promise<void>
    {
      try{
        const languagee=[{name:'Arabic' ,status:false},
        {name:'English' ,status:false},
        {name:'German' ,status:false},
        {name:'Russian' ,status:false},
        {name:'Spanish' ,status:false},
        {name:'Turkish' ,status:false}];
        var  language= await this.gigaaaservice.getAllLanguages(accesstoken,subsid,intid)
        let updatearr = language.map((item, i) => Object.assign({}, item, languagee[i]));
          this.lang=updatearr;
          this.lang1=updatearr;
          this.lang2=updatearr;
          this.lang3=updatearr;
          this.lang3=updatearr;
          this.getalllanguage(true,"Calls",0);
          this.getalllanguage(true,"Users",0);
          this.getalllanguage(true,"Visitors",0);
          this.showselectednumberoflanguages("Calls","All Selected")
          this.showselectednumberoflanguages("Users","All Selected")
          this.showselectednumberoflanguages("Tickets","All Selected")

      }
      catch(err){
        this.messageservie.setErrorMessage(err.error.error)
      }
    }
    //get all country
    
    // get all languages 
    getalllanguage(val,tabs,signal)
    {const intg = JSON.parse(localStorage.getItem('intgid'))
    var int_id=intg?.int_id;
       var udpatedlang=[];
       var languageid=[];
       this.lang.forEach(element=>{
       var index = languageid.indexOf(element.id);
       if (index !== -1) {
         languageid.splice(index, 1);
         }
         })
       if(val==true)
       {
 
     this.lang.forEach(element => {
        udpatedlang.push({name:element.name,status:true,id:element.id})
        languageid.push(element.id)
     });
 
 
 
        this.showselectednumberoflanguages(this.selectedtabs,this.lang.length +"\xa0"+"Selected")
       if(this.lang.length==6)
       {
           this.showselectednumberoflanguages(this.selectedtabs,"All Selected")

       }
 
   }
   else if(val==false){
       this.lang.forEach(element => {
      udpatedlang.push({name:element.name,status:false,id:element.id})
      var index = languageid.indexOf(element.id);
       if (index !== -1) {
         languageid.splice(index, 1);
       }
 
       });
       this.showselectednumberoflanguages(this.selectedtabs,"Not Selected")
 
   }
 
 
 
  if(tabs=="Calls")
  {
    this.lang1=udpatedlang;
    this.idsoflanguages1=languageid;
    this.mob_idsoflanguages1=languageid;
    if(signal!=1)
    {
    
      this.showselectednumberoflanguages(this.selectedtabs,"All Selected")
      this.getcallcharts("this_week",[],[],1000,this.datefrom_call,this.dateto_call);
      this.getUserTotalCard("this_week",[],[],this.datefrom_user,this.dateto_user);
      this.getVisitorTotalCard("this_week",[],[],this.datefrom_visitor,this.dateto_visitor);
      this.getcallstats("this_week",[],[],this.datefrom_call,this.dateto_call);
      this.getDataTimeInterval();
 
    }
 
  }
  else if(tabs=="Users")
  {
    this.lang2=udpatedlang;
    this.idsoflanguages2=languageid;
    this.mob_idsoflanguages2=languageid;
 
  if(signal!=1)
    {
      this.showselectednumberoflanguages(this.selectedtabs,"All Selected")
 
    }
 
  }
  else if(tabs=="Visitors")
  {
    this.lang3=udpatedlang;
    this.idsoflanguages3=languageid;
    this.mob_idsoflanguages3=languageid;
 
    if(signal!=1)
    {
      this.showselectednumberoflanguages(this.selectedtabs,"All Selected")
 
    }
 
  }

 
 
    }
     ngOnInit(): void {
      this.getlistofdashboard("Calls");
      this.onDateChange([this.ranges[2].value[0],this.ranges[2].value[1]],"Calls",0)
      this.onDateChange([this.ranges[2].value[0],this.ranges[2].value[1]],"Users",0)
      this.onDateChange([this.ranges[2].value[0],this.ranges[2].value[1]],"Visitors",0)

      this.getallthecountries();
      this.getlllangugaes();
      this.roundbarchartcorners();
      this.loadcallstatsoninit();
      this.getdashboardDataonLoad();
      this.getdatafrommobilepopup();
  }
  
    getUserTotalCard(timeslot:any,languagesid:Array<any>,countryids:Array<any>,datefrom:string,dateto:string)
    {this.vsForTimeLable_users= this.setVsFunctionForcards(timeslot);
     const getdata = JSON.parse(localStorage.getItem('gigaaa-user'));
     const accesstoken=getdata.api_token;
     const subsid=getdata.subscription_id?.subsid?.uuid;
     const intid = JSON.parse(localStorage.getItem('intgid'));
   
  
      this.gigaaaservice.getUserCountsSession(accesstoken,subsid,intid.int_id,timeslot,languagesid,countryids,datefrom,dateto).subscribe(data=>{
        this.sessionUser=data['count'];
        if(timeslot=="today"||timeslot=="this_week"||timeslot=="this_month"||timeslot=="this_year")
        {
        
        this.sessionUserper=this.getpercentagecalculated(data['increase']);
        this.sessionUserres=this.sessionUserper.cal;
        this.sessionUserper=this.sessionUserper.withsign;  
      }
      },err=>{
        this.messageservie.setErrorMessage(err.error.error);
      })
   
   

  }

// set vs function for cards 

  setVsFunctionForcards(val)
  {
    if(val=="today")
    {
      return "yesterday";
    }
    else if(val=="this_week")
    {
      return "last week";
    }
    else if(val=="this_month")
    {
      return "last month";
    }
    else if(val=="this_year")
    {
      return "last year";
    }
    else 
    {
      return null;
    }
  }
 
  getVisitorTotalCard(timeslot:any,languagesid:Array<any>,countryids:Array<any>,datefrom:string,dateto:string)
    {  
      this.vsForTimeLable_visitors= this.setVsFunctionForcards(timeslot);
      const getdata = JSON.parse(localStorage.getItem('gigaaa-user'));
      const accesstoken=getdata.api_token;
      const subsid=getdata.subscription_id?.subsid?.uuid;
      const intid = JSON.parse(localStorage.getItem('intgid'));
      this.gigaaaservice.getVisitorCountsSession(accesstoken,subsid,intid.int_id,timeslot,languagesid,countryids,datefrom,dateto).subscribe(data=>{
        this.sessionVisitor=data['count'];
        if(timeslot=="today"||timeslot=="this_week"||timeslot=="this_month"||timeslot=="this_year")
        {
        this.sessionVisitorper=this.getpercentagecalculated(data['increase']);
        this.sessionVisitorres=this.sessionVisitorper.cal;
        this.sessionVisitorper=this.sessionVisitorper.withsign;
       }
      },err=>{
        this.messageservie.setErrorMessage(err.error.error);
      })
  
    
  }

  incomingbarchart(data,lebel,anim_val)
    { 
      if (typeof(this.myChart) != "undefined") {
        this.myChart.destroy();
       
        }
      var ctx = document.getElementById("income") as HTMLCanvasElement;
     this.myChart = new Chart(ctx, {
     
        type: 'bar',
        data: {
          labels:lebel,
          datasets: [{
            data:data,
           backgroundColor : 
              "#1C54DB",
            
            hoverBackgroundColor: 
              "#1C54DB"
            ,
            radius:[24],
            hoverRadius:24,
            hitRadius:24,
            borderCapStyle:'round',
            maxBarThickness:65,
            fill: false,
          }],
  
        },
        options: {
          animation:{
            duration: anim_val
              
          },
          responsive: true,
          maintainAspectRatio: false,
          showLines:false,
          layout:{
            padding:{
              bottom:22
            }
          },
          legend:{
            position:'top',
            align:'center',
            display:false
          },
  
           tooltips: {
            enabled: true,
            mode: 'nearest',
            displayColors: false,
  
            callbacks: {
                title: function () {
                    return null;
                },
  
            }
        },
        hover: {
          mode: 'index',
          intersect: false
       },
        scales: {
  
          xAxes: [{
           
              gridLines: {
                  display:false
              },
              ticks:{
                autoSkip:true,
             
              }
  
          },
  
        ],
          yAxes: [{
              gridLines: {
                  display:true,
                  drawBorder: false,
  
              },
              ticks: {
                display: true,
                beginAtZero: true,
                maxTicksLimit: 4,
                padding: 14,
              
  
            },
          }],
  
      }
      }
      });
      this.myChart.update()
 
  }
   // call misses chart
  missedbarchart(data,lebel,anim_val)
  {
    if (typeof(this.myChart1) != "undefined") {
      this.myChart1.destroy();
      }
    var ctx = document.getElementById("missed") as HTMLCanvasElement;
     this.myChart1 = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: lebel,
        datasets: [{
          data:data,
         backgroundColor :
            "#1C54DB"
         ,
          hoverBackgroundColor: 
            "#1C54DB"
         ,
          radius:[24],
          hoverRadius:24,
          hitRadius:24,
          borderCapStyle:'round',
          maxBarThickness:65,
          fill: false,
        }],

      },
      options: {
        animation:{
          duration: anim_val
            
        },
        responsive: true,
        maintainAspectRatio: false,
        showLines:false,
        layout:{
          padding:{
            bottom:24
          }
        },
        legend:{
          position:'top',
          align:'center',
          display:false
        },

         tooltips: {
          enabled: true,
          mode: 'nearest',
          displayColors: false,

          callbacks: {
              title: function () {
                  return null;
              },

          }
      },
      hover: {
        mode: 'index',
        intersect: false
     },
      scales: {

        xAxes: [{
            gridLines: {
                display:false
            },

        },

      ],
        yAxes: [{
            gridLines: {
                display:true,
                drawBorder: false,

            },
            ticks: {
              display: true,
              beginAtZero: true,
              maxTicksLimit: 4,
              padding: 14


          },
        }],

    }
    }
    });
    this.myChart1.update()

  }
  answeredbarchart(data,lebel,anim_val)
  {
    if (typeof(this.myChart2) != "undefined") {
      this.myChart2.destroy();
      }
    var ctx = document.getElementById("answered") as HTMLCanvasElement;
 this.myChart2 = new Chart(ctx, {
      type: 'bar',
      data: {
        labels:lebel,
        datasets: [{
          data:data,
         backgroundColor : 
           "#1C54DB"
          ,
          hoverBackgroundColor: "#1C54DB"
          ,
          radius:[24],
          hoverRadius:24,
          hitRadius:24,
          borderCapStyle:'round',
          maxBarThickness:65,
          fill: false,
        }],

      },
      options: {
        animation:{
          duration: anim_val
            
        },
        responsive: true,
        maintainAspectRatio: false,
        showLines:false,
        layout:{
          padding:{
            bottom:24
          }
        },
        legend:{
          position:'top',
          align:'center',
          display:false
        },

         tooltips: {
          enabled: true,
          mode: 'nearest',
          displayColors: false,

          callbacks: {
              title: function () {
                  return null;
              },

          }
      },
      hover: {
        mode: 'index',
        intersect: false
     },
      scales: {

        xAxes: [{
            gridLines: {
                display:false
            },

        },

      ],
        yAxes: [{
            gridLines: {
                display:true,
                drawBorder: false,

            },
            ticks: {
              display: true,
              beginAtZero: true,
              maxTicksLimit: 4,
              padding: 14


          },
        }],

    }
    }
    });
    this.myChart2.update();
  }
  ansbyaibarchart(data,lebel,anim_val)
  {
    if (typeof(this.myChart3) != "undefined") {
      this.myChart3.destroy();
      }
    var ctx = document.getElementById("ansbyai") as HTMLCanvasElement;
    this.myChart3 = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: lebel,
        datasets: [{
          data:data,
         backgroundColor : "#1C54DB"
          ,
          hoverBackgroundColor: "#1C54DB"
          ,
          radius:[24],
          hoverRadius:24,
          hitRadius:24,
          borderCapStyle:'round',
          maxBarThickness:65,
          fill: false,
        }],

      },
      options: {
        animation:{
          duration: anim_val
            
        },
        responsive: true,
        maintainAspectRatio: false,
        showLines:true,
        layout:{
          padding:{
            bottom:24
          }
        },
        legend:{
          position:'top',
          align:'center',
          display:false
        },

         tooltips: {
          enabled: true,
          mode: 'nearest',
          displayColors: false,

          callbacks: {
              title: function () {
                  return null;
              },

          }
      },
      hover: {
        mode: 'index',
        intersect: false
     },
      scales: {

        xAxes: [{
            gridLines: {
                display:false,
                drawBorder: false,

            },

        },

      ],
        yAxes: [{
            gridLines: {
                display:true,
                drawBorder: false,

            },
            ticks: {
              display: true,
              beginAtZero: true,
              maxTicksLimit: 4,
              padding: 14

          },
        }],

    }
    }
    });
      this.myChart3.update()
  }
  // devices chart
  createdevicechart()
  {
    var ctx = document.getElementById("devicechart") as HTMLCanvasElement;
    var myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Desktop', 'Tablet','Mobile'],
        datasets: [{
          data:[250, 500,250],
          backgroundColor: ['#1C54DB','#715DFF','#6B94F9'],
          borderWidth    : 0

        }],

      },
      options: {
        animation:{
          duration: 0
            
        },
         cutoutPercentage: 48,
        responsive: false,
        tooltips: {
        displayColors: false,

        callbacks: {
          title : () => null // or function () { return null; }
       }
     },

        legend:{
          display:false,
          position:'top'

        },

        legendCallback: function(chart) {
          var text = [];
          text.push('<ul  style="list-style:none">');
          var ds = chart.data.datasets[0];
          for (var i=0; i<ds.data.length; i++) {
            text.push('<li class="roundchartlegend" style="color:#A6A8BA; display:block; width:50%; margin-bottom:20px;">');
            text.push('<span style="background-color:' + ds.backgroundColor[i] + ';color: rgba(22, 39, 65, 0.8); margin-right:12px;height:14px; width:14px;border-radius:50%">' + '</span>' +'<span style="font-size:12px;line-height:14px;vertical-align: text-top;color: rgba(22, 39, 65, 0.8);">' +chart.data.labels[i]+'</span>'+'<span style="display:block;margin-left:25px; color: #162741; font-weight: 500;">'+ds.data[i] + '%'+'</span>');
            text.push('</li>');
          }
          text.push('</ul>');
          return text.join("") ;
        }
      }
    });

    // call visitor

    // generate HTML legend
   $("#devicechartlegend").html(myChart.generateLegend());
  }
  // visitor chart
  visitorchart1(data,lebel,anim_val)
  {  
    if (typeof(this.linechart_visitor2) != "undefined") {
      this.linechart_visitor2.destroy();
      }
    var ctx = document.getElementById("visitortwo") as HTMLCanvasElement;
 this.linechart_visitor2= new Chart(ctx, {
      type: 'line',
      data: {
        labels: lebel,
        datasets: [{
          data: data[1].line1,
          label: 'New Visitors',
          backgroundColor: 'rgba(77,83,96,0.2)',
          borderColor: '#76CB09',
          pointBackgroundColor: '#76CB09',
          pointBorderColor: '#76CB09',
          pointHoverBackgroundColor: '#76CB09',
          pointHoverBorderColor: '#76CB09',
          fill: false,
          lineTension: 0.0

        },
        {
          data:data[1].line2,
          label: 'Returning Visitors',
          backgroundColor: 'rgba(77,83,96,0.2)',
          borderColor: '#F0AD00',
          pointBackgroundColor: '#F0AD00',
          pointBorderColor: '#F0AD00',
          pointHoverBackgroundColor: '#F0AD00',
          pointHoverBorderColor: '#F0AD00',
          fill: false,
          lineTension: 0.0

        }
      ],

      },
      options:{
        animation:{
          duration:anim_val
        },
         responsive: true,
        maintainAspectRatio: false,

        legend:{
          position:"bottom",
          display:false
        },

        scales: {

          xAxes: [{
            offset:true,
              gridLines: {
                  display:false,
                  drawBorder: false,

              },

          },

        ],
          yAxes: [{
              gridLines: {
                  display:true,
                  drawBorder: false,

              },
              ticks: {
                display: true,
                beginAtZero: true,
                maxTicksLimit: 8,
                padding: 14

            },
          }],

      },
      legendCallback: function(chart) {
        var text = [];
        text.push('<ul  style="list-style:none; width:100%; display:block; text-align:center;">');
        var ds = chart.data.datasets;
        for (var i=0; i<ds.length; i++) {
          var clk=ds[i]
          if(i==0)
          {
            text.push('<li style="color:#A6A8BA; display:inline; width:fit-content; margin-right:40px;">');
            text.push('<span style="background-color:' + clk.pointBackgroundColor + ';color: rgba(22, 39, 65, 0.8); margin-right:12px;height:14px; width:14px;border-radius:50%">' + '</span>' +'<span style="font-size:12px;line-height:45px;vertical-align: text-top;color: rgba(22, 39, 65, 0.8);">' +clk.label);
            text.push('</li>');
          }
          else{
            text.push('<li style="color:#A6A8BA; display:inline; width:fit-content;">');
            text.push('<span style="background-color:' + clk.pointBackgroundColor + ';color: rgba(22, 39, 65, 0.8); margin-right:12px;height:14px; width:14px;border-radius:50%">' + '</span>' +'<span style="font-size:12px;line-height:45px;vertical-align: text-top;color: rgba(22, 39, 65, 0.8);">' +clk.label);
            text.push('</li>');
          }

        }
        text.push('</ul>');
        return text.join("") ;
      }}

    });
    $("#visitorcharttwolegends").html(this.linechart_visitor2.generateLegend());

    this.linechart_visitor2.update()
  }
  visitorchart(data:any,labels:Array<any>,anim_val)
  {
    if (typeof(this.linechart_visitor1) != "undefined") {
      this.linechart_visitor1.destroy();
      }
    var ctx = document.getElementById("visitorone") as HTMLCanvasElement;
  this.linechart_visitor1= new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          data: data[0].line1,
          label: 'Visitors',
          backgroundColor: 'rgba(77,83,96,0.2)',
          borderColor: '#1C54DB',
          pointBackgroundColor: '#1C54DB',
          pointBorderColor: '#1C54DB',
          pointHoverBackgroundColor: '#1C54DB',
          pointHoverBorderColor: '#1C54DB',
          fill: false,
          lineTension: 0.0

        },
        {
          data:data[0].line2,
          label: 'Unique Visitors',
          backgroundColor: 'rgba(77,83,96,0.2)',
          borderColor: '#FF155A',
          pointBackgroundColor: '#FF155A',
          pointBorderColor: '#FF155A',
          pointHoverBackgroundColor: '#FF155A',
          pointHoverBorderColor: '#FF155A',
          fill: false,
          lineTension: 0.0

        }
      ],

      },
      options:{ 
        animation:{
          duration: anim_val
            
        },
        responsive: true,
        maintainAspectRatio: false,
      legend:{position:'bottom',
    display:false},
      scales: {

        xAxes: [{
          offset:true,
            gridLines: {
                display:false,
                drawBorder: false,

            },

        },

      ],
        yAxes: [{
            gridLines: {
                display:true,
                drawBorder: false,

            },
            ticks: {
              display: true,
              beginAtZero: true,
              maxTicksLimit: 8,
              padding: 14

          },
        }],

    },
    legendCallback: function(chart) {
      var text = [];
      text.push('<ul  style="list-style:none; width:100%; display:block; text-align:center;">');
      var ds = chart.data.datasets;
      for (var i=0; i<ds.length; i++) {
        var clk=ds[i]
        if(i==0)
        {
          text.push('<li style="color:#A6A8BA; display:inline; width:fit-content; margin-right:40px;">');
          text.push('<span style="background-color:' + clk.pointBackgroundColor + ';color: rgba(22, 39, 65, 0.8); margin-right:12px;height:14px; width:14px;border-radius:50%">' + '</span>' +'<span style="font-size:12px;line-height:45px;vertical-align: text-top;color: rgba(22, 39, 65, 0.8);">' +clk.label);
          text.push('</li>');
        }
        else{
          text.push('<li style="color:#A6A8BA; display:inline; width:fit-content;">');
          text.push('<span style="background-color:' + clk.pointBackgroundColor + ';color: rgba(22, 39, 65, 0.8); margin-right:12px;height:14px; width:14px;border-radius:50%">' + '</span>' +'<span style="font-size:12px;line-height:45px;vertical-align: text-top;color: rgba(22, 39, 65, 0.8);">' +clk.label);
          text.push('</li>');
        }
      }
      text.push('</ul>');
      return text.join("") ;
    }
    }

    });
    $("#visitorchartonelegends").html(this.linechart_visitor1.generateLegend());

    this.linechart_visitor1.update()
  }

  // usercharts
  usercharts(data:any,labels:Array<any>,anim_val)
  {

    
      if (typeof(this.linechart_user1) != "undefined") {
      this.linechart_user1.destroy();
      }
    var ctx = document.getElementById("userchart") as HTMLCanvasElement;
   this.linechart_user1= new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
        {
          data: data.line1,
          label: 'Users',
          backgroundColor: 'rgba(77,83,96,0.2)',
          borderColor: '#FF155A',
          pointBackgroundColor: '#FF155A',
          pointBorderColor: '#FF155A',
          pointHoverBackgroundColor: '#FF155A',
          pointHoverBorderColor: '#FF155A',
          fill: false,
          lineTension: 0.0

        },
        {
          data: data.line2,
          label: 'Unique Users',
          backgroundColor: 'rgba(77,83,96,0.2) ',
          borderColor: '#F0AD00',
          pointBackgroundColor: '#F0AD00',
          pointBorderColor: '#F0AD00',
          pointHoverBackgroundColor: '#F0AD00',
          pointHoverBorderColor: '#F0AD00',
          fill: false,
          lineTension: 0.0

        }
      ],

      },
      options:{ 
        animation:{
          duration: anim_val
            
        },
        responsive: true,
        maintainAspectRatio: false,

        legend:{
          position:"bottom",
          display:false
        },

        scales: {

          xAxes: [{
            offset:true,
              gridLines: {
                  display:false,
                  drawBorder: false,

              },

          },

        ],
          yAxes: [{
            offset:true,
              gridLines: {
                  display:true,
                  drawBorder: false,

              },
              ticks: {
                display: true,
                beginAtZero: true,
                maxTicksLimit: 8,
                padding: 14

            },
          }],

      },
      legendCallback: function(chart) {
        var text = [];
        text.push('<ul  style="list-style:none; width:100%; display:block; text-align:center;">');
        var ds = chart.data.datasets;
        for (var i=0; i<ds.length; i++) {
          var clk=ds[i]
          if(i!=ds.length-1)
          {
            text.push('<li class="roundchartlegend" style="color:#A6A8BA; display:inline; width:fit-content;  margin-right:40px">');
            text.push('<span style="background-color:' + clk.pointBackgroundColor + ';color: rgba(22, 39, 65, 0.8); margin-right:12px;height:14px; width:14px;border-radius:50%">' + '</span>' +'<span style="font-size:12px;line-height:45px;vertical-align: text-top;color: rgba(22, 39, 65, 0.8);">' +clk.label);
            text.push('</li>');
          }
          else{
            text.push('<li class="roundchartlegend" style="color:#A6A8BA; display:inline; width:fit-content;">');
            text.push('<span style="background-color:' + clk.pointBackgroundColor + ';color: rgba(22, 39, 65, 0.8); margin-right:12px;height:14px; width:14px;border-radius:50%">' + '</span>' +'<span style="font-size:12px;line-height:45px;vertical-align: text-top;color: rgba(22, 39, 65, 0.8);">' +clk.label);
            text.push('</li>');
          }

        }
        text.push('</ul>');
        return text.join("") ;
      }}

    });
    $("#userchartlegends").html(this.linechart_user1.generateLegend());

  this.linechart_user1.update()
  }
  // priority ticket
  createprioritticketchart()
  {
    var ctx = document.getElementById("priorityticket") as HTMLCanvasElement;
    var myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Low', 'Medium','High'],
        datasets: [{
          data:[250, 500,250],
          backgroundColor: ['#1C54DB','#715DFF','#6B94F9'],
          borderWidth    : 0

        }],

      },
      options: {
        animation:{
          duration: 0
            
        },
         cutoutPercentage: 48,
        responsive: false,
        tooltips: {
        displayColors: false,

        callbacks: {
          title : () => null // or function () { return null; }
       }
       },

        legend:{
          display:false,
          position:'top'

        },

        legendCallback: function(chart) {
          var text = [];
          text.push('<ul  style="list-style:none">');
          var ds = chart.data.datasets[0];
          for (var i=0; i<ds.data.length; i++) {
            text.push('<li class="roundchartlegend" style="color:#A6A8BA; display:block; width:50%; margin-bottom:20px;">');
            text.push('<span style="background-color:' + ds.backgroundColor[i] + ';color: rgba(22, 39, 65, 0.8); margin-right:12px;height:14px; width:14px;border-radius:50%">' + '</span>' +'<span style="font-size:12px;line-height:14px;vertical-align: text-top;color: rgba(22, 39, 65, 0.8);">' +chart.data.labels[i]+'</span>'+'<span style="display:block;margin-left:25px; color: #162741; font-weight: 500;">'+ds.data[i] + '%'+'</span>');
            text.push('</li>');
          }
          text.push('</ul>');
          return text.join("") ;
        }
      }
    });
    // generate HTML legend
   $("#priorityticketchartlegend").html(myChart.generateLegend());
  }
  // ticket type
  createtickettypechart()
  {
    var ctx = document.getElementById("tickettype") as HTMLCanvasElement;
    var myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Bug', 'Sales','How to','Cancelation','Technical request','Other'],
        datasets: [{
          data:[25, 20,30,25,25],
          backgroundColor: ['#1C54DB','#FF155A','#715DFF','#1E03BF','#6B94F9','#F0AD00'],
          borderWidth    : 0

        }],

      },
      options: {
         cutoutPercentage: 48,
        responsive: false,
        tooltips: {
        displayColors: false,

        callbacks: {
          title : () => null // or function () { return null; }
       }
     },

        legend:{
          display:false,
          position:'top'

        },

        legendCallback: function(chart) {
          var text = [];
          text.push('<ul  style="list-style:none">');
          var ds = chart.data.datasets[0];
          for (var i=0; i<ds.data.length; i++) {
            text.push('<li  class="roundchartlegend" style="color:#A6A8BA; display:inline-block; width:50%; margin-bottom:20px;">');
            text.push('<span style="background-color:' + ds.backgroundColor[i] + ';color: rgba(22, 39, 65, 0.8); margin-right:12px;height:14px; width:14px;border-radius:50%">' + '</span>' +'<span style="font-size:12px;line-height:14px;vertical-align: text-top;color: rgba(22, 39, 65, 0.8);">' +chart.data.labels[i]+'</span>'+'<span style="display:block;margin-left:25px; color: #162741; font-weight: 500;">'+ds.data[i] + '%'+'</span>');
            text.push('</li>');
          }
          text.push('</ul>');
          return text.join("") ;
        }
      }
    });
    // generate HTML legend
   $("#tickettypechartlegend").html(myChart.generateLegend());
  }
   // browser chart
   createbrowerschart()
   {
     var ctx = document.getElementById("browserchart") as HTMLCanvasElement;
     var myChart = new Chart(ctx, {
       type: 'doughnut',
       data: {
         labels: ['Google Chrome', 'Mozzila Firefox','Opera','Safari','Other'],
         datasets: [{
           data: [250,150,250,150,200],
           backgroundColor: ['#1C54DB', '#715DFF','#6B94F9','#FF155A','#1E03BF'],
           borderWidth    : 0

         }]
       },
       options: {
          cutoutPercentage: 48,
         responsive: false,
         tooltips: {
         displayColors: false,

         callbacks: {
           title : () => null // or function () { return null; }
        }
      },

         legend:{
           display:false,

         },

         legendCallback: function(chart) {
           var text = [];
           text.push('<ul  style="list-style:none">');
           var ds = chart.data.datasets[0];
           for (var i=0; i<ds.data.length; i++) {
             text.push('<li class="roundchartlegend" style=" color:#A6A8BA; display:inline-block; width:50%; margin-bottom:20px;">');
             text.push('<span style="background-color:' + ds.backgroundColor[i] + ';color: rgba(22, 39, 65, 0.8); margin-right:12px;height:14px; width:14px;border-radius:50%">' + '</span>' +'<span style="font-size:12px;line-height:14px;vertical-align: text-top;color: rgba(22, 39, 65, 0.8);">' +chart.data.labels[i]+'</span>'+'<span style="display:block;margin-left:25px; color: #162741; font-weight: 500;">'+ds.data[i] + '%'+'</span>');
             text.push('</li>');
           }
           text.push('</ul>');
           return text.join("") ;
         }
       }
     });
     // generate HTML legend
    $("#browserlegend").html(myChart.generateLegend());
   }
// browser chart
createoschart()
{
  var ctx = document.getElementById("oschart") as HTMLCanvasElement;
  var myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Microsoft Windows', 'IOS','Linux','Android'],
      datasets: [{
        data:  [250,500,250,250],
        backgroundColor: ['#1C54DB', '#715DFF','#6B94F9','#FF155A'],
        borderWidth    : 0

      }]
    },
    options: {
       cutoutPercentage: 48,
      responsive: false,
      tooltips: {
      displayColors: false,

      callbacks: {
        title : () => null // or function () { return null; }
     }
   },

      legend:{
        display:false,

      },

      legendCallback: function(chart) {
        var text = [];
        text.push('<ul  style="list-style:none">');
        var ds = chart.data.datasets[0];
        for (var i=0; i<ds.data.length; i++) {
          if(i==1 || i==0)
          {
            text.push('<li  class="roundchartlegend" style="color:#A6A8BA; display:inline-block; width:50%; margin-bottom:20px;">');
            text.push('<span style="background-color:' + ds.backgroundColor[i] + ';color: rgba(22, 39, 65, 0.8); margin-right:12px;height:14px; width:14px;border-radius:50%">' + '</span>' +'<span style="font-size:12px;line-height:14px;vertical-align: text-top;color: rgba(22, 39, 65, 0.8);">' +chart.data.labels[i]+'</span>'+'<span style="display:block;margin-left:25px; color: #162741; font-weight: 500;">'+ds.data[i] + '%'+'</span>');
            text.push('</li>');
          }
          else{
            text.push('<li  class="roundchartlegend" style="color:#A6A8BA; display:block; width:50%; margin-bottom:20px;">');
            text.push('<span style="background-color:' + ds.backgroundColor[i] + ';color: rgba(22, 39, 65, 0.8); margin-right:12px;height:14px; width:14px;border-radius:50%">' + '</span>' +'<span style="font-size:12px;line-height:14px;vertical-align: text-top;color: rgba(22, 39, 65, 0.8);">' +chart.data.labels[i]+'</span>'+'<span style="display:block;margin-left:25px; color: #162741; font-weight: 500;">'+ds.data[i] + '%'+'</span>');
            text.push('</li>');
          }

        }
        text.push('</ul>');
        return text.join("") ;
      }
    }
  });
  // generate HTML legend
 $("#oslegend").html(myChart.generateLegend());
}

     getdashboardDataonLoad()
    { 
      try{
      this.sharedres.submitapplication$.subscribe(data=>{
        this.getlllangugaes();
        this.callFunctionCharts();
    })
    }
    catch(error)
    {
      this.messageservie.setErrorMessage(error);
    }

  }
  // call stats
  getcallstats(timeslot:any,languagesid:Array<any>,countryids:Array<any>,datefrom:String,dateto:String)
  {
    try
    {this.vsForTimeLable_calls= this.setVsFunctionForcards(timeslot);
      const getdata = JSON.parse(localStorage.getItem('gigaaa-user'))
      var accesstoken=getdata?.api_token;
      var orgid=getdata?.subscription_id?.subsid?.uuid
      const intid = JSON.parse(localStorage.getItem('intgid'));

     
      this.gigaaaservice.getcallstatistics(accesstoken,orgid,intid.int_id,timeslot,languagesid,countryids).subscribe(data=>{
        this.answeredbyai=data['handed_to_ai']?.count;
        this.totalmissed=data['missed']?.count;
        this.answered=data['answered']?.count;
        this.totalincoming=data['incoming']?.count;
        if(timeslot=="today"||timeslot=="this_week"||timeslot=="this_month"||timeslot=="this_year")
      {
        this.answeredper =this.getpercentagecalculated(data['answered']?.increase);
        this.answeredbyaiper=this.getpercentagecalculated(data['handed_to_ai']?.increase);
        this.totalmissedper=this.getpercentagecalculated(data['missed']?.increase);
        this.totalincomingper=this.getpercentagecalculated(data['incoming']?.increase);

        this.ansper=this.answeredper?.cal;
        this.ansbyai=this.answeredbyaiper?.cal;
        this.totalmissper=this.totalmissedper?.cal;
        this.totalincper=this.totalincomingper?.cal;

        this.answeredper=this.answeredper?.withsign;
        this.answeredbyaiper=this.answeredbyaiper?.withsign;
        this.totalmissedper=this.totalmissedper?.withsign;
        this.totalincomingper=this.totalincomingper?.withsign;
      }

      },err=>{
        this.messageservie.setErrorMessage(err.error.error);

      })
    }
    
    catch (err){

      this.messageservie.setErrorMessage(err.error.error);
    }

  }
  // users and visitors charts
  getuser_and_call_chart(tabs:any,datefrom:any,dateto:any,languages:Array<any>,countries:Array<any>,anim_val,timeslot:any)
  {
    try{
      const getdata = JSON.parse(localStorage.getItem('gigaaa-user'))
      const intg_id = JSON.parse(localStorage.getItem('intgid'))
      var int_id=intg_id?.int_id;
      var accesstoken=getdata?.api_token;
      var orgid=getdata?.subscription_id?.subsid?.uuid
     
      if(tabs=="Users")
      { this.gigaaaservice.getuserline_Graph_Cards_Data(accesstoken,orgid,int_id,datefrom,dateto,languages,countries,timeslot).subscribe(data=>{
       
        var line_chart;
        line_chart=data;
       
        // total card
        this.totalUser=data['totals']['visits'];
        this.uniqueUser=data['totals']['unique_visitors'];
        if(timeslot=="today"||timeslot=="this_week"||timeslot=="this_month"||timeslot=="this_year")
        {//user cards percent
        this.totalUserper=this.getpercentagecalculated(data['increases']['visits']);
        this.totalUserres=this.totalUserper.cal;
        this.totalUserper=this.totalUserper.withsign
        
        this.uniqueUserper=this.getpercentagecalculated(data['increases']['unique_visitors']);
        this.uniqueUserres=this.uniqueUserper.cal;
        this.uniqueUserper=this.uniqueUserper.withsign
      }

      var dataforlinechart=  this.getlinechartdata(line_chart['dates']);
      var labelforlinechart=this.getlinechartlabel(line_chart['dates']);
      this.usercharts(dataforlinechart,labelforlinechart,anim_val);
      })
      }
      else if(tabs=="Visitors")
      {this.gigaaaservice.getvisitor_Graph_cards_Data(accesstoken,orgid,int_id,datefrom,dateto,languages,countries,timeslot).subscribe(data=>{
        var line_chart;
        line_chart=data;
        
        // total visit
        this.totalVisitor=data['totals']['visits'];
        this.uniqueVisitor=data['totals']['unique_visitors'];

        if(timeslot=="today"||timeslot=="this_week"||timeslot=="this_month"||timeslot=="this_year")
        { // total unique visitor percent
        this.totalVisitorper=this.getpercentagecalculated(data['increases']['visits']);
        this.totalVisitorres=this.totalVisitorper.cal;
        this.totalVisitorper=this.totalVisitorper.withsign

       
        this.uniqueVisitorper=this.getpercentagecalculated(data['increases']['unique_visitors']);
        this.uniqueVisitorres=this.uniqueVisitorper.cal;
        this.uniqueVisitorper=this.uniqueVisitorper.withsign
          }
        var dataforlinechart=  this.getlinechartdata(line_chart['dates']);
        var labelforlinechart=this.getlinechartlabel(line_chart['dates']);
        this.visitorchart(dataforlinechart,labelforlinechart,anim_val);
        this.visitorchart1(dataforlinechart,labelforlinechart,anim_val);
      })
      }
    
     
    }
    catch(err)
    {
      this.messageservie.setErrorMessage(err.error.error);

    }

  }
  //  call charts
  getcallcharts(timeslot:any,languages:Array<any>,countries:Array<any>,anim_val,fromdate:any,todate:any )
  {
    try
    {
      const getdata = JSON.parse(localStorage.getItem('gigaaa-user'))
      const intg_id = JSON.parse(localStorage.getItem('intgid'))
      var int_id=intg_id?.int_id;
      var accesstoken=getdata?.api_token;
      var orgid=getdata?.subscription_id?.subsid?.uuid
        this.gigaaaservice.getcallchart(accesstoken,orgid,int_id,timeslot,languages,countries,fromdate,todate).subscribe(data=>{
      var dataforincoming=this.getbarchartdata(data['incoming']);
      var dataforincoming1=this.getbarchartdata(data['missed']);
      var dataforincoming2=this.getbarchartdata(data['handed_to_ai']);
      var dataforincoming3=this.getbarchartdata(data['answered']);

      var labelforincoming=this.getbarchartlabels(data['incoming'],data['num_bars']);
      var labelforincoming1=this.getbarchartlabels(data['missed'],data['num_bars']);
      var labelforincoming2=this.getbarchartlabels(data['handed_to_ai'],data['num_bars']);
      var labelforincoming3=this.getbarchartlabels(data['incoming'],data['num_bars']);

      this.incomingbarchart(dataforincoming,labelforincoming,anim_val);
      this.missedbarchart(dataforincoming1,labelforincoming1,anim_val);
      this.ansbyaibarchart(dataforincoming2,labelforincoming2,anim_val);
      this.answeredbarchart(dataforincoming3,labelforincoming3,anim_val);

        })
    }
    catch (err){
    
      this.messageservie.setErrorMessage(err.error.error);
    }

  }
  // get line chart data 
  getlinechartdata(val:Array<any>)
  {
    var line1=[];
    var line2=[];
    var line3=[];
    var line4=[];
    var line5=[];
    var line6=[];
    if(this.selectedtabs=="Users")
    {
      val.forEach(element => {
        line1.push(element.num_users.visits);
        line2.push(element.num_users.unique_visitors);
      });
      return {line1:line1,line2:line2};
    }
    else  if(this.selectedtabs=="Visitors")
      {
      val.forEach(element => {
        line3.push(element.num_users.visits);
        line4.push(element.num_users.unique_visitors);
        line5.push(element.num_users.first_time_visits);
        line6.push(element.num_users.returning_visits);
      });
      return [{line1:line3,line2:line4}, {line1:line5,line2:line6}];
    }


  }
  // get line chart label
  getlinechartlabel(val:Array<any>)
  {

    var label=[]
    val.forEach(element=> {
    var date =new Date(element.date).toDateString();
    var update= date.substring(0, date.length-4);

   if(val.length==7 )
    {
      if(this.rangeSelected=="this_week"||this.rangeSelected=="last_week")
      {
        label.push(update[0])
      }
      else{
        label.push(update.substring(4))

      }
    }
    else if(val.length>12)
    { 
      if(this.rangeSelected=="last_month"||this.rangeSelected=="this_month")
      {
        label.push(update.substring(4))
      }
      else {
        label.push(update.substring(4))
      }
   
    }
    else if(val.length==12 && this.rangeSelected=="last_year"||this.rangeSelected=="this_year")
    {
     label.push(update.substring(4,7))
     }
    else{
      label.push(update.substring(4))

     }

    });
    return label;
  }
  // get bar chart data
  getbarchartdata(val:Array<any>)
  {
    var data=[]
    val.forEach(element => {
      if(element.count==null)
      {
        data.push(0)
      }
      else
      {
        data.push(element.count)

      }
    });
    return data;
  }
  getbarchartlabels(val:Array<any>,numberofBars:any)
  {
    var label=[]
    val.forEach(element=> {
    var date =new Date(element.date).toDateString();
    var update= date.substring(0, date.length-4);

    if(numberofBars==1)
    {
      label.push(update)
    }
    else if(numberofBars==7)
    {
      if(this.rangeSelected=="this_week"||this.rangeSelected=="last_week"){
      label.push(update[0])
    }
    else 
    {
      label.push(update.substring(4))

    }
    }
    else if(numberofBars>12)
    { if(this.rangeSelected=="last_month"||this.rangeSelected=="this_month"){
        label.push(update.substring(4))
    }
    }
    else if(numberofBars==12)
    {
      if(this.rangeSelected=="last_year"||this.rangeSelected=="this_year")
      {
        label.push(update.substring(4,7))

      }
    }

    });
    return label;
  }
  getpercentagecalculated(val)
  {var calculated;
    if(val!=null)
    {
      calculated=(val*100).toFixed(2);
      if(calculated>0)
      {
        return {cal:calculated,withsign:'\xa0'+'+'+'\xa0'+calculated};

      }
      else{     

        return {cal:calculated,withsign:'\xa0'+calculated};
      }
    }
    else{
      
      return {cal:0,withsign:'\xa0'+0};
    }
  }

  loadcallstatsoninit()
  {
    setTimeout(() => {
      const intg_id = JSON.parse(localStorage.getItem('intgid'))
      if(intg_id?.int_id!=null)
      {
    //  this.getcallstats()

      }
    },500)

  }

  generatecircleround()
  {Chart.defaults.doughnut    = Chart.helpers.clone(Chart.defaults.doughnut);

    Chart.controllers.doughnut = Chart.controllers.doughnut.extend({
      draw: function(ease) {
          var ctx           = this.chart.ctx;
          var easingDecimal = ease || 1;
          var arcs          = this.getMeta().data;
          Chart.helpers.each(arcs, function(arc, i) {
              arc.transition(easingDecimal).draw();

              var pArc   = arcs[i === 0 ? arcs.length - 1 : i - 1];
              var pColor = pArc._view.backgroundColor;

              var vm         = arc._view;
              var radius     = (vm.outerRadius + vm.innerRadius) / 2;
              var thickness  = (vm.outerRadius - vm.innerRadius) / 2;
              var startAngle = Math.PI - vm.startAngle - Math.PI / 2;
              var angle      = Math.PI - vm.endAngle - Math.PI / 2;

              ctx.save();
              ctx.translate(vm.x, vm.y);

              ctx.fillStyle = i === 0 ? vm.backgroundColor : pColor;
              ctx.beginPath();
              ctx.arc(radius * Math.sin(startAngle), radius * Math.cos(startAngle), thickness, 0, 2 * Math.PI);
              ctx.fill();

              ctx.fillStyle = vm.backgroundColor;
              ctx.beginPath();
              ctx.arc(radius * Math.sin(angle), radius * Math.cos(angle), thickness, 0, 2 * Math.PI);
              ctx.fill();

              ctx.restore();
          });
      }
  });
  }
  roundbarchartcorners()
  {
   Chart['elements'] .Rectangle.prototype.draw = function() {
     var ctx = this._chart.ctx;
     var vm = this._view;
     var left, right, top, bottom, signX, signY, borderSkipped, radius;
     var borderWidth = vm.borderWidth;
     var cornerRadius = 4;

     if (!vm.horizontal) {
         // bar
         left = vm.x - vm.width / 2;
         right = vm.x + vm.width / 2;
         top = vm.y;
         bottom = vm.base;
         signX = 1;
         signY = bottom > top? 1: -1;
         borderSkipped = vm.borderSkipped || 'bottom';
     } else {
         // horizontal bar
         left = vm.base;
         right = vm.x;
         top = vm.y - vm.height / 2;
         bottom = vm.y + vm.height / 2;
         signX = right > left? 1: -1;
         signY = 1;
         borderSkipped = vm.borderSkipped || 'left';
     }

     // Canvas doesn't allow us to stroke inside the width so we can
     // adjust the sizes to fit if we're setting a stroke on the line
     if (borderWidth) {
         // borderWidth shold be less than bar width and bar height.
         var barSize = Math.min(Math.abs(left - right), Math.abs(top - bottom));
         borderWidth = borderWidth > barSize? barSize: borderWidth;
         var halfStroke = borderWidth / 2;
         // Adjust borderWidth when bar top position is near vm.base(zero).
         var borderLeft = left + (borderSkipped !== 'left'? halfStroke * signX: 0);
         var borderRight = right + (borderSkipped !== 'right'? -halfStroke * signX: 0);
         var borderTop = top + (borderSkipped !== 'top'? halfStroke * signY: 0);
         var borderBottom = bottom + (borderSkipped !== 'bottom'? -halfStroke * signY: 0);
         // not become a vertical line?
         if (borderLeft !== borderRight) {
             top = borderTop;
             bottom = 0;
         }
         // not become a horizontal line?
         if (borderTop !== borderBottom) {
             left = borderLeft;
             right = borderRight;
         }
     }

     ctx.beginPath();
     ctx.fillStyle = vm.backgroundColor;
     ctx.strokeStyle = vm.borderColor;
     ctx.lineWidth = borderWidth;

     // Corner points, from bottom-left to bottom-right clockwise
     // | 1 2 |
     // | 0 3 |
     var corners = [
         [left, bottom],
         [left, top],
         [right, top],
         [right, bottom]
     ];

     // Find first (starting) corner with fallback to 'bottom'
     var borders = ['bottom', 'left', 'top', 'right'];
     var startCorner = borders.indexOf(borderSkipped, 0);
     if (startCorner === -1) {
         startCorner = 0;
     }

     function cornerAt(index) {
         return corners[(startCorner + index) % 4];
     }

     // Draw rectangle from 'startCorner'
     var corner = cornerAt(0);
     ctx.moveTo(corner[0], corner[1]);

     for (var i = 1; i < 4; i++) {
         corner = cornerAt(i);
       var  nextCornerId = i+1;
         if(nextCornerId == 4){
             nextCornerId = 0
         }

         var nextCorner = cornerAt(nextCornerId);

         var width = corners[2][0] - corners[1][0];
         var height = corners[0][1] - corners[1][1];
         var x = corners[1][0];
         var y = corners[1][1];

          radius = cornerRadius;

         // Fix radius being too large
         if(radius > height/2){
             radius = height/2;
         }if(radius > width/2){
             radius = width/2;
         }

         ctx.moveTo(x + radius, y);
         ctx.lineTo(x + width - radius, y);
         ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
         ctx.lineTo(x + width, y + height - radius);
         ctx.quadraticCurveTo(x + width, y + height, x + width - 0, y + height);
         ctx.lineTo(x + radius, y + height);
         ctx.quadraticCurveTo(x, y + height, x, y + height - 0);
         ctx.lineTo(x, y + radius);
         ctx.quadraticCurveTo(x, y, x + radius, y);

     }

     ctx.fill();
     if (borderWidth) {
         ctx.stroke();
     }
 };
  }

  // apply date filter 
  ApplyDateFilter()
  {
    this.callFunctionCharts();

  }
  //selectionpanel for selecting the panes
  onDateChange(event: Array<Date>,tabsname:any,val:any)
      {
        var ismatched=false;
        var d = new Date(event[0])
        var d1 = new Date(event[1])
        var date1 = new Date(event[0])
        var date2 = new Date(event[1])
        date1.setHours(0,0,0,0)
       var userTimezoneOffset = date1.getTimezoneOffset() * 60000;
       var userTimezoneOffset1 = date2.getTimezoneOffset() * 60000;
 
       date1= new Date(date1.getTime() - userTimezoneOffset);
       date2.setHours(23,59,59,0);
       date2= new Date(date2.getTime() - userTimezoneOffset1);
       this.date_one_selected=date1.toISOString();
       this.date_two_selected=date2.toISOString();
       
       this.firstDate=date1;
       this.lastDate=date2;
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
         var dateEnd= [day1,month1,year1].join('/');
        
         this.ranges.filter(x=>{
 
 
       if(x.value[0].toDateString()==d.toDateString()&&x.value[1].toDateString()==d1.toDateString())
       {
            this.rangeSelected=x.timeslot;
 
          if(tabsname=="Calls" )
          { 
           
            var  dateStart_calls=[year,month,day].join('-');
        this.datefrom_call=dateStart_calls;

        var  dateend_calls=[year1,month1,day1].join('-');
        this.dateto_call=dateend_calls;

            this.charttimeslot1=x.timeslot;
             this.rangeSelected1=x.label
             this.datepreviewstart_calls=dateStart;
             this.datepreviewend_calls=dateEnd;
             if(val==1){
              // this.gigaaasocketapi.send_daterange_params({tab:tabsname,start_date:date1.toISOString(),end_date:date2.toISOString()})
 
             }
 
          }
          else if(tabsname=="Users" )
          {     
            var  dateStart_user_vistor=[year,month,day].join('-');
            this.datefrom_user=dateStart_user_vistor;
            var  dateend_user_vistor=[year1,month1,day1].join('-');
            this.dateto_user=dateend_user_vistor;

            this.charttimeslot2=x.timeslot;
            this.rangeSelected2=x.label
            this.datepreviewstart_chats=dateStart;
            this.datepreviewend_chats=dateEnd;
           if(val==1){
            // this.gigaaasocketapi.send_daterange_params({tab:tabsname,start_date:date1.toISOString(),end_date:date2.toISOString()})
 
           }
 
          }
          else if(tabsname=="Visitors" )
          {
            var  dateStart_user_vistor=[year,month,day].join('-');
            this.datefrom_visitor=dateStart_user_vistor;
            var  dateend_user_vistor=[year1,month1,day1].join('-');
            this.dateto_visitor=dateend_user_vistor;

            this.charttimeslot3=x.timeslot;                      
            this.rangeSelected3=x.label
           this.datepreviewstart_tickets=dateStart;
           this.datepreviewend_tickets=dateEnd;
           if(val==1){
            // this.gigaaasocketapi.send_daterange_params({tab:tabsname,start_date:date1.toISOString(),end_date:date2.toISOString()})
 
           }
 
          }
          ismatched=true;
          //this.bsValue=[x.value[0].toDateString(),x.value[0].toDateString()],
            $('.btn').addClass('.selected');
 
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
        var dateEnd= [day1,month1,year1].join('/');
      
        if(tabsname=="Calls")
        { 
          this.charttimeslot1="custom";

          var  dateStart_calls=[year,month,day].join('-');
        this.datefrom_call=dateStart_calls;

        var  dateend_calls=[year1,month1,day1].join('-');
        this.dateto_call=dateend_calls;

         this.rangeSelected1= dateStart+ " -"+ dateEnd;
         this.datepreviewstart_calls=dateStart;
          this.datepreviewend_calls=dateEnd;
          if(val==1)
          {
         //  this.gigaaasocketapi.send_daterange_params({tab:tabsname,start_date:date1.toISOString(),end_date:date2.toISOString()})
 
          }
       }
        else if(tabsname=="Users")
        { 
          this.charttimeslot2="custom";
          this.rangeSelected2= dateStart+ " -"+ dateEnd;
            var  dateStart_user_vistor=[year,month,day].join('-');
            this.datefrom_user=dateStart_user_vistor;
            var  dateend_user_vistor=[year1,month1,day1].join('-');
            this.dateto_user=dateend_user_vistor;

         this.datepreviewstart_chats=dateStart;
         this.datepreviewend_chats=dateEnd;
    
         if(val==1)
         {
        // this.gigaaasocketapi.send_daterange_params({tab:tabsname,start_date:date1.toISOString(),end_date:date2.toISOString()})
 
         }
 
       }
       else if(tabsname=="Visitors")
       {          
        this.charttimeslot3="custom";
        this.rangeSelected3= dateStart+ " -"+ dateEnd;

        var  dateStart_user_vistor=[year,month,day].join('-');
        var  dateend_user_vistor=[year1,month1,day1].join('-');
        this.datefrom_visitor=dateStart_user_vistor;
        this.dateto_visitor=dateend_user_vistor; 
        this.datepreviewstart_tickets=dateStart;
        this.datepreviewend_tickets=dateEnd;
        if(val==1)
        {
       // this.gigaaasocketapi.send_daterange_params({tab:tabsname,start_date:date1.toISOString(),end_date:date2.toISOString()})

        }

      }
 
      }
 
  }
 }
 // select languages one by one
 selectcountryonebyone(e,id)
 {
   if(this.selectedtabs=="Calls")
   {
    if(e==true)
    { var objIndex = this.countrylist_calls.findIndex((obj => obj.id == id));

      this.countrylist_calls[objIndex].status = true;
     this.idsof_countries1.push(id);
     if(this.idsof_countries1.length==249)
     {
      this.showselectedNumberofcountries(this.selectedtabs,"All Selected")
     this.callchecked=true;
     this.callFunctionCharts();
     }
     else{
      this.showselectedNumberofcountries(this.selectedtabs,this.idsof_countries1.length +"\xa0"+"Selected")
     }

   }
   else if(e==false)
   { var objIndex = this.countrylist_calls.findIndex((obj => obj.id == id));

    this.countrylist_calls[objIndex].status = false;
    var index = this.idsof_countries1.indexOf(id);
    if (index !== -1) {
      this.idsof_countries1.splice(index, 1);
    }
    if(this.idsof_countries1.length==0)
    {
     this.showselectedNumberofcountries(this.selectedtabs,"Not Selected")
    }
    else{
     this.showselectedNumberofcountries(this.selectedtabs,this.idsof_countries1.length +"\xa0"+"Selected")
    }
    this.callchecked=false;

   // this.getcallcharts(this.charttimeslot1,this.idsoflanguages1,this.idsof_countries1,1000);
   this.callFunctionCharts();
  }
   }
   else if(this.selectedtabs=="Users")
   {
    if(e==true)
  { var objIndex = this.countrylist_chats.findIndex((obj => obj.id == id));

    this.countrylist_chats[objIndex].status = true;
   this.idsof_countries2.push(id);
   if(this.idsof_countries2.length==249)
   {
    this.showselectedNumberofcountries(this.selectedtabs,"All Selected");
    this.userchecked=true;
  this.callFunctionCharts();
   }
   else{
    this.showselectedNumberofcountries(this.selectedtabs,this.idsof_countries2.length +"\xa0"+"Selected")

   }

 }
 else if(e==false)
 { var objIndex = this.countrylist_chats.findIndex((obj => obj.id == id));

  this.countrylist_chats[objIndex].status = false;
  var index = this.idsof_countries2.indexOf(id);
  if (index !== -1) {
    this.idsof_countries2.splice(index, 1);
  }

  if(this.idsof_countries2.length==0)
  {
  this.showselectedNumberofcountries(this.selectedtabs,"Not Selected")
  }
  else{
   this.showselectedNumberofcountries(this.selectedtabs,this.idsof_countries2.length +"\xa0"+"Selected")
  }
  this.userchecked=false;
  this.callFunctionCharts();
 }

   }
   else if(this.selectedtabs=="Visitors")
   {
    if(e==true)
    { var objIndex = this.countrytlist_ticket.findIndex((obj => obj.id == id));

      this.countrytlist_ticket[objIndex].status = true;
     this.idsof_countries3.push(id);
     if(this.idsof_countries3.length==249)
     {
      this.showselectedNumberofcountries(this.selectedtabs,"All Selected");
      this.visitorchecked=true;
      this.callFunctionCharts();
    }
     else{
      this.showselectedNumberofcountries(this.selectedtabs,this.idsof_countries3.length +"\xa0"+"Selected")
     }
    }
   else if(e==false)
   { var objIndex = this.countrytlist_ticket.findIndex((obj => obj.id == id));

    this.countrytlist_ticket[objIndex].status = false;
    var index = this.idsof_countries3.indexOf(id);
    if (index !== -1) {
      this.idsof_countries3.splice(index, 1);

    }

    if(this.idsof_countries3.length==0)
    {
     this.showselectedNumberofcountries(this.selectedtabs,"Not Selected")
    }
    else{
     this.showselectedNumberofcountries(this.selectedtabs,this.idsof_countries3.length +"\xa0"+"Selected")
    }
    this.visitorchecked=false;
    this.callFunctionCharts();
    }   
   }
   }
    // select languages one by one
    selectlanguageonebyone(e,id)
    {
      if(this.selectedtabs=="Calls")
      {
       if(e==true)
       { var objIndex = this.lang1.findIndex((obj => obj.id == id));
 
         this.lang1[objIndex].status = true;
        this.idsoflanguages1.push(id);
        if(this.idsoflanguages1.length==6)
        {
         this.showselectednumberoflanguages(this.selectedtabs,"All Selected")
        // this.getcallcharts(this.charttimeslot1,[],this.idsof_countries1,1000);
        this.callFunctionCharts();
        }
        else{
         this.showselectednumberoflanguages(this.selectedtabs,this.idsoflanguages1.length +"\xa0"+"Selected")
        }
 
      }
      else if(e==false)
      { var objIndex = this.lang1.findIndex((obj => obj.id == id));
 
       this.lang1[objIndex].status = false;
       var index = this.idsoflanguages1.indexOf(id);
       if (index !== -1) {
         this.idsoflanguages1.splice(index, 1);
       }
       if(this.idsoflanguages1.length==0)
       {
        this.showselectednumberoflanguages(this.selectedtabs,"Not Selected")
       }
       else{
        this.showselectednumberoflanguages(this.selectedtabs,this.idsoflanguages1.length +"\xa0"+"Selected")
       }
       //this.getcallcharts(this.charttimeslot1,this.idsoflanguages1,this.idsof_countries1,1000);
       this.callFunctionCharts();
 
      }
 
      }
      else if(this.selectedtabs=="Users")
      {
       if(e==true)
     { var objIndex = this.lang2.findIndex((obj => obj.id == id));
 
       this.lang2[objIndex].status = true;
      this.idsoflanguages2.push(id);
      if(this.idsoflanguages2.length==6)
      {
       this.showselectednumberoflanguages(this.selectedtabs,"All Selected")
      // this.getuser_and_call_chart("Users",this.datefrom_user,this.dateto_user,[],this.idsof_countries2,1000);
      this.callFunctionCharts();
      }
      else{
       this.showselectednumberoflanguages(this.selectedtabs,this.idsoflanguages2.length +"\xa0"+"Selected")
 
      }

 
    }
    else if(e==false)
    { var objIndex = this.lang2.findIndex((obj => obj.id == id));
 
     this.lang2[objIndex].status = false;
     var index = this.idsoflanguages2.indexOf(id);
     if (index !== -1) {
       this.idsoflanguages2.splice(index, 1);
     }
 
     if(this.idsoflanguages2.length==0)
     {
     this.showselectednumberoflanguages(this.selectedtabs,"Not Selected")
     }
     else{
      this.showselectednumberoflanguages(this.selectedtabs,this.idsoflanguages2.length +"\xa0"+"Selected")
     }
    // this.getuser_and_call_chart("Users",this.datefrom_user,this.dateto_user,this.idsoflanguages2,this.idsof_countries2,1000);
    this.callFunctionCharts();
 
    }
 
      }
      else if(this.selectedtabs=="Visitors")
      {
       if(e==true)
       { var objIndex = this.lang3.findIndex((obj => obj.id == id));
 
         this.lang3[objIndex].status = true;
        this.idsoflanguages3.push(id);
        if(this.idsoflanguages3.length==6)
        {
          this.showselectednumberoflanguages(this.selectedtabs,"All Selected")
         // this.getuser_and_call_chart("Visitors",this.datefrom_visitor,this.dateto_visitor,[],this.idsof_countries3,1000);
         this.callFunctionCharts();
        }
        else{
         this.showselectednumberoflanguages(this.selectedtabs,this.idsoflanguages3.length +"\xa0"+"Selected")
        }
      }
      else if(e==false)
      { var objIndex = this.lang3.findIndex((obj => obj.id == id));
 
       this.lang3[objIndex].status = false;
       var index = this.idsoflanguages3.indexOf(id);
       if (index !== -1) {
         this.idsoflanguages3.splice(index, 1);
 
       }
 
       if(this.idsoflanguages3.length==0)
       {
        this.showselectednumberoflanguages(this.selectedtabs,"Not Selected")
       }
       else{
        this.showselectednumberoflanguages(this.selectedtabs,this.idsoflanguages3.length +"\xa0"+"Selected")
       }
      // this.getuser_and_call_chart("Visitors",this.datefrom_visitor,this.dateto_visitor,this.idsoflanguages3,this.idsof_countries3,1000);
      this.callFunctionCharts();
       }
      }
      }
        // selected number of languages 
        showselectednumberoflanguages(val,selectedlanguages)
        {
          if(val=="Calls")
          {
          this.selectedlanguages_calls=selectedlanguages;
          }
          else if(val=="Users")
          {
            this.selectedlanguages_chats=selectedlanguages;

          }
          else if(val=="Tickets")
          {
            this.selectedlanguages_tickets=selectedlanguages;

          }
          
        }

         // selected number of languages 
         showselectedNumberofcountries(val,selectedlanguages)
         {
           if(val=="Calls")
           {
           this.selectedcountries_calls=selectedlanguages;
           }
           else if(val=="Users")
           {
             this.selectedcountries_chats=selectedlanguages;
 
           }
           else if(val=="Tickets")
           {
             this.selectedcountries_tickets=selectedlanguages;
 
           }
           
         }
   // canceldaterange()
      canceldaterange()
      {
        this.onDateChange([this.ranges[0].value[0],this.ranges[0].value[1]],'calls',0)

      }

      // open mobile filterpopups
      openmobilefilterpopup()
      {
        let data;
        if(this.selectedtabs=="Calls")
        {
       
         data={dashboard_name:this.selectedtabs,country_ids:this.mob_idsof_countries1,languages_id:this.mob_idsoflanguages1,rangeSelected:this.mob_chart_slot1,
          start_date:this.mob_date_from_chat,end_date:this.mob_date_to_chat}
     
        }
        else if(this.selectedtabs=="Users")
        {
      
         data={dashboard_name:this.selectedtabs,country_ids:this.mob_idsof_countries2,languages_id:this.mob_idsoflanguages2,rangeSelected:this.mob_chart_slot2,
        start_date:this.mob_date_from_user,end_date:this.mob_date_to_user}
     
        }
        else if(this.selectedtabs=="Visitors")
        {
     
         data={dashboard_name:this.selectedtabs,country_ids:this.mob_idsof_countries3,languages_id:this.mob_idsoflanguages3,rangeSelected:this.mob_chart_slot3,
          start_date:this.mob_date_from_visitor,end_date:this.mob_date_to_visitor}
      
        }
       
        this.dialog.open(MobilefilterspopupComponent,{
          data:data,
          hasBackdrop:true,
          panelClass:"mobilefilter-form-container",
          backdropClass:"backdropBackgroundPopups",
          disableClose:true,
        });
      }

      // get data from mobile popup
      getdatafrommobilepopup()
      {
           this.sharedres.sendparamfromdashboardpopup$.subscribe(data=>{
            this.rangeSelected=data.daterangeslot;
          if(data.dashboard_name=="Calls")
          {
           
            this.getMobileChar_calls(data)            
            this.mob_idsoflanguages1=data.languageids;
            this.mob_idsof_countries1=data.countryids;
            this.idsoflanguages1=this.mob_idsoflanguages1;
            this.idsof_countries1=this.mob_idsof_countries1;
            this.mob_chart_slot1=data.daterangetab;
            this.mob_date_from_chat=data.fromdate;
            this.mob_date_to_chat=data.todate;
            this.charttimeslot1=data.daterangeslot;

          }
          else   if(data.dashboard_name=="Users")
          {     

            this.mob_idsoflanguages2=data.languageids;
            this.mob_idsof_countries2=data.countryids;
            this.idsoflanguages2=this.mob_idsoflanguages2;
            this.idsof_countries2=this.mob_idsof_countries2;
            this.mob_chart_slot2=data.daterangetab;
            this.mob_date_from_user=data.fromdate;
            this.mob_date_to_user=data.todate
            this.rangeSelected2=data.daterangeslot;
            this.charttimeslot2=this.rangeSelected2;
            this.getMobileCardUser(data);
            this.getMobileChar_user_visitor(data);


          }
          else   if(data.dashboard_name=="Visitors")
          {     
            this.mob_idsoflanguages3=data.languageids;
            this.mob_idsof_countries3=data.countryids;
            this.idsoflanguages1=this.mob_idsoflanguages3;
            this.idsof_countries1=this.mob_idsof_countries3;
            this.mob_chart_slot3=data.daterangetab;
            this.mob_date_from_visitor=data.fromdate;
            this.mob_date_to_visitor=data.todate
            this.rangeSelected3=data.daterangeslot;
            this.charttimeslot3=this.rangeSelected3;

            this.getMobileCardVisitor(data);
            this.getMobileChar_user_visitor(data);
            
          }
        })
      }
      // mobile param for charts for user and visitors
      getMobileChar_user_visitor(data:any)
      {
        if(data.languageids.length==6 && data.countryids.length==249)
        {
          this.getuser_and_call_chart(data.dashboard_name,data.fromdate,data.todate,[],[],1000,data.daterangeslot);
         


        }
        else if(data.languageids.length==6){

          this.getuser_and_call_chart(data.dashboard_name,data.fromdate,data.todate,[],data.countryids,1000,data.daterangeslot);

        }
        else if(data.countryids.length==249)
        {
          this.getuser_and_call_chart(data.dashboard_name,data.fromdate,data.todate,[],data.countryids,1000,data.daterangeslot);

        }

    
      }
      // mobiel params for calls charts

      getMobileChar_calls(data:any)
      {
        if(data.languageids.length==6 && data.countryids.length==249)
        {
          this.getcallcharts(data.daterangeslot,[],[],1000,data.fromdate,data.todate);
          this.getcallstats(data.daterangeslot,[],[],data.fromdate,data.todate);


        }
        else if(data.languageids.length==6){

          this.getcallcharts(data.daterangeslot,[],data.countryids,1000,data.fromdate,data.todate);
          this.getcallstats(data.daterangeslot,[],data.countryids,data.fromdate,data.todate);


        }
        else if(data.countryids.length==249)
        {
          this.getcallcharts(data.daterangeslot,data.languageids,[],1000,data.fromdate,data.todate);
          this.getcallstats(data.daterangeslot,data.languageids,[],data.fromdate,data.todate);

        }
        else{
          this.getcallcharts(data.daterangeslot,data.languageids,data.countryids,1000,data.fromdate,data.todate);
          this.getcallstats(data.daterangeslot,data.languageids,data.countryids,data.fromdate,data.todate);
        }
        this.vsForTimeLable_calls=this.setVsFunctionForcards(data.daterangeslot);
     
      }
            // mobile cards data from mobile version visitors

      getMobileCardVisitor(data:any)
      {
       
          if(data.languageids.length==6 && data.countryids.length==249)
          {          
            this.getVisitorTotalCard(data.daterangeslot,[],[],data.fromdate,data.todate);
          }
          else if(data.languageids.length==6)
          {
            this.getVisitorTotalCard(data.daterangeslot,[],data.countryids,data.fromdate,data.todate);
          }
          else if(data.countryids.length==249)
          {
            this.getVisitorTotalCard(data.daterangeslot,data.languageids,[],data.fromdate,data.todate);
  
          }
          else{
            this.getVisitorTotalCard(data.daterangeslot,data.languageids,data.countryids,data.fromdate,data.todate);
  
          }
          this.vsForTimeLable_visitors=     this.setVsFunctionForcards(data.daterangeslot);
       
        
      }
      // mobile cards data from mobile version users
         getMobileCardUser(data:any)
         {
          if(data.languageids.length==6 && data.countryids.length==249)
          {
            this.getUserTotalCard(data.daterangeslot,[],[],data.fromdate,data.todate);
          
  
          }
          else if(data.languageids.length==6)
          {
            this.getUserTotalCard(data.daterangeslot,[],data.countryids,data.fromdate,data.todate);
  
          }
          else if(data.countryids.length==249)
          {
            this.getUserTotalCard(data.daterangeslot,this.idsoflanguages2,[],data.fromdate,data.todate);
  
  
          }
          else
          {
            this.getUserTotalCard(data.daterangeslot,data.languageids,data.countryids,data.fromdate,data.todate);
  
          }
          this.vsForTimeLable_users=   this.setVsFunctionForcards(data.daterangeslot);
      
      }
      ngOnDestroy() {
        if (this.chartInterval_id) {
          clearInterval(this.chartInterval_id);
        }
      }
      // search country list
      search(term:string,field:Array<any>) {  

         var result=this.countrylist.filter((obj ,i)=> {
          if(obj['name']!=null)
          {
           return obj['name'].toLowerCase().includes(term.toLowerCase());
          }
          else  if(obj['name']==null)
          {
            return obj['name'].toLowerCase().includes(term.toLowerCase());
          }
        });
        console.log(result);
        if(this.selectedtabs=="Calls")
        {
          this.countrylist_calls=result;
        }
        else if(this.selectedtabs=="Users")
        { 
          this.countrylist_chats=result;
        }
        else if(this.selectedtabs=="Visitors")
        { 
            this.countrytlist_ticket=result
        }
       }
}
function diff(diff: any): string | number | Date {
  throw new Error('Function not implemented.');
}

