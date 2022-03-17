import { ViewportScroller } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CarouselComponent, CarouselConfig, CarouselModule } from 'ngx-bootstrap/carousel';
import { add, defineLocale, enGbLocale } from 'ngx-bootstrap/chronos';
import { BsDaterangepickerDirective, BsLocaleService } from 'ngx-bootstrap/datepicker';
// import { off } from 'node:process';
import { element, promise } from 'protractor';
import { interval, Subject } from 'rxjs';
import { GigaaaApiService } from 'src/app/service/gigaaaapi.service';
import { gigaaasocketapi } from 'src/app/service/gigaaasocketapi.service';
import { MessageService } from 'src/app/service/messege.service';
import { sharedres_service } from 'src/app/service/sharedres.service';
import { webrtcsocket } from 'src/app/service/webrtcsocket';
import { CallInterfaceComponent } from './call-interface/call-interface.component';
import { CallMobilePopupFilterComponent } from './call-mobile-popup-filter/call-mobile-popup-filter.component';
declare var $: any;
export interface TimeSpan {
  hours: number;
  minutes: number;
  seconds: number;
}
export interface Entry {
  created: Date;
}
interface IRange {
  value: Date[];
  label: string;
}
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  
 
})

export class ChatComponent implements OnInit {

  // for missed tabs
  noWrapSlides3 = false;
  singleSlideOffset3 = true;
  public activeSlideIndex3: number = 0;

  // for answered tab
  noWrapSlides4 = false;
  singleSlideOffset4 = true;
  public activeSlideIndex4: number = 0;
  // for incoming tab
  noWrapSlides1 = false;
  singleSlideOffset1 = true;
  public activeSlideIndex1: number = 0;
  // for ongoing tabs
  noWrapSlides2 = false;
  singleSlideOffset2 = true;
  public activeSlideIndex2: number = 0;

  public itemsPerSlide = 1;
  slides: {image: string; text?: string}[] = [
    {image: 'assets/images/nature/7.jpg'},
    {image: 'assets/images/nature/5.jpg'},
    {image: 'assets/images/nature/3.jpg'}
  ];

  firstDate:any;
  lastDate:any;
  selected_languages1=[];
  selected_languages2=[];
  selected_languages3=[];
  selected_languages4=[];

  seachValue1:any="";
  seachValue2:any="";
  seachValue3:any="";
  seachValue4:any="";

  selectedtab_missed:any;
  selectedtab_finished:any

  rangestartformobile:any;
  rangeendformobile:any;
  expandeditem = "";
  tab = "";
  datepreviewstart:any;
  datepreviewend:any;
  datepreviewstart1:any;
  datepreviewend1:any;
  showincoming_message:boolean=true;
  showongoing_message:boolean=true;
  showmissed_message:boolean=true;
  showanswered_message:boolean=true;

  showincoming:boolean=true;
  showongoing:boolean=true;
  showmissed:boolean=true;
  showanswered:boolean=true;

  rangeSelected1:any;
  rangeSelected2:any;

