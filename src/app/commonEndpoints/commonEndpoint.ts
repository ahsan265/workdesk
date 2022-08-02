/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable sort-imports */
import { Injectable, IterableDiffers } from '@angular/core';
import { oneSelect } from '../agents/agentsData';
import { AgentLanguages } from '../models/agentSocketModel';
import { Country } from '../models/country';
import { language } from '../models/language';
import { Languages } from '../models/languages';
import { MultiSelect } from '../models/multiSelect';
import { OneSelect } from '../models/oneSelect';
import {
  SelectionModel,
  SelectionModelCountry
} from '../models/selectionModel';
import { SelectModelCountrySingle } from '../models/selectionModelCountry';
import { GigaaaApiService } from '../workdeskServices/gigaaaApiService/gigaaa-api-service.service';

@Injectable({
  providedIn: 'root'
})
export class CommonEndpoints {
  token: any;
  countryArray: Array<any> = [];
  languageArray: Array<any> = [];
  idsOfLanguages: Array<any> = [];
  idsOfLocations: Array<any> = [];
  nullMultiSelect: MultiSelect = {
    title: 'Language',
    showSelectAll: true,
    showSearchBar: true,
    data: []
  };
  constructor(private GigaaaApiService: GigaaaApiService) { }
  // get the list of countries
  public async getLocations(): Promise<MultiSelect> {
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
  }
  // get list of languages()

  public async getLanguages(): Promise<MultiSelect> {
    const languages: language[] = await this.GigaaaApiService.getAllLanguages();
    const languageSelected: OneSelect[] = languages.map((item: language) => ({
      name: item.name,
      id: item.id,
      selected: false
    }));
    this.languageArray = languages;
    const languageListArray: MultiSelect = {
      title: 'Language',
      showSelectAll: true,
      showSearchBar: true,
      data: languageSelected
    };
    return languageListArray;
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
  public getLanguageSelectedIds(selectedLanguage: AgentLanguages[]): Array<number> {
    var idOfLanguages: number[] = [];
    selectedLanguage.forEach((language: AgentLanguages) => {
      idOfLanguages.push(language.id)
    })
    return idOfLanguages;
  }
  // for selected languages checked
  public selectedLanguageChecket(allLanguages:OneSelect[], selectedLanguage: AgentLanguages[]): MultiSelect {
 
    selectedLanguage.forEach((languages: AgentLanguages) => {
      allLanguages.forEach((lang: OneSelect) => {
        if (lang.id === languages.id) {
          lang.name = languages.name,
            lang.id = languages.id,
            lang.selected = true
        }

      })
    })
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
