/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable sort-imports */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { InvitedAgentTableLanguage, TableSettingsModel, tableSettingsDataModel } from 'src/app/models/agent';
import { AgentLanguages, AgentList } from 'src/app/models/agentSocketModel';
import { Country } from 'src/app/models/country';
import { language } from 'src/app/models/language';
import { MultiSelect } from 'src/app/models/multiSelect';
import { OneSelect } from 'src/app/models/oneSelect';
import { SelectionModelCountry } from 'src/app/models/selectionModel';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { GigaaaApiService } from '../gigaaaApiService/gigaaa-api-service.service';
import { MessageService } from '../messageService/message.service';
import { FlagsData } from '../WorkdeskServicesData';
import { tableSettings } from 'src/app/models/callModel';
import { timer } from 'src/app/models/preferenceModel';
import { NotificationComponentModel, NotificationModels } from 'src/app/models/notification';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  token: any;
  flagsData = FlagsData;
  countryArray: Array<OneSelect> = [];
  languageArray: Array<OneSelect> = [];
  idsOfLanguages: Array<number> = [];
  idsOfLocations: Array<number> = [];
  nullMultiSelect: MultiSelect = {
    title: '',
    showSelectAll: true,
    showSearchBar: true,
    data: []
  };
  constructor(
    private GigaaaApiService: GigaaaApiService,
    private MessageService: MessageService,
    private Authservice: AuthService,
    private Router: Router
  ) { }
  // get the list of countries
  public async getLocations(): Promise<MultiSelect> {
    try {
      const countryList: Country[] =
        await this.GigaaaApiService.getAllCountries(this.getEndpointsParamLocal().project, this.getEndpointsParamLocal().organization);

      let sortedCountry = countryList.filter(e => e.name === 'Undefined').concat(countryList.filter(d => d.name !== 'Undefined').sort(
        (cOne: Country, cTwo: Country) => {
          let countryOne = cOne.count_of_call_requests;
          let countryTwo = cTwo.count_of_call_requests;
          return countryTwo - countryOne;
        }
      ));
      const countriesList: OneSelect[] = sortedCountry.map((item: Country) => ({
        name: item.name,
        id: item.id,
        selected: false
      }));
      this.countryArray = countriesList;
      const countryListArray: MultiSelect = {
        title: 'Location',
        showSelectAll: true,
        showSearchBar: true,
        data: countriesList
      };
      return countryListArray;
    } catch (err: any) {
      this.MessageService.setErrorMessage(err.error.error);
    }
    return this.nullMultiSelect;
  }
  // get list of languages()

  public async getLanguages(): Promise<MultiSelect> {
    try {
      const languages: language[] =
        await this.GigaaaApiService.getAllLanguages();
      const languageSelected: OneSelect[] = languages.map((item: language) => ({
        name: item.name,
        id: item.id,
        selected: false
      }));
      this.languageArray = languageSelected;
      const languageListArray: MultiSelect = {
        title: 'Language',
        showSelectAll: true,
        showSearchBar: true,
        data: languageSelected
      };
      return languageListArray;
    } catch (err: any) {
      this.MessageService.setErrorMessage(err.error.error);
    }
    return this.nullMultiSelect;
  }
  // get project languages
  public async getProjectLanguages(): Promise<MultiSelect> {
    try {
      const languages: language[] =
        await this.GigaaaApiService.getProjectLanguages(
          this.getEndpointsParamLocal().token,
          this.getEndpointsParamLocal().organization,
          this.getEndpointsParamLocal().project
        );
      const languageSelected: OneSelect[] = languages.map((item: language) => ({
        name: item.name,
        id: item.id,
        selected: false
      }));
      this.languageArray = languageSelected;
      const languageListArray: MultiSelect = {
        title: 'Language',
        showSelectAll: true,
        showSearchBar: true,
        data: languageSelected
      };
      return languageListArray;
    } catch (err: any) {
      this.MessageService.setErrorMessage(err.error.error);
    }
    return this.nullMultiSelect;
  }
  public async getProjectLanguagesForUser(): Promise<MultiSelect> {
    try {
      const languages: OneSelect[] =
        await this.GigaaaApiService.getProjectLanguages(
          this.getEndpointsParamLocal().token,
          this.getEndpointsParamLocal().organization,
          this.getEndpointsParamLocal().project
        );
      const languageUserSelected = languages.filter((item: OneSelect) => {
        if (item.selected === true) {
          return item;
        } else {
          return null;
        }
      });
      const languageSelected: OneSelect[] = languageUserSelected.map(
        (item: OneSelect) => ({
          name: item.name,
          id: item.id,
          selected: false
        })
      );
      // this.languageArray = languageSelected;
      const languageListArray: MultiSelect = {
        title: 'Language',
        showSelectAll: true,
        showSearchBar: true,
        data: languageSelected
      };
      return languageListArray;
    } catch (err: any) {
      this.MessageService.setErrorMessage(err.error.error);
    }
    return this.nullMultiSelect;
  }
  // get data token, organization , project from local storage
  public getEndpointsParamLocal() {
    const newLocal = JSON.parse(localStorage.getItem('gigaaa-user') || '{}');
    const organization = JSON.parse(
      localStorage.getItem('gigaaa-organz') || '{}'
    );
    const project = JSON.parse(localStorage.getItem('gigaaa-project') || '{}');
    const socketConnection = JSON.parse(
      localStorage.getItem('connection-id') || '{}'
    );

    return {
      token: newLocal.api_token,
      organization: organization?.uuid,
      project: project.uuid,
      connectionId: socketConnection.connection
    };
  }
  // get logged Agent
  public getLoggedAgentStatus() {
    const isLoggedIn = JSON.parse(
      localStorage.getItem('agent-online-status') || '{}'
    );


    return isLoggedIn;
  }
  // get locations Id
  public getIdsOfLocation() {
    let locationIds: any = [];
    this.countryArray.forEach((data: OneSelect) => {
      locationIds.push(data.id);
    });
    this.idsOfLocations = locationIds;
    return locationIds;
  }
  // get language Id
  public getIdsOfLanguage() {
    let LanguageIds: any = [];
    this.languageArray.forEach((data: OneSelect) => {
      LanguageIds.push(data.id);
    });
    this.idsOfLanguages = LanguageIds;
    return LanguageIds;
  }

  // for selected languages  ids using component function
  public getLanguageSelectedIds(
    selectedLanguage: AgentLanguages[]
  ): Array<number> {
    let idOfLanguages: number[] = [];
    selectedLanguage.forEach((language: AgentLanguages) => {
      idOfLanguages.push(language.id);
    });
    return idOfLanguages;
  }

  // get languages Id and images  on for table in whole application
  public getLanguagesWithFlags(
    selectedLanguage: AgentLanguages[]
  ): Array<InvitedAgentTableLanguage> {
    let InvitedAgentTableLanguage: InvitedAgentTableLanguage[] = [];

    selectedLanguage.forEach((language: AgentLanguages) => {
      InvitedAgentTableLanguage.push({
        id: language.id,
        image: this.getLanguageFlags(language.id)
      });
    });
    return InvitedAgentTableLanguage;
  }
  // for selected languages checked
  public selectedLanguageChecket(
    allLanguages: OneSelect[],
    selectedLanguage: AgentLanguages[]
  ): MultiSelect {
    selectedLanguage.forEach((languages: AgentLanguages) => {
      allLanguages.forEach((lang: OneSelect) => {
        if (lang.id === languages.id) {
          (lang.name = languages.name),
            (lang.id = languages.id),
            (lang.selected = true);
        }
      });
    });
    const languageListArray: MultiSelect = {
      title: 'Language',
      showSelectAll: true,
      showSearchBar: true,
      data: allLanguages
    };
    return languageListArray;
  }
  // for selected location using component function
  public getLocationSelected(
    selectedLcoation: SelectionModelCountry
  ): Array<any> {
    if (selectedLcoation.selectedAll === false) {
      if (selectedLcoation.item.selected === true) {
        this.idsOfLocations.push(selectedLcoation.item.id);
      } else if (selectedLcoation.item.selected === false) {
        let languageIndex = this.idsOfLocations.indexOf(
          selectedLcoation.item.id
        );
        if (languageIndex != -1) {
          this.idsOfLocations.splice(languageIndex, 1);
        }
      }
    } else if (selectedLcoation.selectedAll === true) {
      this.idsOfLocations.splice(0, this.idsOfLocations.length);
      this.getIdsOfLocation();
    }
    return this.idsOfLocations;
  }
  // get loggedIn Agent
  public checkLoggedInUser(email: string) {
    return this.Authservice.getLoggedUser().email === email ? true : false;
  }


  // get All Notification 

  public async getAllNotification() {
    const data: NotificationModels[] = await this.GigaaaApiService.getAllNotification(this.getEndpointsParamLocal().token, this.getEndpointsParamLocal().organization,
      this.getEndpointsParamLocal().project);
    const res: NotificationComponentModel[] = data.map(data => ({
      header: data.data.title,
      date: this.timeNow(data.data.created_at),
      message: data.data.content,
      isOpen: data.data.is_read,
      icon: this.getNotificationIcon(data.type),
      id: data.data.id
    }))
    return res;
  }
  //  set unread to read Notification

  public async setUnreadTOread(id: number) {
    try {
      await this.GigaaaApiService.setUnreadToreadNotification(this.getEndpointsParamLocal().token, this.getEndpointsParamLocal().organization,
        this.getEndpointsParamLocal().project, id)
    }
    catch (error: any) {
      this.MessageService.setErrorMessage(error.error.error);
    }
  }
  // check is any Unread  notification
  public checkIsUnread(data: NotificationComponentModel[]) {
    const response = data.filter(element => {
      return element.isOpen === false;
    })
    return response.length !== 0 ? true : false;
  }

  // map notioficat data 
  // public delete notification one by one

  public async deleteNotificationOne(id: number[]) {
    await this.GigaaaApiService.deletNotification(this.getEndpointsParamLocal().token, this.getEndpointsParamLocal().organization,
      this.getEndpointsParamLocal().project, id)
  }
  // get language flags
  public getLanguageFlags(id: number): string {
    switch (id) {
      case 83:
        return '../assets/images/Flags/german.svg';
      case 161:
        return '../assets/images/Flags/Spain.svg';
      case 175:
        return '../assets/images/Flags/turkish.svg';
      case 56:
        return '../assets/images/Flags/us_flag.svg';
      case 179:
        return '../assets/images/Flags/Flag_of_Pakistan.svg';
      case 131:
        return '../assets/images/Flags/russian.svg';
      case 6:
        return '../assets/images/Flags/arabic.svg';
      default:
        return '';
    }
  }
  // get notification Iocn
  public getNotificationIcon(id: string): string {
    switch (id) {
      case 'invitation_accepted':
        return '../assets/images/notification/invitation_accepted.svg';
      default:
        return '';
    }
  }
  // get browser Information
  // get pictures
  public getBrowserFlag(browserName: string) {
    switch (browserName) {
      case 'Chrome':
        return '../../../assets/images/browsers/chrome.svg';
      case 'Firefox':
        return '../../../assets/images/browsers/firefox.svg';
      case 'Safari':
        return '../../../assets/images/browsers/safari.svg';
      case 'Opera':
        return '../../../assets/images/browsers/opera.svg';
      case 'Opera Touch':
        return '../../../assets/images/browsers/opera.svg""';
      case 'edge':
        return '../../../assets/images/browsers/default_browser_icon.svg';
      case null:
        return '../../../assets/images/browsers/default_browser_icon.svg';
      default:
        return '../../../assets/images/browsers/default_browser_icon.svg';
    }
  }

  // get physical device
  public getDeviceType(val: boolean): string {
    return val == true
      ? '../../../assets/images/device/desktop.svg'
      : '../../../assets/images/device/mobile.svg ';
  }

  // get operating system

  public getOperatingSystem(os: string) {
    switch (os) {
      case 'macOS':
        return '../../../assets/images/os/apple.svg';
      case 'iOS':
        return '../../../assets/images/os/apple.svg';
      case 'Windows':
        return '../../../assets/images/os/Windows.svg';
      case 'Android':
        return '../../../assets/images/os/android.svg';
      case 'Linux':
        return '../../../assets/images/os/linux.svg';
      case null:
        return '../../../assets/images/os/Windows.svg';
      default:
        return '../../../assets/images/os/Windows.svg';
    }
  }
  /// get conversation type
  public getConversationType(conversation: string): string {
    switch (conversation) {
      case 'audio':
        return '../../../assets/images/request_type/audio.svg';
      case 'video':
        return '../../../assets/images/request_type/video.svg';
      case 'chat':
        return '../../../assets/images/request_type/live_chat_icon.svg';
      default:
        return '../../../assets/images/os/Windows.svg';
    }
  }

  // get email logged in user
  public getEmailForLoggedInUser() {
    const newLocal: User = JSON.parse(
      localStorage.getItem('gigaaa-user') || '{}'
    );
    return newLocal.email;
  }

  // get email logged in user
  public getIsAdminOrAgent() {
    const isAdmin: boolean = JSON.parse(
      localStorage.getItem('is-admin') || '{}'
    );
    return isAdmin;
  }

  // paginate
  paginate(array: any[], page_size: number, page_number: number) {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  }
  // get is logged in user is Admin or Agent
  public async getAgentRole() {
    const data = await this.GigaaaApiService.getroleofagent(this.getEndpointsParamLocal().token, this.getEndpointsParamLocal().organization, this.getEndpointsParamLocal().project)
    localStorage.setItem('is-admin', JSON.stringify(data['is_admin']));
  }


  // logged in agent data
  public loggedInAgentDetails(data: AgentList) {
    localStorage.setItem('agent-logged', JSON.stringify(data));
  }

  // get loggedin Agent Data 
  public getLoggedInAgentData() {
    const Agent: AgentList = JSON.parse(
      localStorage.getItem('agent-logged') || '{}'
    );
    return Agent;
  }

  public getDesktopNotification(title: any, body: any) {
    Notification.requestPermission().then((permission) => {
      if (permission = "granted") {
        var notification = new Notification(title, { body: body, icon: '../assets/images/sidebar/workdesk_logo_short.png' });
        setTimeout(function () {
          notification.close();
        }, 3000);
      }

    });
  }

  // restrict Router
  public restrictRoute() {
    if (!this.getIsAdminOrAgent()) {
      this.Router.navigate(['requests']);
    }
    else {
      this.Router.navigate(['/dashboard']);
    }

  }
  // set dashboard type 
  setDashboardType(name: string[]) {
    this.Router.navigate(name)
  }

  // set Table value Update 

  public updateColumnTable(tableSettingsData: tableSettingsDataModel[], tableSettings: TableSettingsModel[]) {
    tableSettingsData.forEach(element => {
      tableSettings[element.customization_id].header === '' ? tableSettings[element.customization_id].header = tableSettings[element.customization_id].defaultValue :
        tableSettings[element.customization_id].header = element.customization_value;
    });
    return tableSettings;
  }
  // get ellapsed time
  public onGoingTimer(entry: string) {
    // later record end time
    if (entry == null) {
      return "Call not joined"
    }
    let endTime = new Date();
    let startTime = new Date(entry);
    // time difference in ms
    let timeDiff = endTime.getTime() - startTime.getTime()
    // strip the miliseconds
    timeDiff /= 1000;

    // get seconds
    let seconds = Math.round(timeDiff % 60);

    // remove seconds from the date
    timeDiff = Math.floor(timeDiff / 60);

    // get minutes
    let minutes = Math.round(timeDiff % 60);

    // remove minutes from the date
    timeDiff = Math.floor(timeDiff / 60);

    // get hours
    let hours = Math.round(timeDiff % 24);

    // remove hours from the date
    timeDiff = Math.floor(timeDiff / 24);

    // the rest of timeDiff is number of days
    let days = timeDiff;
    //  setTimeout(this.display(startTime.getTime()), 1000);

    return ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
  }
  // get ellapsed time
  public getElapsedTime(entry: string) {
    let myDate = new Date(entry);
    let totalSeconds = Math.floor(
      (new Date().getTime() - myDate.getTime()) / 1000
    );
    let seconds = 0;
    let hours = 0;
    let minutes = 0;
    if (totalSeconds >= 3600) {
      hours = Math.floor(totalSeconds / 3600);
      totalSeconds -= 3600 * hours;
    }
    if (totalSeconds >= 60) {
      minutes = Math.floor(totalSeconds / 60);
      totalSeconds -= 60 * minutes;
    }
    seconds = totalSeconds;
    return 0 + ':' + seconds;
  }

  // convert second into minute , hours, seconds
  public toHoursAndMinutes(totalSeconds: number): timer {
    const totalMinutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { h: hours, min: minutes, sec: seconds };
  }
  toSeconds(hours: number, minutes: number, seconds: number) {
    return hours * 3600 + minutes * 60 + seconds;
  }

  // get date in formation yyyy-mm-dd
  timeNow(time: any) {

    switch (typeof time) {
      case 'number':
        break;
      case 'string':
        time = +new Date(time);
        break;
      case 'object':
        if (time.constructor === Date) time = time.getTime();
        break;
      default:
        time = +new Date();
    }
    let time_formats = [
      [60, 'Now', 1], // 60
      [120, '1 minute ago', '1 minute from now'], // 60*2
      [3600, 'minutes', 60], // 60*60, 60
      [7200, '1 hour ago', '1 hour from now'], // 60*60*2
      [86400, 'hours', 3600], // 60*60*24, 60*60
      [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
      [604800, 'days', 86400], // 60*60*24*7, 60*60*24
      [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
      [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
      [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
      [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
      [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
      [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
      [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
      [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];
    let seconds = (+new Date() - time) / 1000,
      token = 'ago',
      list_choice = 1;

    if (seconds == 0) {
      return 'Just now'
    }
    if (seconds < 0) {
      seconds = Math.abs(seconds);
      token = 'now';
      list_choice = 2;
    }
    let i = 0,
      format: any = [];
    while (format = time_formats[i++])
      if (seconds < format[0]) {
        if (typeof format[2] == 'string')
          return format[list_choice];
        else
          if (seconds < 60 && seconds > 0) {
            return 'now'
          }
          else {
            return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
          }
      }
    return time;
  }

}
