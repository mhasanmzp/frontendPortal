import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class DataService {
    private oemUrl = 'https://api.example.com/oems'; // Replace with your actual API endpoint
    private categoryUrl = 'https://api.example.com/categories'; // Replace with your actual API endpoint
    private submitMaterialUrl = 'https://api.example.com/material'; // Replace with your actual API endpoint
  
    constructor(private http: HttpClient) { }
  
    getOEMs(): Observable<any[]> {
      return this.http.get<any[]>(this.oemUrl);
    }
  
    getCategories(): Observable<any[]> {
      return this.http.get<any[]>(this.categoryUrl);
    }
  
    submitMaterial(material: any): Observable<any> {
      return this.http.post<any>(this.submitMaterialUrl, material);
    }
  }
  