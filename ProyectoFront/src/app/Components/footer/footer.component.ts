import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  imports: [MatIconModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  mapUrl: SafeResourceUrl;
  constructor(private sanitizer: DomSanitizer) {
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12812.386415559087!2d-4.5497967571561855!3d36.599982333595854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd72fc9835c69edd%3A0x53029632f4081444!2sArroyo%20de%20la%20Miel%2C%2029631%20Benalm%C3%A1dena%2C%20M%C3%A1laga!5e0!3m2!1ses!2ses!4v1740855276145!5m2!1ses!2ses'
    );
  }

}
