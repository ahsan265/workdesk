import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { oneSelect } from "../agents/agentsData";
import { MultiSelect } from "../models/multiSelect";
import { OneSelect } from "../models/oneSelect";
import { GigaaaApiService } from "../services/gigaaaApiService";

@Injectable({
  providedIn: 'root'
})

export class commonEps  {
    token:any;
    countryArray=[];
    languageArray=[];

     nullarray:MultiSelect={title: "Language",
    showSelectAll:true,
    showSearchBar: true,
    data: []};
    constructor(private GigaaaApiService:GigaaaApiService){

    }
// get the list of countries
  public async getLocations()
    {
  
      if(this.getEpsParamLocal().project!=undefined)
      {
     const countryList=await  this.GigaaaApiService.getAllCountries(this.getEpsParamLocal().token);
            const countriesList= countryList.map((item:any) => Object.assign(item,{ selected: false}));    
            var sortedCountry= countriesList.sort((a:any, b:any)=> {
                var textA = a.name;
                var textB = b.name;
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
               });
              this.countryArray=sortedCountry;
             const countryListArray:MultiSelect={title: "Location",
            showSelectAll:true,
            showSearchBar: true,
            data: sortedCountry}    
            return countryListArray;
              }
              else{
             return this.nullarray;
              }
    }
    // get list of languages()

    public async getLanguages()
    {
      if(this.getEpsParamLocal().project!=undefined)
      {
        const languages=await this.GigaaaApiService.getAllLanguages(this.getEpsParamLocal().token,this.getEpsParamLocal().organization,this.getEpsParamLocal().project)
        const languagesList= languages.map((item:any) => Object.assign(item,{ selected: false}));
        this.languageArray=languagesList;
        const languageListArray:MultiSelect={title: "Language",
        showSelectAll:true,
        showSearchBar: true,
        data: languagesList
      }    
        return languageListArray; 
      }
      else{
        return this.nullarray;
      }

    }


    // get data token, organization , project from local storage 
    public getEpsParamLocal()
    {

      const newLocal=JSON.parse(localStorage.getItem('gigaaa-user')|| '{}');
      const organz=JSON.parse(localStorage.getItem('gigaaa-organz')|| '{}');
      const project=JSON.parse(localStorage.getItem('gigaaa-project')|| '{}');
     
      return {token:newLocal.api_token,
        organization:organz.uuid,
        project:project.uuid}
    }
    // get locations Id 
   public getIdsOfLocation(){
      let locationIds:any=[];
      if(this.countryArray.length!=0)
      {
        this.countryArray.forEach((data:OneSelect)=>{
          locationIds.push(data.id)
        })
        return locationIds;
      }
     
    }
    // get language Id 
    public getIdsofLanguage()
    {
      let LanguageIds:any=[];
      if(this.languageArray.length!=0)
      {
        this.languageArray.forEach((data:OneSelect)=>{
          LanguageIds.push(data.id)
        })
        return LanguageIds;
      }

    }
}