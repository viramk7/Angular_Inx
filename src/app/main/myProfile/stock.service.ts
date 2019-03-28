import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AppConstant } from "../../app.constant";

@Injectable({
    providedIn: 'root'
})
export class StockService {
    url: string;
    constructor(private http: HttpClient) {
        this.url = AppConstant.Base_URL+'search/stocks/';
    }

    //get particular stock data
    getSearchStock(searchPhrase:string){
        return this.http.get(this.url+searchPhrase);
    }
}