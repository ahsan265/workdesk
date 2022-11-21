/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable sort-imports */
import { Injectable } from '@angular/core';
import { InvitedAgentTableLanguage } from 'src/app/models/agent';
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
    private Authservice: AuthService
  ) { }
  // get the list of countries
  public async getLocations(): Promise<MultiSelect> {
    try {
      const countryList: Country[] =
        await this.GigaaaApiService.getAllCountries();
      const countriesList: OneSelect[] = countryList.map((item: Country) => ({
        name: item.name,
        id: item.id,
        selected: false
      }));

      let sortedCountry = countriesList.sort(
        (cOne: OneSelect, cTwo: OneSelect) => {
          let countryOne = cOne.name;
          let countryTwo = cTwo.name;
          return countryOne < countryTwo ? -1 : countryOne > countryTwo ? 1 : 0;
        }
      );
      this.countryArray = sortedCountry;
      const countryListArray: MultiSelect = {
        title: 'Location',
        showSelectAll: true,
        showSearchBar: true,
        data: sortedCountry
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
      organization: organization.uuid,
      project: project.uuid,
      connectionId: socketConnection.connection
    };
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


  // get language flags
  public getLanguageFlags(id: number): string {
    switch (id) {
      case 83:
        return '../assets/images/Flags/german.svg';
      case 161:
        return '../assets/images/Flags/spain.svg';
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
  public getConversationType(conversation: boolean): string {
    return conversation === false
      ? '../../../assets/images/request_type/audio.svg'
      : '../../../assets/images/request_type/video.svg';
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
  public getAgentRole() {
    this.GigaaaApiService.getroleofagent(this.getEndpointsParamLocal().token, this.getEndpointsParamLocal().organization, this.getEndpointsParamLocal().project).subscribe((data: any) => {
      localStorage.setItem('is-admin', JSON.stringify(data['is_admin']));
    })
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

  public getDesktopNotification(title:any,body:any)
  {
    Notification.requestPermission().then((permission)=>{
      if(permission="granted")
      {
        var notification = new Notification(title,{body:body,icon:'../assets/images/sidebar/workdesk_logo_short.png'});
        setTimeout(function(){
            notification.close();
        },3000);
      }

  });
  }
}
