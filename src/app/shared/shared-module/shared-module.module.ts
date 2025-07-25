import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/components/shared/header/header.component';
import { FooterComponent } from 'src/app/components/shared/footer/footer.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ClickOutsideDirective } from '../utils/clickOutside';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, ClickOutsideDirective],
  imports: [CommonModule, MatIconModule],
  exports: [HeaderComponent, FooterComponent],
})
export class SharedModuleModule {}
