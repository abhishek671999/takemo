import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ImagesService } from 'src/app/shared/services/images/images.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.css'],
})
export class UploadFormComponent {
  outputBoxVisible = false;
  progress = `0%`;
  uploadResult = '';
  fileName = '';
  fileSize = '';
  uploadStatus: number | undefined;

  constructor(private __imageService: ImagesService) {}

  onFileSelected(event: any) {
    this.outputBoxVisible = false;
    this.progress = `0%`;
    this.uploadResult = '';
    this.fileName = '';
    this.fileSize = '';
    this.uploadStatus = undefined;
    const file: File = event.dataTransfer?.files[0] || event.target?.files[0];
    if (file) {
      this.fileName = file.name;
      this.fileSize = `${(file.size / 1024).toFixed(2)} KB`;
      this.outputBoxVisible = true;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('item_id', '218');

      this.__imageService.uploadImage(formData).subscribe(
        (data) => {
          console.log(data);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      const file: File = event.dataTransfer.files[0];
      this.onFileSelected(event);
    }
  }
}
