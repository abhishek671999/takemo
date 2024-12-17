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
    
    getStandardizedDateTimeFormate(date: Date) {
        // Standard format: DD-MM-YYYY HH:MM
        return date.toLocaleString('en-US')
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

    getStandardizedTimeFormate(date: Date){
        let timeString = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })
         return timeString
    }

    parseDateString(dateString: string): Date {
        const [datePart, timePart, period] = dateString.split(/[\s]+/);
        const [day, month, year] = datePart.split('-').map(Number);
        let [hours, minutes, seconds] = timePart.split(':').map(Number);
        if (period === 'PM' && hours < 12) {
          hours += 12;
        } else if (period === 'AM' && hours === 12) {
          hours = 0;
        }
        return new Date(year, month - 1, day, hours, minutes, seconds);
    }
}
