import { HttpHeaders } from "@angular/common/http"

export let host =  'http://192.168.1.13:8000/api/v1/' //'http://65.20.75.191:8001/api/v1/' 

export function getToken(){
    return localStorage.getItem('token')
}

export function getHeaders(){
    const headers = new HttpHeaders({'Authorization': 'Token ' + getToken()}) 
    return headers
}