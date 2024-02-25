import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class dateUtils{

    getStandardizedDateFormate(date: Date){
        // Standard format: YYYY-MM-DD
        var year = date.toLocaleString("default", { year: "numeric" });
        var month = date.toLocaleString("default", { month: "2-digit" });
        var day = date.toLocaleString("default", { day: "2-digit" });
        return `${year}-${month}-${day}`
      }

    getDateForRecipePrint(date: Date = new Date(), time=true){
        var year = date.toLocaleString("default", { year: "numeric" });
        var month = date.toLocaleString("default", { month: "2-digit" });
        var day = date.toLocaleString("default", { day: "2-digit" });
        
        let hour: number | '' = time? date.getHours(): '';
        let minute: number | '' = time? date.getMinutes(): '';
        let second: number | '' = time? date.getSeconds(): '';

        return `${day}-${month}-${year} ${hour}:${minute}:${second}`
    }
}
