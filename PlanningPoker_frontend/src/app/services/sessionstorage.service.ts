import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SessionStorageService {
  constructor() { }

  saveItem(key: string, data: any){
    sessionStorage.setItem(key, JSON.stringify(data))
  }

  getItem(key: string){
    const data = sessionStorage.getItem(key)
    return data ? JSON.parse(data) : null
  }

  removeItem(key: string){
    sessionStorage.removeItem(key)
  }

  clearAll(){
    sessionStorage.clear()
  }
}