  date_one_selected:any;
  date_two_selected:any;
  defaultab_selected:any;

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
      label: 'Today'
    }
    ,{
      value: [new Date(new Date().setDate(new Date().getDate() - 1)),new Date(new Date().setDate(new Date().getDate() - 1))],
      label: 'Yesterday'
    },{
      value: [this.Startdayofweek,this.Enddayofweek],
      label: 'This week'
  }, {
    value: [this.lastMonday,this.lastSunday],
    label: 'Last week'
  }, {
    value: [new Date(new Date().getFullYear(), new Date().getMonth(), 1),  new Date(new Date().getFullYear(), new Date().getMonth() + 1,0)],
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
  bsValue=this.ranges[0].value
  @ViewChild(BsDaterangepickerDirective, { static: false }) dateRangePicker: BsDaterangepickerDirective;
  date=new Date(new Date().setDate(new Date().getDate()))
   bsConfig={
     containerClass:"theme-white",
     displayOneMonthRange:true,
    showWeekNumbers:false ,
    adaptivePosition: true,
     dateInputFormat: 'YYYY-MM-DD',
     ranges: this.ranges,
     todayHighlight: true,
     preventChangeToNextMonth: true,
     startView:2,
     showPreviousMonth: false,
     returnFocusToInput: true
   };
  alllanguage=[];
  idoflang=[];
  idofintg=[];
  lang=[];
  lang1=[];
  lang2=[];
  lang3=[];
  lang4=[];
  idsoflanguages=[];
  idsoflanguages1=[];
  idsoflanguages2=[];
  idsoflanguages3=[];
  idsoflanguages4=[];

  selectedlanguagesincom:any;
  selectedlanguagesongo:any;
  selectedlanguagesmiss:any;
  selectedlanguagesfinish:any;

  allselectedtagincom:boolean;
  allselectedtagiongo:boolean;
  allselectedtagmiss:boolean;
  allselectedtagfinish:boolean;

  totalsizeofcalltype1:any;
  totalsizeofcalltype2:any;
  totalsizeofcalltype3:any;
  totalsizeofcalltype4:any;
  idsofcalltype=[];

  idsofcalltype1=[];
  idsofcalltype2=[];
  idsofcalltype3=[];
  idsofcalltype4=[];

  selectedtabs:any;


  Call=[{name:'Audio' ,status:false},
  {name:'Video' ,status:false},
  ];
  call1=this.Call;
  call2=this.Call;
  call3=this.Call;
  call4=this.Call;
  call:any;
  intgg:any;
  all_agent:any;
  queueagent:any;
  numberagentInqueue:any;
  incoming:boolean;
  outgoing:boolean;
  missed:boolean;
  answered:boolean;

  answered_call:Array<any>;
  incoming_call:Array<any>;
  ougoing_call:Array<any>;
  missed_call:Array<any>;
  size_answered_call:any;
  size_incoming_call:any;
  size_ougoing_call:any;
  size_missed_call:any;

  langurl:any;
  operatsystemnurl:any;
  deviceurl:any;
  browserurl:any;
  calltype:any;
  allselectedcall1:boolean;
  allselectedcall2:boolean;
  allselectedcall3:boolean;
  allselectedcall4:boolean;

   data1=[{},{},{},{},{}]

  listuser:any;
  private destroyed$ = new Subject();
  entries: Entry[];


  time: number = 0;
  display ;
  interval;
  private swipeCoord?: [number, number];
  private swipeTime?: number;
  @ViewChild('carousel') carousel:CarouselComponent;
    // for mobile slides on all tabs
  swipe(e: TouchEvent, when: string): void {
    const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
    const time = new Date().getTime();
   
    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if (when === 'end') {
      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      const duration = time - this.swipeTime;
  
      if (duration < 1000 //
        && Math.abs(direction[0]) > 30 // Long enough
        && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) { // Horizontal enough
          let swipe
          if(direction[0] < 0)
          {
            this.addSlide(this.selectedtabs);
            
          } 
          else{
            this.removeSlide(this.selectedtabs);
          }
          console.log(swipe)
        
      }
    }
  }

  addSlide(val): void {
    if(val=="incoming")
    {
      let countadd= this.mobile_incoming.length;
      if( this.activeSlideIndex1<countadd-1)
      {
       this.activeSlideIndex1++;
      }
    }
    else if(val=="ongoing")
    {
      let countadd= this.mobile_ongoing.length;
      if( this.activeSlideIndex2<countadd-1)
      {
       this.activeSlideIndex2++;
      }
    }
    else if(val=="missed")
    {
      let countadd= this.mobile_missed.length;
      if( this.activeSlideIndex3<countadd-1)
      {
       this.activeSlideIndex3++;
      }
    }
    else if(val=="finished")
    {
      let countadd= this.mobile_answered.length;
      if( this.activeSlideIndex4<countadd-1)
      {
       this.activeSlideIndex4++;
      }
    }

  }

  removeSlide(val):void{
    if( this.activeSlideIndex1!=0)
    {
      this.activeSlideIndex1--;    
    }

    if(val=="incoming")
    {
      if( this.activeSlideIndex2!=0)
    {
      this.activeSlideIndex2--;    
    }
    }
    else if(val=="ongoing")
    {
      if( this.activeSlideIndex3!=0)
    {
      this.activeSlideIndex3--;    
    }
    }
    else if(val=="missed")
    {
      if( this.activeSlideIndex3!=0)
    {
      this.activeSlideIndex3--;    
    }
    }
    else if(val=="finished")
    {
      if( this.activeSlideIndex4!=0)
      {
        this.activeSlideIndex4--;    
      }
    }
  }

  constructor(    private localeService: BsLocaleService,
    private changeDetector: ChangeDetectorRef,private gigaaasocketapi:gigaaasocketapi, 
    private sharedres:sharedres_service, 
    private gigaaaservice:GigaaaApiService,
    private messageservie:MessageService,
    public dialog: MatDialog,

  private router:Router,
  private route: ActivatedRoute

    ) {
    enGbLocale.weekdaysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    enGbLocale.week.dow = 1;
    defineLocale('en-gb', enGbLocale);
    this.localeService.use('en-gb');
    this.localeService.currentLocale;
    
  
   }
  option={
    duration:1000,
    startVal:1,

  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  getElapsedTime(entry) {
    var myDate = new Date(entry);
    let totalSeconds = Math.floor((new Date().getTime() - myDate.getTime()) / 1000);

    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    if (totalSeconds >= 3600) {
      hours = Math.floor(totalSeconds / 3600);
      totalSeconds -= 3600 * hours;
    }

    if (totalSeconds >= 60) {
      minutes = Math.floor(totalSeconds / 60);
      totalSeconds -= 60 * minutes;
    }

    seconds = totalSeconds;
    return  0+":"+seconds

  }


  ////////////////////////////
  startTimer() {
    this.interval = setInterval(() => {
      if (this.time === 0) {
        this.time++;
      } else {
        this.time++;
      }
      this.display=this.transform( this.time)
    }, 1000);
  }
  transform(value: number): string {
       const minutes: number = Math.floor(value / 60);
       return minutes + ':' + (value - minutes * 60);
  }
  pauseTimer() {
    clearInterval(this.interval);
  }

  ongoingcalltime(entry) {
 // later record end time
 if(entry==null)
 {
   return "Call not joined"
 }
 var endTime = new Date();
 var startTime = new Date(entry);
 // time difference in ms
 let timeDiff = endTime.getTime() - startTime.getTime()
 // strip the miliseconds
 timeDiff /= 1000;

 // get seconds
 var seconds = Math.round(timeDiff % 60);

 // remove seconds from the date
 timeDiff = Math.floor(timeDiff / 60);

 // get minutes
 var minutes = Math.round(timeDiff % 60);

 // remove minutes from the date
 timeDiff = Math.floor(timeDiff / 60);

 // get hours
 var hours = Math.round(timeDiff % 24);

 // remove hours from the date
 timeDiff = Math.floor(timeDiff / 24);

 // the rest of timeDiff is number of days
 var days = timeDiff;
//  setTimeout(this.display(startTime.getTime()), 1000);

return ("0" + minutes).slice(-2) + ":" + ("0" +seconds).slice(-2);


  }

  mobile_missed:Array<any>=[];
  mobile_answered:Array<any>=[];
  mobile_ongoing:Array<any>=[];
  mobile_incoming:Array<any>=[];
  alreadydonecall:any;

  
  scrollid:any;
  ngOnInit(): void {
    this.route.params.subscribe(data=>{
      console.log(data)
      this.getpanalview(data.id);
    })
   
    this.rangeSelected1="Today";
    this.rangeSelected2="Today";
    this.incoming=true;
    this.outgoing=false;
    this.missed=false;
    this.answered=false;
    this.changecalltype(true);
    this.getcalltype(true);
    this.getsocketapidata();
    this.getagentlist();
    this.selectedtabhold("incoming",true);
    this.selectedtabhold("ongoing",true);
    this.selectedtabhold("missed",true);
    this.selectedtabhold("finished",true);

    this.selectedtabholdcalltype("incoming",true);
    this.selectedtabholdcalltype("ongoing",true);
    this.selectedtabholdcalltype("missed",true);
    this.selectedtabholdcalltype("finished",true);

    this.showselectednumberoflanguages("incoming","All Selected");
    this.showselectednumberoflanguages("ongoing","All Selected");
    this.showselectednumberoflanguages("missed","All Selected");
    this.showselectednumberoflanguages("finished","All Selected");
    this.selectednumbercalls("incoming","All Selected");
    this.selectednumbercalls("ongoing","All Selected");
    this.selectednumbercalls("missed","All Selected");
    this.selectednumbercalls("finished","All Selected");
    this.getlllangugaes();
    this.getmobileSeachFilterData();
    this.getmobileLanguagesFilterData();
    this.getDateRangeMobileFilter();
    this.sharedres.sendtrigger_message_subject.subscribe(data=>{
      if(data==1)
      {
        this.gigaaasocketapi.sendfilterparams({"tab":"default","languages":this.idsoflanguages,"call_type":this.idsofcalltype});
        this.onDateChange([this.ranges[0].value[0],this.ranges[0].value[1]],'missed_date',1);
        this.onDateChange([this.ranges[0].value[0],this.ranges[0].value[1]],'finished_date',1);
        this.alreadydonecall=1;
      }
    });
    interval(1000).subscribe(() => {
      this.changeDetector.detectChanges();
    });
  }

  counter(u: number) {
    return new Array(u);
  }



  // get call type

  getcalltype(val)
  {
    var udpatedlang=[];
 if(val==true)
 {
   this.Call.forEach(element => {
      udpatedlang.push({name:element.name,status:true})
   });
 }
 else{
  this.Call.forEach(element => {
    udpatedlang.push({name:element.name,status:false})
 });
 }
 this.Call=udpatedlang;

}


  getpanalview(val)
  {
    
    this.tab=val
    if(val=="incoming")
    {
      this.incoming=true;
      this.outgoing=false;
      this.missed=false;
      this.answered=false;
      this.selectedtabs="incoming"
    }
    else if(val=="ongoing")
    {
      this.incoming=false;
      this.outgoing=true;
      this.missed=false;
      this.answered=false;
      this.selectedtabs="ongoing";
      // const callstat=JSON.parse(localStorage.getItem("call_info"))
      // if(callstat?.is_refreshed==true)
      // {
      //   let data= {"call_uuid": "jhfdjgdf6545dd4fsdbfjg1qia",callstat};
      //   this.openCallInterface(data);
      // }
      // else{
      //   let data= {"call_uuid": "jhfdjgdf6545dd4fsdbfjg1qia",callstat};
      //   this.openCallInterface(data);
      // }
    }
    else if(val=="missed")
    {
      this.incoming=false;
      this.outgoing=false;
      this.missed=true;
      this.answered=false;
      this.selectedtabs="missed"

    }
    else if(val=="answered")
    {
      this.incoming=false;
      this.outgoing=false;
      this.missed=false;
      this.answered=true;
      this.selectedtabs="finished"

    }
  }

  getagentlist()
  {
  this.sharedres.submitappsubject.subscribe(data=>{
    // this.gigaaasocketapi.sendfilterparams({"tab":this.defaultab_selected,"languages":this.idsoflanguages,"call_type":this.idsofcalltype});
    // this.onDateChange([this.date_one_selected,this.date_two_selected],this.defaultab_selected);
    })
  }


  getsocketapidata()
  {
    this.gigaaasocketapi.getlistofagentsinque$.subscribe( data=>{

  
        this.call=data;
        this.missed_call=data['missed'];
        this.ougoing_call=data['ongoing'];
        this.answered_call=data['finished'];
        this.incoming_call=data['incoming'];
        this.size_ougoing_call=data['ongoing']?.length;
        this.size_incoming_call=data['incoming']?.length;
        this.size_missed_call=data['missed']?.length;
        this.size_answered_call=data['finished']?.length;
        if(this.size_incoming_call==0)
        {
          this.showincoming_message=false;
          this.showincoming=true
        }
        else   if(this.size_incoming_call!=0)
        {
          this.showincoming_message=true;
          this.showincoming=false
        this.mobile_incoming=  this.EqualPartsArray(this.incoming_call,5);
        this.activeSlideIndex1=0;


        }
         if(this.size_ougoing_call==0)
        {
          this.showongoing_message=false;
          this.showongoing=true;
        }
        else if(this.size_ougoing_call!=0)
        {
          this.showongoing_message=true;
          this.showongoing=false;
          this.mobile_ongoing= this.EqualPartsArray(this.ougoing_call,5);
          this.activeSlideIndex2=0;
        }
         if(this.size_missed_call==0)
        {
          this.showmissed_message=false;
          this.showmissed=true;
        }
        else if(this.size_missed_call!=0)
        {
          this.showmissed_message=true;
          this.showmissed=false;
          this.mobile_missed=   this.EqualPartsArray(this.missed_call,5);
          this.activeSlideIndex3=0;

        }
         if(this.size_answered_call==0)
        {
           this.showanswered_message=false;
           this.showanswered=true;
        }
        else if(this.size_answered_call!=0)
        {
            this.showanswered_message=true;
            this.showanswered=false;
            this.mobile_answered= this.EqualPartsArray(this.answered_call,5);
            this.activeSlideIndex4=0;
        }

    },err=>{
      this.messageservie.setErrorMessage(err.error);

    })
  }


  changecountryflag(val)
  {
   if(val=="en")
   {
 return this.langurl='../../../assets/assets_workdesk/Flags/us_flag.svg'
   }
   else if(val=="de") {
    return this.langurl='../../../assets/assets_workdesk/Flags/german.svg'

   }
   else if(val=="ar") {
    return this.langurl='../../../assets/assets_workdesk/Flags/arabic.svg'

  }
  else if(val=="es") {
    return this.langurl='../../../assets/Flagsassets_workdesk/Flags/spanish.svg'

  }
  else if(val=="ru") {
    return this.langurl='../../../assets/assets_workdesk/Flags/russian.svg'

  }
  else if(val=="tr") {
    return this.langurl='../../../assets/assets_workdesk/Flags/turkish.svg'

  }
  else
  {
    return this.langurl='../../../assets/Wikipedia-Flags-DE-Germany-Flag_27.svg'

  }
  }
// change browser
changebrowser(val)
{
 if(val=="Chrome")
 {
  return this.browserurl="../../../assets/assets_workdesk/browsers/chrome.svg";
 }
 else if(val=="Firefox")
 {
  return this.browserurl="../../../assets/assets_workdesk/browsers/firefox.svg";
 }
 else if(val=="Safari") {
  return this.browserurl="../../../assets/assets_workdesk/browsers/safari.svg";
 }
 else if(val=="Opera") {
  return this.browserurl="../../../assets/assets_workdesk/browsers/opera.svg";
}
 else if(val=="Opera Touch") {
  return this.browserurl="../../../assets/assets_workdesk/browsers/opera.svg";
}
else if(val=="edge") {
  return  this.browserurl="../../../assets/assets_workdesk/browsers/default_browser_icon.svg";
}
else if(val==null)
{
  return this.browserurl="../../../assets/assets_workdesk/browsers/default_browser_icon.svg";
}
else

  {
    return this.browserurl="../../../assets/assets_workdesk/browsers/default_browser_icon.svg";
  }

}
// change device
changedevicetype(val)
{
 if(val==true)
 {
  return this.deviceurl="../../../assets/assets_workdesk/device/mobile.svg"; 
 }
else if(val==false)
{
  return this.deviceurl="../../../assets/assets_workdesk/device/desktop.svg";
}
}
// change operation system
changeoperatingsystem(val)
{
 if(val=="macOS")
 {
  return this.operatsystemnurl="../../../assets/assets_workdesk/os/apple.svg";
 }
 else if(val=="iOS")
 {
  return this.operatsystemnurl="../../../assets/assets_workdesk/os/apple.svg";
 }
 else if(val=="Windows") {
  return this.operatsystemnurl="../../../assets/assets_workdesk/os/Windows.svg";
 }
 else if(val=="Android") {
  return this.operatsystemnurl="../../../assets/assets_workdesk/os/android.svg";
 }
else if(val=="Linux")
{
  return this.operatsystemnurl="../../../assets/assets_workdesk/os/linux.svg";
}
else{
  {
    return this.operatsystemnurl="../../../assets/assets_workdesk/os/Windows.svg";
  }
}
}
selectsubscription1(val){
  this.listuser=val
  $('li.user').on('click', function () {
    var isActive = $('#accordian',).toggleClass('is-active');
   if(isActive){
       $('.submenuu').removeClass("is-active").css('display', 'none');
   }
});
}

selectsubscription(val){
  this.listuser=val
  $('li.user').on('click', function () {
    var isActive = $('#accordian',).toggleClass('is-active');
   if(isActive){
       $('.submenuu').removeClass("is-active").css('display', 'none');
   }
});
}
// call type
changecalltype(val)
{
if(val==false)
return "Audio Call";
else  if(val==true){
  return "Video Call";
}
}
changecalltypeicon(val)
{
if(val==false)
return this.calltype="../../../assets/assets_workdesk/request_type/audio.svg";

else if (val==true){
  return this.calltype="../../../assets/assets_workdesk/request_type/video.svg";
}

}
// call type icon for mobile
calltypeiconformobile(val)
{
if(val==false)
return this.calltype="../../../assets/assets_workdesk/audio_call.svg";

else if (val==true){
  return this.calltype="../../../assets/assets_workdesk/video_call.svg";
}
else {
  return this.calltype="../../../assets/assets_workdesk/chat_icon.svg";

}
}


// get duration


gettimeduration(val)
{
  this.getElapsedTime(val)
  let myDate = new Date(val);
 let  time =  ("0" + myDate.getHours()).slice(-2) + ":" + ("0" +myDate.getMinutes()).slice(-2)
return time;
}

// dial call

public async  dialcall(callid:any):Promise<void>
{
  let data= {"call_uuid": callid}
 // this.openCallInterface(data);
   const getdata = JSON.parse(localStorage.getItem('gigaaa-user'))
    let accesstoken=getdata.api_token;
    const id = JSON.parse(localStorage.getItem('intgid'))
    const agentuuid = JSON.parse(localStorage.getItem('userlogged_uuid'))

   let uuid=getdata.subscription_id.subsid.uuid;

  try{
  const call_url= await this.gigaaaservice.getcalltype(accesstoken,uuid,id.int_id,data);
  window.open(call_url.url+"&integration="+id.int_id+"&agentlogged_uuid="+agentuuid?.uuid, "_blank");

  }
  catch(err){
    this.messageservie.setErrorMessage(err.error.error);
  }
}

calculatetime(totalSeconds)
{

  totalSeconds = Number(totalSeconds);
    var h = Math.floor(totalSeconds / 3600);
    var m = Math.floor(totalSeconds % 3600 / 60);
    var s = Math.floor(totalSeconds % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? "" : "") : "00";
    var mDisplay = m > 0 ? m + (m == 1 ? "" : "") : "00";
    var sDisplay = s > 0 ? s + (s == 1 ? "" : "") : "00";

    //   return hDisplay;
      return  ("0" + mDisplay).slice(-2) + ":" + ("0" +sDisplay).slice(-2);

}

// get reason for missed call

getreasonformissedcall(val)
{
    return val
}

search(term:string,column:any) {  
  var result =  this.call[column].filter(obj => {
    if(obj['user_id']!=null)
    {
      return obj['name'].toLowerCase().includes(term.toLowerCase())||obj['user_id'].toString().toLowerCase().includes(term);

    }
    else  if(obj['user_id']==null)
    {
      return obj['name'].toLowerCase().includes(term.toLowerCase());

    }
  })
  if(column=='finished')
  {
    this.answered_call=result;
    this.seachValue4=term;
    this.mobile_answered= this.EqualPartsArray(this.answered_call,5)

  }
  else if(column=='missed')
  {
    this.missed_call=result;
    this.seachValue3=term;
 this.mobile_missed= this.EqualPartsArray(this.missed_call,5)
  }
  else if(column=='incoming')
  { 
    this.seachValue2=term;
    this.size_incoming_call=this.call[column]?.length;
    this.incoming_call=result;
    this.mobile_incoming= this.EqualPartsArray(this.incoming_call,5)

  }
  else if(column=='ongoing')
  {
    this.seachValue1=term;
    this.size_ougoing_call=this.call[column]?.length;
    this.ougoing_call=result;
    this.mobile_ongoing= this.EqualPartsArray(this.ougoing_call,5)

  }
 }

   // get all langugaes
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
      let updatearr = language.map((item, i) => Object.assign({}, item, languagee[i]));

        this.lang=updatearr;
          this.lang1=updatearr;
          this.lang2=updatearr;
          this.lang3=updatearr;
          this.lang3=updatearr;
          var idoflang=[];
          var idofcall=[];
              updatearr.forEach(element => {
                idoflang.push(element.id)
              });
              this.Call.forEach(element => {
                idofcall.push(element.name.toLowerCase())
              });
              this.idsoflanguages=idoflang;
              this.idsofcalltype=idofcall;
              this.getalllanguage(true,"incoming",1);
              this.getalllanguage(true,"ongoing",1);
              this.getalllanguage(true,"missed",1);
              this.getalllanguage(true,"finished",1);
  
              this.selectallcalltype(true,"incoming",1);
              this.selectallcalltype(true,"ongoing",1);
              this.selectallcalltype(true,"missed",1);
              this.selectallcalltype(true,"finished",1);
              if(this.alreadydonecall!=1)
              {
                this.gigaaasocketapi.sendfilterparams({"tab":"default","languages":this.idsoflanguages,"call_type":this.idsofcalltype});
                this.onDateChange([this.ranges[0].value[0],this.ranges[0].value[1]],'missed_date',1);
                this.onDateChange([this.ranges[0].value[0],this.ranges[0].value[1]],'finished_date',1);
              }
              }
              catch(err){
                console.log(err)
                this.messageservie.setErrorMessage(err.error.error)
              }
    }
  getalllanguage(val,tabs,signal)
   {

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
      if(this.lang.length==this.lang.length)
      {
          this.showselectednumberoflanguages(this.selectedtabs,"All Selected")
          this.selectedtabhold(this.selectedtabs,true)
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
      this.selectedtabhold(this.selectedtabs,false)


  }



 if(tabs=="incoming")
 {
   this.lang1=udpatedlang;
   this.idsoflanguages1=languageid;
   this.selected_languages1=this.idsoflanguages1;
   if(signal!=1)
   {
    this.gigaaasocketapi.sendfilterparams({"tab":this.selectedtabs,"languages":this.idsoflanguages1,"call_type":this.idsofcalltype1});

   }

 }
 else if(tabs=="ongoing")
 {
   this.lang2=udpatedlang;
   this.idsoflanguages2=languageid;
   this.selected_languages2=this.idsoflanguages2;

 if(signal!=1)
   {
    this.gigaaasocketapi.sendfilterparams({"tab":this.selectedtabs,"languages":this.idsoflanguages2,"call_type":this.idsofcalltype2});

   }

 }
 else if(tabs=="missed")
 {
   this.lang3=udpatedlang;
   this.idsoflanguages3=languageid;
   this.selected_languages3=this.idsoflanguages3;

   if(signal!=1)
   {
    this.gigaaasocketapi.sendfilterparams({"tab":this.selectedtabs,"languages":this.idsoflanguages3,"call_type":this.idsofcalltype3});

   }

 }
 else if(tabs=="finished")
 {
   this.lang4=udpatedlang;
   this.idsoflanguages4=languageid;
   this.selected_languages4=this.idsoflanguages4;

   if(signal!=1)
   {
    this.gigaaasocketapi.sendfilterparams({"tab":this.selectedtabs,"languages":this.idsoflanguages4,"call_type":this.idsofcalltype4});

   }
   this.idsoflanguages=languageid;

 }


   }
   // select languages one by one
   selectlanguageonebyone(e,id)
   {
    
     if(this.selectedtabs=="incoming")
     {
      if(e==true)
      { var objIndex = this.lang1.findIndex((obj => obj.id == id));

        this.lang1[objIndex].status = true;
       this.idsoflanguages1.push(id);
       if(this.idsoflanguages1.length==this.lang.length)
       {
        this.showselectednumberoflanguages(this.selectedtabs,"All Selected")

        this.selectedtabhold(this.selectedtabs,true)

       }
       else{
        this.showselectednumberoflanguages(this.selectedtabs,this.idsoflanguages1.length +"\xa0"+"Selected")
       }
       this.gigaaasocketapi.sendfilterparams({"tab":this.selectedtabs,"languages":this.idsoflanguages1,"call_type":this.idsofcalltype1});

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
       this.selectedtabhold(this.selectedtabs,false)
      }
      this.gigaaasocketapi.sendfilterparams({"tab":this.selectedtabs,"languages":this.idsoflanguages1,"call_type":this.idsofcalltype1});

     }

     }
     else if(this.selectedtabs=="ongoing")
     {
      if(e==true)
    { var objIndex = this.lang2.findIndex((obj => obj.id == id));

      this.lang2[objIndex].status = true;
     this.idsoflanguages2.push(id);
     if(this.idsoflanguages2.length==this.lang.length)
     {
      this.showselectednumberoflanguages(this.selectedtabs,"All Selected")
      this.selectedtabhold(this.selectedtabs,true)
     }
     else{
      this.showselectednumberoflanguages(this.selectedtabs,this.idsoflanguages2.length +"\xa0"+"Selected")

     }
     this.gigaaasocketapi.sendfilterparams({"tab":this.selectedtabs,"languages":this.idsoflanguages2,"call_type":this.idsofcalltype2});

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
     this.selectedtabhold(this.selectedtabs,false)
    }
    this.gigaaasocketapi.sendfilterparams({"tab":this.selectedtabs,"languages":this.idsoflanguages2,"call_type":this.idsofcalltype2});

   }

     }
     else if(this.selectedtabs=="missed")
     {
      if(e==true)
      { var objIndex = this.lang3.findIndex((obj => obj.id == id));

        this.lang3[objIndex].status = true;
       this.idsoflanguages3.push(id);
       if(this.idsoflanguages3.length==this.lang.length)
       {
        this.showselectednumberoflanguages(this.selectedtabs,"All Selected")
        this.selectedtabhold(this.selectedtabs,true)
       }
       else{
        this.showselectednumberoflanguages(this.selectedtabs,this.idsoflanguages3.length +"\xa0"+"Selected")

       }
       this.gigaaasocketapi.sendfilterparams({"tab":this.selectedtabs,"languages":this.idsoflanguages3,"call_type":this.idsofcalltype3});

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
       this.selectedtabhold(this.selectedtabs,false)
      }
      this.gigaaasocketapi.sendfilterparams({"tab":this.selectedtabs,"languages":this.idsoflanguages3,"call_type":this.idsofcalltype3});

     }

     }
     else if(this.selectedtabs=="finished")
     {
      if(e==true)
      { var objIndex = this.lang4.findIndex((obj => obj.id == id));

        this.lang4[objIndex].status = true;
       this.idsoflanguages4.push(id);
       if(this.idsoflanguages4.length==this.lang.length)
       {
        this.showselectednumberoflanguages(this.selectedtabs,"All Selected")
        this.selectedtabhold(this.selectedtabs,true)
       }
       else{
        this.showselectednumberoflanguages(this.selectedtabs,this.idsoflanguages4.length +"\xa0"+"Selected")
       }
       this.gigaaasocketapi.sendfilterparams({"tab":this.selectedtabs,"languages":this.idsoflanguages4,"call_type":this.idsofcalltype4});

     }
     else if(e==false)
     { var objIndex = this.lang4.findIndex((obj => obj.id == id));

      this.lang4[objIndex].status = false;
      var index = this.idsoflanguages4.indexOf(id);
      if (index !== -1) {
        this.idsoflanguages4.splice(index, 1);
      }

      if(this.idsoflanguages4.length==0)
      {
       this.showselectednumberoflanguages(this.selectedtabs,"Not Selected")
      }
      else{
       this.showselectednumberoflanguages(this.selectedtabs,this.idsoflanguages4.length +"\xa0"+"Selected")

       this.selectedtabhold(this.selectedtabs,false)

      }
      this.gigaaasocketapi.sendfilterparams({"tab":this.selectedtabs,"languages":this.idsoflanguages4,"call_type":this.idsofcalltype4});

     }

     }



 }
 // select call type
 selectallcalltype(e,tabs,signal)
 {
   var updatecalltypes=[];
   var nameofcalltype=[];
   if(e==true)
   {
     this.Call.forEach(element=>{
      updatecalltypes.push({name:element.name ,status:true})
      nameofcalltype.push(element.name.toLowerCase());
     })
    // this.totalsizeofcalltype="All Selected";
     this.selectednumbercalls(this.selectedtabs,"All Selected")

    // this.allselectedcall=true;
     this.selectedtabholdcalltype(this.selectedtabs,true)

   }
   else if(e==false)
   {
    this.Call.forEach(element=>{
      updatecalltypes.push({name:element.name ,status:false});
      var objIndex = nameofcalltype.indexOf(element.name.toLowerCase());
      if (objIndex !== -1) {
        nameofcalltype.splice(objIndex, 1);
      }

     })
     //this.totalsizeofcalltype="Not Selected";
     this.selectednumbercalls(this.selectedtabs,"Not Selected")
    // this.allselectedcall=false;
     this.selectedtabholdcalltype(this.selectedtabs,false);

   }

   

   if(tabs=="incoming")
 {
   this.call1=updatecalltypes;
   this.idsofcalltype1=nameofcalltype;
   if(signal!=1)
   {
    this.gigaaasocketapi.sendfilterparams({"tab":this.selectedtabs,"languages":this.idsoflanguages1,"call_type":this.idsofcalltype1});

   }


 }
 else if(tabs=="ongoing")
 {
   this.call2=updatecalltypes;
   this.idsofcalltype2=nameofcalltype;
   if(signal!=1)
   {
    this.gigaaasocketapi.sendfilterparams({"tab":this.selectedtabs,"languages":this.idsoflanguages2,"call_type":this.idsofcalltype2});

   }

 }
 else if(tabs=="missed")
 {
   this.call3=updatecalltypes;
   this.idsofcalltype3=nameofcalltype;
   if(signal!=1)
   {
    this.gigaaasocketapi.sendfilterparams({"tab":this.selectedtabs,"languages":this.idsoflanguages2,"call_type":this.idsofcalltype3});

   }

 }
 else if(tabs=="finished")
 {
   this.call4=updatecalltypes;
   this.idsofcalltype4=nameofcalltype;
   if(signal!=1)
   {
    this.gigaaasocketapi.sendfilterparams({"tab":this.selectedtabs,"languages":this.idsoflanguages4,"call_type":this.idsofcalltype4});

   }
   this.idsofcalltype=nameofcalltype;
 }
//  else if(tabs=="default")
//  {
//    this.call4=updatecalltypes;
//    this.idsofcalltype4=nameofcalltype;
//    if(signal!=1)
//    {
//     this.gigaaasocketapi.sendfilterparams({"tab":this.selectedtabs,"languages":this.idsoflanguages4,"call_type":this.idsofcalltype4});

//    }

//  }

 }

 selectcalltypeonebyone(e,name)
 {
  if(this.selectedtabs=="incoming")
  {
    if(e==true)
      {var objIndex = this.call1.findIndex((obj => obj.name == name));
        this.call1[objIndex].status = true;
        this.idsofcalltype1.push(name.toLowerCase());
      if( this.idsofcalltype1.length==2)
     {
     // this.totalsizeofcalltype="All Selected";
      this.selectednumbercalls(this.selectedtabs,"All Selected")

     // this.allselectedcall=true;
      this.selectedtabholdcalltype(this.selectedtabs,true);


     }
     else if(this.idsofcalltype1.length<2)
     {
      //this.totalsizeofcalltype= this.idsofcalltype.length +"\xa0"+"Selected";
      this.selectednumbercalls(this.selectedtabs, this.idsofcalltype1[0])

     }
     this.gigaaasocketapi.sendfilterparams({"tab":this.selectedtabs,"languages":this.idsoflanguages1,"call_type":this.idsofcalltype1});

  }
  else if(e==false)
  {var objIndex = this.call1.findIndex((obj => obj.name == name));
    this.selectedtabholdcalltype(this.selectedtabs,false);

    this.call1[objIndex].status = false;
   var index =  this.idsofcalltype1.indexOf(name.toLowerCase());
   if (index !== -1) {
    this.idsofcalltype1.splice(index, 1);

   }
   if( this.idsofcalltype1.length==0)
    {
     // this.totalsizeofcalltype="Not Selected";
      this.selectednumbercalls(this.selectedtabs,"Not Selected")
    }
    else
    {
     // this.totalsizeofcalltype= this.idsofcalltype.length +"\xa0"+"Selected";
      this.selectednumbercalls(this.selectedtabs,this.idsofcalltype1[0])


    }
      }
      this.gigaaasocketapi.sendfilterparams({"tab":this.selectedtabs,"languages":this.idsoflanguages1,"call_type":this.idsofcalltype1});


  }
  else if(this.selectedtabs=="ongoing")
  {
    if(e==true)
      {var objIndex = this.call2.findIndex((obj => obj.name == name));
        this.call2[objIndex].status = true;
        this.idsofcalltype2.push(name.toLowerCase());
      if( this.idsofcalltype2.length==2)
     {
     // this.totalsizeofcalltype="All Selected";
      this.selectednumbercalls(this.selectedtabs,"All Selected")

     // this.allselectedcall=true;
      this.selectedtabholdcalltype(this.selectedtabs,true);


     }
     else if(this.idsofcalltype2.length<2)
     {
      //this.totalsizeofcalltype= this.idsofcalltype.length +"\xa0"+"Selected";
      this.selectednumbercalls(this.selectedtabs,this.idsofcalltype2[0])

     }
     this.gigaaasocketapi.sendfilterparams({"tab":this.selectedtabs,"languages":this.idsoflanguages2,"call_type":this.idsofcalltype2});

  }
  else if(e==false)
  {var objIndex = this.call2.findIndex((obj => obj.name == name));
    this.selectedtabholdcalltype(this.selectedtabs,false);

    this.call2[objIndex].status = false;
   var index =  this.idsofcalltype2.indexOf(name.toLowerCase());
   if (index !== -1) {
    this.idsofcalltype2.splice(index, 1);

   }
   if( this.idsofcalltype2.length==0)
    {
     // this.totalsizeofcalltype="Not Selected";
      this.selectednumbercalls(this.selectedtabs,"Not Selected")
    }
    else
    {
     // this.totalsizeofcalltype= this.idsofcalltype.length +"\xa0"+"Selected";
      this.selectednumbercalls(this.selectedtabs,this.idsofcalltype2[0])


    }
      }
      this.gigaaasocketapi.sendfilterparams({"tab":this.selectedtabs,"languages":this.idsoflanguages3,"call_type":this.idsofcalltype2});

  }
  else if(this.selectedtabs=="missed")
  {
    if(e==true)
    {var objIndex = this.call3.findIndex((obj => obj.name == name));
      this.call3[objIndex].status = true;
      this.idsofcalltype3.push(name.toLowerCase());
    if( this.idsofcalltype3.length==2)
   {
   // this.totalsizeofcalltype="All Selected";
    this.selectednumbercalls(this.selectedtabs,"All Selected")

   // this.allselectedcall=true;
    this.selectedtabholdcalltype(this.selectedtabs,true);


   }
   else if(this.idsofcalltype3.length<2)
   {
    //this.totalsizeofcalltype= this.idsofcalltype.length +"\xa0"+"Selected";
    this.selectednumbercalls(this.selectedtabs,this.idsofcalltype3[0])

   }
   this.gigaaasocketapi.sendfilterparams({"tab":this.selectedtabs,"languages":this.idsoflanguages3,"call_type":this.idsofcalltype3});

}
else if(e==false)
{var objIndex = this.call3.findIndex((obj => obj.name == name));
  this.selectedtabholdcalltype(this.selectedtabs,false);

  this.call3[objIndex].status = false;
 var index =  this.idsofcalltype3.indexOf(name.toLowerCase());
 if (index !== -1) {
  this.idsofcalltype3.splice(index, 1);

 }
 if( this.idsofcalltype3.length==0)
  {
   // this.totalsizeofcalltype="Not Selected";
    this.selectednumbercalls(this.selectedtabs,"Not Selected")
  }
  else
  {
   // this.totalsizeofcalltype= this.idsofcalltype.length +"\xa0"+"Selected";
    this.selectednumbercalls(this.selectedtabs,this.idsofcalltype3[0])


  }
    }
    this.gigaaasocketapi.sendfilterparams({"tab":this.selectedtabs,"languages":this.idsoflanguages3,"call_type":this.idsofcalltype3});

  }
  else if(this.selectedtabs=="finished")
  {
    if(e==true)
    {var objIndex = this.call4.findIndex((obj => obj.name == name));
      this.call4[objIndex].status = true;
      this.idsofcalltype4.push(name.toLowerCase());
    if( this.idsofcalltype4.length==2)
   {
   // this.totalsizeofcalltype="All Selected";
    this.selectednumbercalls(this.selectedtabs,"All Selected")

   // this.allselectedcall=true;
    this.selectedtabholdcalltype(this.selectedtabs,true);


   }
   else if(this.idsofcalltype4.length<2)
   {
    //this.totalsizeofcalltype= this.idsofcalltype.length +"\xa0"+"Selected";
    this.selectednumbercalls(this.selectedtabs,this.idsofcalltype4[0])

   }
   this.gigaaasocketapi.sendfilterparams({"tab":this.selectedtabs,"languages":this.idsoflanguages4,"call_type":this.idsofcalltype4});

}
else if(e==false)
{var objIndex = this.call4.findIndex((obj => obj.name == name));
  this.selectedtabholdcalltype(this.selectedtabs,false);

  this.call4[objIndex].status = false;
 var index =  this.idsofcalltype4.indexOf(name.toLowerCase());
 if (index !== -1) {
  this.idsofcalltype4.splice(index, 1);

 }
 if( this.idsofcalltype4.length==0)
  {
   // this.totalsizeofcalltype="Not Selected";
    this.selectednumbercalls(this.selectedtabs,"Not Selected")
  }
  else
  {
   // this.totalsizeofcalltype= this.idsofcalltype.length +"\xa0"+"Selected";
    this.selectednumbercalls(this.selectedtabs,this.idsofcalltype4[0])


  }

    }
    this.gigaaasocketapi.sendfilterparams({"tab":this.selectedtabs,"languages":this.idsoflanguages4,"call_type":this.idsofcalltype4});

  }

     // this.gigaaasocketapi.sendfilterparams();

 }

 // for languages selected hold
 selectedtabhold(val,status)
 {
  if(val=="incoming")
  {
  this.allselectedtagincom=status;
  }
  else if(val=="ongoing")
  {
this.allselectedtagiongo=status;
  }
  else if(val=="missed")
  {
    this.allselectedtagmiss=status;

  }
  else if(val=="finished")
  {
    this.allselectedtagfinish=status;

  }
 }
 // for call selected hold
 selectednumbercalls(val,status)
 {
  if(val=="incoming")
  {
  this.totalsizeofcalltype1=status;
  }
  else if(val=="ongoing")
  {
this.totalsizeofcalltype2=status;
  }
  else if(val=="missed")
  {
    this.totalsizeofcalltype3=status;

  }
  else if(val=="finished")
  {
    this.totalsizeofcalltype4=status;

  }
 }
 // show selected tab for call type hold
 selectedtabholdcalltype(val,status)
 {
  if(val=="incoming")
  {
  this.allselectedcall1=status;
  }
  else if(val=="ongoing")
  {
this.allselectedcall2=status;
  }
  else if(val=="missed")
  {
    this.allselectedcall3=status;

  }
  else if(val=="finished")
  {
    this.allselectedcall4=status;

  }
 }
 showselectednumberoflanguages(val,selectedlanguages)
 {
  if(val=="incoming")
  {
  this.selectedlanguagesincom=selectedlanguages;
  }
  else if(val=="ongoing")
  {
    this.selectedlanguagesongo=selectedlanguages;

  }
  else if(val=="missed")
  {
    this.selectedlanguagesmiss=selectedlanguages;

  }
  else if(val=="finished")
  {
    this.selectedlanguagesfinish=selectedlanguages;

  }
 }
 // cancel date range 
 canceldaterange(val)
 {
  this.onDateChange([this.ranges[0].value[0],this.ranges[0].value[1]],val,1);

 }
 // Apply date range function

 ApplyDateRange(val)
 {
  this.gigaaasocketapi.send_daterange_params({tab:val,start_date:this.firstDate.toISOString(),end_date:this.lastDate.toISOString()})

 }
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
      this.defaultab_selected=tabsname;
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


         if(tabsname=="missed_date" )
         {  this.selectedtab_missed=x.label;
            this.rangeSelected1=x.label
            this.datepreviewstart=dateStart;
            this.datepreviewend=dateEnd;
            if(val==1){
              this.gigaaasocketapi.send_daterange_params({tab:tabsname,start_date:date1.toISOString(),end_date:date2.toISOString()})

            }

         }
         else if(tabsname=="finished_date" )
         {this.selectedtab_finished=x.label;
          this.rangeSelected2=x.label
          this.datepreviewstart1=dateStart;
          this.datepreviewend1=dateEnd;
          if(val==1){
            this.gigaaasocketapi.send_daterange_params({tab:tabsname,start_date:date1.toISOString(),end_date:date2.toISOString()})

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

       if(tabsname=="missed_date")
       {
        this.rangeSelected1= dateStart+ " -"+ dateEnd;
        this.datepreviewstart=dateStart;
         this.datepreviewend=dateEnd;
         if(val==1)
         {
          this.gigaaasocketapi.send_daterange_params({tab:tabsname,start_date:date1.toISOString(),end_date:date2.toISOString()})

         }
      }
       else if(tabsname=="finished_date")
       {
        this.rangeSelected2= dateStart+ " -"+ dateEnd;
        this.datepreviewstart1=dateStart;
        this.datepreviewend1=dateEnd;
        if(val==1)
        {
        this.gigaaasocketapi.send_daterange_params({tab:tabsname,start_date:date1.toISOString(),end_date:date2.toISOString()})

        }

      }

     }

 }
}

  isActive(tabId:any): boolean {
    return this.tab === tabId;
  }
  isExpand(val:any):boolean{
    if(this.expandeditem===val)
    {
      return true;
    }
    else {
      return false
    }
  }
  getExpandeditem(val:any){
    this.expandeditem=val;
  }
   
 // open mobile filter for call page
 openmobilefilterpopup(val:any)
 {

  let data;
   if(val=="incoming")
   {
  
    data={call_type:val,search_value:this.seachValue1,languages:this.selected_languages1}

   }
   else if(val=="ongoing")
   {
 
    data={call_type:val,search_value:this.seachValue2,languages:this.selected_languages2}

   }
   else if(val=="missed")
   {

    data={call_type:val,search_value:this.seachValue3,languages:this.selected_languages3,datestartRange:this.datepreviewstart,dateendtRange:this.datepreviewend,dateRangeLabel: this.selectedtab_missed}
 
   }
   else if(val=="finished")
   {
    data={call_type:val,search_value:this.seachValue4,languages:this.selected_languages4,datestartRange:this.datepreviewstart1,dateendtRange:this.datepreviewend1,dateRangeLabel: this.selectedtab_finished}

   }
   this.dialog.open(CallMobilePopupFilterComponent,{
   data:data,
     hasBackdrop:true,
     panelClass:"mobilefilter-form-container",
     backdropClass:"backdropBackgroundPopups",
     disableClose:true,
   });
 }
