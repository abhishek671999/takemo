import { HttpHeaders } from "@angular/common/http"
import { Token } from "@angular/compiler"
import { inject } from "@angular/core"
import { CookieService } from "ngx-cookie-service"

export let host = 'http://65.20.75.191:8000/api/v1/' // local test
//export let host = 'https://test.takemo.in/api/v1/' // Demo test
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

@Injectable({
    providedIn: 'root'
})
export class Utility{
    constructor(public cookieService: CookieService, public router: Router){}

    getToken(){
        var token = this.cookieService.get('token')
        if(token){
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
        this.cookieService.set('token', key, new Date(new Date().getTime()  + totalExpiryDate * 24 * 60 * 60 * 1000))
    }

    removeToken(){
        this.cookieService.delete('token')
    }
}


@Injectable({
    providedIn: 'root'
})
export class meAPIUtility{

    constructor(public cookieService: CookieService, private _meService: MeService, private _router: Router){}
    
    setMeData(meData){
        let meDataExpiryDuration = 6000 // min
        console.log('Setting cookies')
        this.cookieService.set('me', JSON.stringify(meData), new Date(new Date().getTime() + meDataExpiryDuration * 60 * 1000))
        console.log('Cookies set')
    }

    getMeData(){
        console.log('Get me data from cookies')
        let meData: any = this.cookieService.get('me')
        if(meData){
            console.log('Got data form cookies')
            return JSON.parse(meData)
        }else{
            console.log('Hitting me again')
            this._meService.getMyInfo().subscribe(
                data => {
                    console.log('Got response from me api', data)
                    meData = data
                    this.setMeData(meData)
                },
                error => {
                    console.log('Error occured while getting me: ', error)
                    this._router.navigate(['login']) // todo: IT's quick fix investage on session or cookies and chagne it.
                } 
            )
            console.log('Returning this: ', meData)
            return meData
        } 
    }

    removeMeData(){
        this.cookieService.delete('me')
    }
}