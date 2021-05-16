# Cross Cutting Concerns

- [Cross Cutting Concerns](#cross-cutting-concerns)
  - [CanActivateGuard](#canactivateguard)
  - [CanDeactivateGuard](#candeactivateguard)
  - [HttpInterceptor](#httpinterceptor)
  - [Bonus: Directive for Warnings *](#bonus-directive-for-warnings-)
  - [Bonus: CanDeactivate and Standard Business Conditions **](#bonus-candeactivate-and-standard-business-conditions-)
  - [Bonus: Login **](#bonus-login-)
  - [Bonus: CanActivateChild-Guard **](#bonus-canactivatechild-guard-)

## CanActivateGuard

In this exercise, you will create an `AuthService` that users can use to log in. This `AuthService` remembers the current user name and whether the user is logged in. The possibilities of the service should be offered to the user in the `HomeComponent`.

In addition, create a `CanActivate`-Guard named `AuthGuard`, which only allows a route change if the current user is logged in. For this it relies on the `AuthService`:

```
  [HomeComponent] -------> [AuthService]
                                 ^
                                 |
                            [AuthGuard]
```

You can use the following procedure:

1. Create a `auth` folder in the project's `shared` folder.

2. Create an `AuthService` in the new folder `auth`:

    
    ```typescript
    
    @Injectable({
        providedIn: 'root'
    })
    export class AuthService {
    
        userName: string;
    
        constructor() { }
        
        login() {
            this.userName = 'Max';
        }
    
        logout() {
            this.userName = null;
        }
    
    }
    ```

3. Create a `auth.guard.ts` file in the same folder with a `CanActivate` guard based on `AuthService`.

    <details>
    <summary>Show code</summary>
    <p>
    
    ```typescript
    @Injectable({ 
        providedIn: 'root' 
    })
    export class AuthGuard implements CanActivate {
    
        constructor(private router: Router, private authService: AuthService) { }
    
        canActivate() {
            if (this.authService.userName) {
                return true;
            }
            return this.router.parseUrl('/home;needsLogin=true');
        }
    
    }
    ```
    
    </p>
    </details>

5. Make sure the `AppModule` located in `app.module.ts` imports `SharedModule`.

    <details>
    <summary>Show code</summary>
    <p>
    
    ```typescript
    
    @NgModule({
      imports: [
         [...]
        SharedModule.forRoot()
      ],
      [...]
    })
    export class AppModule { }
    ```
    
    </p>
    </details>

5. Open the file `home.component.ts` and have the `AuthService` injected there. Wrap its functionality with methods or setters.

    <details>
    <summary>Show code</summary>
    <p>
    
    ```typescript
    [...]
    export class HomeComponent implements OnInit {
    
      constructor([...], private authService: AuthService) { }

      ngOnInit() {
      }
    
      get userName() {
        return this.authService.userName;
      }
    
      login() {
        this.authService.login();
      }
    
      logout() {
        this.authService.logout();
      }
    
    }
    ```
    
    </p>
    </details>

6. Open the file `home.component.html`. Display the current user name.

    <details>
    <summary>Show code</summary>
    <p>
    
    ```html
    
    <h1 *ngIf="userName">Welcome, {{userName}}!</h1>
    <h1 *ngIf="!userName">Welcome!</h1>
    ```
    
    </p>
    </details>
    
7. Run the application and check if the implementation works.

8. Register the `AuthGuard` in the route configuration in `flight-booking.routes.ts` to protect one of the established routes.

    <details>
    <summary>Show code</summary>
    <p>

    ```typescript
    
    export const FLIGHT_BOOKING_ROUTES: Routes = [
        {
            path: '...',
            component: [...],
            canActivate:[AuthGuard],
            [...]
        }
        [...]
    ];
    ```

    </p>
    </details>


8. Test your solution.



## CanDeactivateGuard

In this exercise, you will develop a `CanDeactivate`-Guard to warn the user before leaving a route.

1. Create a `deactivation` folder in the `shared` folder.

2. Create a file `can-deactivate.guard.ts` in the new folder `deactivation`:

    
    ```typescript
    
    export interface CanDeactivateComponent {
      canDeactivate(): Observable<boolean>;
    }
    
    @Injectable({ providedIn: 'root' })
    export class CanDeactivateGuard implements CanDeactivate<CanDeactivateComponent> {
    
      canDeactivate(
        component: CanDeactivateComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState?: RouterStateSnapshot): Observable<boolean> {
    
        return component.canDeactivate();
    
      }
    
    }
    ```

The interface ` CanDeactivateComponent` is used here as an abstraction for the components to be used with the Guard.

4. Open the file `flight-edit.component.ts` and implement 
there the interface `CanDeactivateComponent` so that on exit one flag is set and on 
the other hand an `Observable<boolean>` is returned. 
The flag causes a warning message to be displayed. 
Once the user has announced that we really want to leave the route, 
we want to send `true` or `false` to the router via the observable. 
After that it has to be closed. In addition, the flag should be reset afterwards.

    <details>
    <summary>Show code</summary>
    <p>
    
    ```typescript
    
    export class FlightEditComponent implements OnInit, CanDeactivateComponent {
      
      [...]
    
      sender: Observer<boolean>;
    
      decide(decision: boolean): void {
        this.showWarning = false;
        this.sender.next(decision);
        this.sender.complete();
      }
    
      canDeactivate(): Observable<boolean> {
        return new Observable((sender: Observer<boolean>) => {
          this.sender = sender;
          this.showWarning = true;
        });
    
      }
    
      [...]
    }
    ```
    
    </p>
    </details>

5. The file `flight-edit.component.html` already contains a warning box. 
It should present two possible strings (`yes` and `no`) to the user.

6. Also register the Guard in the file `flight-booking.routes.ts`:

    <details>
    <summary>Show code</summary>
    <p>
    
    ```typescript
    
    [...]
    {
        path: 'flight-edit/:id',
        component: FlightEditComponent,
        canDeactivate: [CanDeactivateGuard]
    },
    [...]
    ``` 
    
    </p>
    </details>

7. Test your solution.

## HttpInterceptor

In this exercise, you'll write an `HttpInterceptor` that appends a header with authentication information to each request directed to a particular url. It will also redirect the user to the ` home` route in the event of an authentication error (HTTP code 401 or 403). 

**Hint:** If you are offline, also catch a 404 error for the sake of demonstration.

For the time being, the authentication information will only contain dummy data. However, the Authentication exercise will then switch to meaningful information.

1. Create a file `auth-interceptor.service.ts` in the `shared/auth` folder of your application.

2. Create an `AuthInterceptor` service in this file that implements the `HttpInterceptor` interface. It should extend all requests as mentioned above in order to send the user to the `home` route in case of an authentication error.

    <details>
    <summary>Show code</summary>
    <p>

    
    ```typescript
    
    import { Injectable } from '@angular/core';
    import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
    import { Observable } from 'rxjs';
    import { catchError } from 'rxjs/operators';
    import { throwError } from 'rxjs';

    import { Router } from '@angular/router';


    @Injectable()
    export class AuthInterceptorService implements HttpInterceptor {
            
		constructor(private router: Router) {
		}

		public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
				
			// Important: Don't send out sensitive 
			//            security header to everyone!
			if (req.url.startsWith('http://www.angular.at')) {
				let headers = req.headers.set('Authorization', 'Basic Just-for-Demonstration');
				// We will add a meaningful header later during the auth exercise!
				req = req.clone({ headers });
			}

			return next
				.handle(req)
				.pipe(
					catchError(error => this.handleError(error))
				);
	
		}

		private handleError(event: HttpErrorResponse) {
			if (event.status == 401 || event.status == 403) {
				this.router.navigate(['/home', {needsLogin: true}]);
			}
			return throwError(event);
		}
    }

    ```

    </p>
    </details>

    **If you are offline**, and only if you are offline, also catch a **404** error here for the sake of demonstration.

3. Register this interceptor with the `SharedModule` in the `forRoot` method. Set up a multi-provider with the token `HTTP_INTERCEPTORS`.

    <details>
    <summary>Show code</summary>
    <p>

    ```typescript
    
    @NgModule([...])
    export class SharedModule {
        static forRoot(): ModuleWithProviders {
            return {
                ngModule: SharedModule,
                providers: [{
                    provide: HTTP_INTERCEPTORS,
                    useClass: AuthInterceptorService,
                    multi: true
                }]
            }
        }
    }

    ```

    </p>
    </details>

4. Test your interceptor by searching for flights and checking the `urgent` checkbox. As in the real world, the search fails when it is urgent ;-). 
   This should cause the Interceptor to redirect you to the `home` route.

5. Open the `Network` tab in the Dev tools (F12).

6. Search again for flights, but with the checkbox deactivated.

7. You should now see in the tab `Network` that the defined authorization header with the dummy data is sent.

    ![Authorization header](https://i.imgur.com/JFRVNaJ.png)

8. Since the `HttpInterceptor` is active for every request, you should be able to observe this behavior when fetching all airports too.

## Bonus: Directive for Warnings *

Implement a directive ``clickWithWarning`` that offers buttons an alternative click event. It shall display a warning (e. g. using ``confirm`` for the sake of simplicity). The registered event handler shall only be executed if the user confirms the warning.

1. In your ``shared`` folder, create a ``warning`` folder.
2. Create a file click-with-warning.directive.ts within your new ``warning`` folder. It shall contain the directive.

    <details>
    <summary>Show Code</summary>
    <p>

    ```TypeScript
    import { Directive, Output, EventEmitter, Input, HostListener, ElementRef, Renderer, OnInit, HostBinding } from '@angular/core';
    import { NgControl } from '@angular/forms';

    @Directive({
        selector: '[clickWithWarning]'  // AttributeDirective
    })
    export class ClickWithWarningDirective implements OnInit {

        @Input() warning: string = 'Are you sure?';
        @Output() clickWithWarning = new EventEmitter();

        ngOnInit() {
            this.cssClass = 'btn btn-danger';
        }

        @HostBinding('class') cssClass: string;

        @HostListener('click', ['$event'])
        handleClick($event): void {
            console.log('handleClick', $event);
            if (confirm(this.warning)) {
                this.clickWithWarning.emit();
            }
        }
    }

    ```

    </p>
    </details>

3. Open the file ``shared.module.ts`` and make sure, that your directive is declared and exported.

    <details>
    <summary>Show code</summary>
    <p>

    ```TypeScript
    @NgModule({
    imports: [
        [...]
    ],
    declarations: [
        [...],
        ClickWithWarningDirective
    ],
    exports: [
        [...],
        ClickWithWarningDirective
    ],
    [...]
    })
    export class SharedModule {
    }
    ```

    </p>
    </details>

3. Open the file ``flight-edit.component.ts`` and add a ``delete`` method that just writes out an information using ``console.debug`` (you can implement it later).

    <details>
    <summary>Show code</summary>
    <p>

    ```TypeScript
    export class FlightEditComponent [...] {
        [...]
        delete(): void {
            console.debug('Delete ...');
        }
    }
    ```

    </p>
    </details>

4. Open the file ``flight-edit.component.html`` and add a button which is using the new directive to call the ``delete`` method.

    <details>
    <summary>Show code</summary>
    <p>

    ```html
    <div class="content">
    [...]

        <button (clickWithWarning)="delete()" warning="Really?!">Delete</button>

    </div>

    ```

    </p>
    </details>

5. Test your solution.


## Bonus: CanDeactivate and Standard Business Conditions **

Add a checkbox with the label "I accept the standard business conditions" to the HomeComponent. Create an ``CanDeactivate`` guard that prevents the user from leaving the ``HomeComponent`` without activating this checkbox.

If you use `ngModel`, make sure that the `FormsModule` is imported into the `AppModule`.

## Bonus: Login **

Extend the `AuthService` so that it verifies with hard-coded data whether a particular username/password combination exists. 
Expand the login mask so that the user can enter username and password here. 

If you use `ngModel`, make sure that the `FormsModule` is imported into the `AppModule`.

## Bonus: CanActivateChild-Guard **

Write an ``CanActivateChild``-Guard that makes sure that the menu item passengers can only be called when a flight has been selected. 

**Hint:** To allow the guard to find out, whether a flight has been selected, you can save the selected flight(s) within an service. This service can be injected to the guard and to other services and/or components.