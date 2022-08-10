/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable sort-imports */
import { Injectable } from '@angular/core';
import { MultiSelect } from '@gigaaa/gigaaa-components/lib/models/multiSelect';
import { OneSelect } from '@gigaaa/gigaaa-components/lib/models/oneSelect';
import { AgentLanguages } from 'src/app/models/agentSocketModel';
import { Country } from 'src/app/models/country';
import { language } from 'src/app/models/language';
import { SelectionModelCountry } from 'src/app/models/selectionModel';
import { GigaaaApiService } from '../gigaaaApiService/gigaaa-api-service.service';
import { MessageService } from '../messageService/message.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  token: any;
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
    private MessageService: MessageService
  ) {}
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

  // get data token, organization , project from local storage
  public getEpsParamLocal() {
    const newLocal = JSON.parse(localStorage.getItem('gigaaa-user') || '{}');
    const organization = JSON.parse(
      localStorage.getItem('gigaaa-organz') || '{}'
    );
    const project = JSON.parse(localStorage.getItem('gigaaa-project') || '{}');

    return {
      token: newLocal.api_token,
      organization: organization.uuid,
      project: project.uuid
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
    var idOfLanguages: number[] = [];
    selectedLanguage.forEach((language: AgentLanguages) => {
      idOfLanguages.push(language.id);
    });
    return idOfLanguages;
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
}
