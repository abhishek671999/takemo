import { HttpHeaders } from "@angular/common/http"

export let host =  'https://takemo.in/api/v1/'  //'http://192.168.1.13:8000/api/v1/'

export function getToken(){
    return localStorage.getItem('token')
}

export function getHeaders(){
    const headers = new HttpHeaders({'Authorization': 'Token ' + getToken()}) 
    return headers
}
