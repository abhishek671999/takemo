import { HttpHeaders } from "@angular/common/http"
import { Token } from "@angular/compiler"
import { inject } from "@angular/core"
import { CookieService } from "ngx-cookie-service"

// export let host = 'http://65.20.75.191:8001/api/v1/' // local test
//export let host = 'https://test.takemo.in/api/v1/' // Demo test
export let host = 'http://139.84.139.204:8000/api/v1/' 
// export let host = 'https://takemo.in/api/v1/' //Prod 


export function getToken(){
    this.cookieService = inject(CookieService)
    return this.cookieService.get('token')
}

export const getToken1 = () => {
    const cookieService = inject(CookieService)
    return () => {
        cookieService.get('token')
    }
} 
export function setToken( key: string){
    let totalExpiryDate = 7; // days
    this.cookieService = inject(CookieService)
    this.cookieService.set('token', key, new Date(new Date().getTime()  + totalExpiryDate*24*60*60*1000))
}

export const setToken1 = () => {
    const cookieService = inject(CookieService)
    let totalExpiryDate = 7; // days
    return (key: string) => {
        cookieService.set('token', key, new Date(new Date().getTime()  + totalExpiryDate*24*60*60*1000))
    }
}
export function getHeaders(){
    const headers = new HttpHeaders({'Authorization': 'Token ' + getToken()}) 
    return headers
}

import { Injectable } from '@angular/core';
import { MeService } from "./services/register/me.service"
import { JsonPipe } from "@angular/common"
import { Router } from "@angular/router"
import { LoginService } from "./services/register/login.service"
import { Observable } from "rxjs"

@Injectable({
    providedIn: 'root'
})
export class Utility{
    constructor(public cookieService: CookieService, public router: Router){}

    getToken(){
        var token = this.cookieService.get('token')
        if(token){
            this.setToken(token)
            return token
        }else{
            this.router.navigate(['login']);
            return null
        }

    }

    getHeaders(){
        const headers = new HttpHeaders({'Authorization': 'Token ' + this.getToken()}) 
        return headers
    }

    setToken( key: string){
        let totalExpiryDate = 60; // days
        let newDate =  new Date(new Date().getTime()  + totalExpiryDate * 24 * 60 * 60 * 1000)
        console.log('NEw date: ', newDate)
        this.cookieService.set('token', key, newDate, '/')
    }
}


@Injectable({
    providedIn: 'root'
})
export class meAPIUtility{

    constructor(public cookieService: CookieService, private _meService: MeService, private _router: Router){}
    
    setMeData(meData){
        let meDataExpiryDuration = 30 // min
        this.cookieService.set('me', JSON.stringify(meData), new Date(new Date().getTime() + meDataExpiryDuration * 60 * 1000))
    }

    getMeData(){
        let meDataObservable = new Observable(observer => {
            let meData: any = this.cookieService.get('me')
            if(meData){
                observer.next(JSON.parse(meData))
            }else{
                this._meService.getMyInfo().subscribe(data =>{
                    this.setMeData(data)
                    observer.next(data)
                })
            }
        })
        return meDataObservable
    }

    removeMeData(){
        console.log('Before removeMe data: ', this.cookieService.getAll())
        this.cookieService.deleteAll('/')
        this.cookieService.delete('token')
        this.cookieService.delete('me')
        if(this.cookieService.getAll()){
            console.log('Deleting cookies again')
            this.cookieService.delete('token')
            this.cookieService.deleteAll('/')
        }
        console.log('after deleting')
    }
}