import { Component } from '@angular/core';
import { NavigationCancel, NavigationError, ResolveEnd, ResolveStart, Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'flight-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isResolving = true;

  constructor(private router: Router) {
    router.events.subscribe((routerEvent: RouterEvent) => {
      this.checkRouterEvent(routerEvent);
    });
  }

  checkRouterEvent(routerEvent: RouterEvent): void {
    if (routerEvent instanceof ResolveStart) {
      this.isResolving = true;
    }

    if (routerEvent instanceof ResolveEnd || routerEvent instanceof NavigationCancel || routerEvent instanceof NavigationError) {
      this.isResolving = false;
    }
  }
}
