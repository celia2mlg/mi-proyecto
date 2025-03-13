import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-restricted-page',
  imports: [MatButtonModule],
  templateUrl: './restricted-page.component.html',
  styleUrl: './restricted-page.component.css',
})
export class RestrictedPageComponent {
  constructor(private router: Router) {}

  navigateTo() {
    this.router.navigate(['/']);
  }
}