// get mobile search results
  getmobileSeachFilterData()
  {
    this.sharedres.sendcallsearchfilter_subject.subscribe(data=>{
      if(data.call_type=="incoming")
      {
        this.seachValue1=data.search_value
        this.search(data.search_value,data.call_type)
      }
      else if(data.call_type=="ongoing")
      {        this.seachValue2=data.search_value

        this.search(data.search_value,data.call_type)
      }
      else if(data.call_type=="missed")
      {        this.seachValue3=data.search_value

        this.search(data.search_value,data.call_type)
      }
      else if(data.call_type=="finished")
      {        
        this.seachValue4=data.search_value
        this.search(data.search_value,data.call_type)
      }

    })
  }
  // get languages search results
  getmobileLanguagesFilterData()
  {
    this.sharedres.sendcalllanguagesfilter_subject.subscribe(data=>{
      if(data.call_type=="incoming")
      {
        this.selected_languages1=data.languages;
        this.gigaaasocketapi.sendfilterparams({"tab":this.selectedtabs,"languages":data.languages,"call_type":this.idsofcalltype4});

      }
      else if(data.call_type=="ongoing")
      {              
         this.selected_languages2=data.languages;
        this.gigaaasocketapi.sendfilterparams({"tab":this.selectedtabs,"languages":data.languages,"call_type":this.idsofcalltype4});

      }
      else if(data.call_type=="missed")
      {     
        this.selected_languages3=data.languages;
        this.gigaaasocketapi.sendfilterparams({"tab":this.selectedtabs,"languages":data.languages,"call_type":this.idsofcalltype4});

      }
      else if(data.call_type=="finished")
      {             this.selected_languages4=data.languages;
   
        this.gigaaasocketapi.sendfilterparams({"tab":this.selectedtabs,"languages":data.languages,"call_type":this.idsofcalltype4});

      }

    })
  }
  // get date range from mobile filter 

  getDateRangeMobileFilter()
  {
    this.sharedres.senddaterangecallmobilefilter_subject.subscribe(data=>{
      if(this.selectedtabs=="missed")
      {

        this.selectedtab_missed=data.tabslabel;
        this.datepreviewstart=data.datestart;
        this.datepreviewend=data.dateend;
        this.gigaaasocketapi.send_daterange_params({tab:'missed_date',start_date:data.daterangestart,end_date:data.daterangeend})

      } else if(this.selectedtabs=="finished")
      {
        this.selectedtab_finished=data.tabslabel;
        this.datepreviewstart1=data.datestart;
        this.datepreviewend1=data.dateend;
        this.gigaaasocketapi.send_daterange_params({tab:'finished_date',start_date:data.daterangestart,end_date:data.daterangeend})
      }
    })
  }
  openCallInterface(data:any)
  {
    this.dialog.open(CallInterfaceComponent,{
        hasBackdrop:true,
        panelClass:"callinterface-form-container",
        backdropClass:"backdropBackgroundforcall",
        disableClose:true,
        data:data
        
      });
  }

  // split array into equal parts 

 private  EqualPartsArray(array:Array<any>,chunksize:number){
    if(array.length!=0)
    {
      var i,j, temporary, chunk = chunksize;
      let UpdatedArray=[]
      for (i = 0,j = array.length; i < j; i += chunk) {
          temporary = array.slice(i, i + chunk);
         
         UpdatedArray.push(temporary)
  
      } 
      return UpdatedArray;
    }
    }  
        

    // store last offer 
    Storelast
}





