import { Injectable } from "@angular/core";
import { MultiSelect } from "../models/multiSelect";
import { OneSelect } from "../models/oneSelect";
import { SelectionModel, SelectionModelCountry } from "../models/selectionModel";
import { GigaaaApiService } from "../workdeskServices/gigaaaApiService/gigaaa-api-service.service";

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
    title: "Language",
    showSelectAll: true,
    showSearchBar: true,
    data: []
  };
  constructor(private GigaaaApiService: GigaaaApiService) {

  }
  // get the list of countries
  public async getLocations(): Promise<MultiSelect> {

    if (this.getEpsParamLocal().project != undefined) {
      const countryList: SelectionModelCountry[] = await this.GigaaaApiService.getAllCountries(this.getEpsParamLocal().token);
      const countriesList = countryList.map((item: any) => Object.assign(item, { selected: false }));
      let sortedCountry = countriesList.sort((cOne: any, cTwo: any) => {
        let countryOne = cOne.name;
        let countryTwo = cTwo.name;
        return (countryOne < countryTwo) ? -1 : (countryOne > countryTwo) ? 1 : 0;
      });
      this.countryArray = sortedCountry;
      const countryListArray: MultiSelect = {
        title: "Location",
        showSelectAll: true,
        showSearchBar: true,
        data: sortedCountry
      }
      return countryListArray;
    }
    else {
      return this.nullMultiSelect;
    }
  }
  // get list of languages()

  public async getLanguages(): Promise<MultiSelect> {
    if (this.getEpsParamLocal().project != undefined) {
      const languages: OneSelect[] = await this.GigaaaApiService.getAllLanguages(this.getEpsParamLocal().token, this.getEpsParamLocal().organization, this.getEpsParamLocal().project)
      const languagesList = languages.map((item: any) => Object.assign(item, { selected: false }));
      this.languageArray = languagesList;
      const languageListArray: MultiSelect = {
        title: "Language",
        showSelectAll: true,
        showSearchBar: true,
        data: languagesList
      }
      return languageListArray;
    }
    else {
      return this.nullMultiSelect;
    }

  }


  // get data token, organization , project from local storage 
  public getEpsParamLocal() {
    const newLocal = JSON.parse(localStorage.getItem('gigaaa-user') || '{}');
    const organization = JSON.parse(localStorage.getItem('gigaaa-organz') || '{}');
    const project = JSON.parse(localStorage.getItem('gigaaa-project') || '{}');

    return {
      token: newLocal.api_token,
      organization: organization.uuid,
      project: project.uuid
    }
  }
  // get locations Id 
  public getIdsOfLocation() {
    let locationIds: any = [];
    this.countryArray.forEach((data: OneSelect) => {
      locationIds.push(data.id)
    })
    this.idsOfLocations = locationIds;
    return locationIds;
  }
  // get language Id 
  public getIdsOfLanguage() {
    let LanguageIds: any = [];
    this.languageArray.forEach((data: OneSelect) => {
      LanguageIds.push(data.id)
    })
    this.idsOfLanguages = LanguageIds;
    return LanguageIds;

  }

  // for selected languages using component function
  public getLanguageSelected(selectedLanguage: SelectionModel): Array<any> {
    if (selectedLanguage.selectedAll === false) {
      if (selectedLanguage.item.selected === true) {
        this.idsOfLanguages.push(selectedLanguage.item.id);
      }
      else if (selectedLanguage.item.selected === false) {
        let languageIndex = this.idsOfLanguages.indexOf(selectedLanguage.item.id);
        if (languageIndex != -1) {
          this.idsOfLanguages.splice(languageIndex, 1);
        }
      }
    }
    else if (selectedLanguage.selectedAll === true) {
      this.idsOfLanguages.splice(0, this.idsOfLanguages.length);
      this.getIdsOfLanguage()
    }
    return this.idsOfLanguages;
  }
  // for selected location using component function
  public getLocationSelected(selectedLcoation: SelectionModelCountry): Array<any> {
    if (selectedLcoation.selectedAll === false) {
      if (selectedLcoation.item.selected === true) {
        this.idsOfLocations.push(selectedLcoation.item.id);
      }
      else if (selectedLcoation.item.selected === false) {
        let languageIndex = this.idsOfLocations.indexOf(selectedLcoation.item.id);
        if (languageIndex != -1) {
          this.idsOfLocations.splice(languageIndex, 1);
        }
      }
    }
    else if (selectedLcoation.selectedAll === true) {
      this.idsOfLocations.splice(0, this.idsOfLocations.length);
      this.getIdsOfLocation();
    }
    return this.idsOfLocations;
  }
}