import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class StringUtils{
    titleCase(string: String) {
        return string.charAt(0).toUpperCase() + string.substring(1)
    }
}