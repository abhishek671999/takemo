import { Injectable } from '@angular/core';
import { host } from '../../site-variable';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  private __uploadImageEndpoint = host + 'inventory/upload_image_to_item/'
  private __deleteImageEndpoint = host + '/inventory/delete_item_image/'

  constructor(private __httpClient: HttpClient) { }


  uploadImage(formData) {
    return this.__httpClient.post(this.__uploadImageEndpoint, formData)
  }


}
