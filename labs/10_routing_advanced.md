# Advanced Routing

- [Advanced Routing](#advanced-routing)
	- [Hierarchisches Routing](#hierarchisches-routing)
	- [Bonus: Aux-Routes *](#bonus--aux-routes)
	- [Guards](#guards)
		- [CanActivateGuard](#canactivateguard)
	- [CanDeactivateGuard](#candeactivateguard)
	- [Bonus: Login **](#bonus--login)
	- [Bonus: Resolver *](#bonus--resolver)
	- [Bonus: Loading Indicator *](#bonus--loading-indicator)
	- [Lazy Loading](#lazy-loading)
		- [Lazy Loading konfigurieren](#lazy-loading-konfigurieren)
	- [Preloading](#preloading)
	- [Problem mit Shared Services lösen](#problem-mit-shared-services-losen)
	- [Alternative: Treeshakable Providers](#alternative--treeshakable-providers)
	- [Bonus: Eigene Preloading Strategy **](#bonus--eigene-preloading-strategy)

## Hierarchisches Routing

In dieser Übung werden Sie mit einer neuen Komponente ``FlightBookingComponent`` und hierarchischem Routing eine weitere Navigationsebene einführen:

```
AppComponent
     +------------ HomeComponent
     +------------ FlightBookingComponent     
                      +--------------------- FlightSearchComponent
                      +--------------------- FlightEditComponent
                      +--------------------- PassengerSearchComponent
```

Sie können sich dazu an der folgenden Anleitung anlehnen:

1. Erstellen Sie im Ordner flight-booking eine ``FlightBookingComponent``. Sie soll ein weiteres ``router-outlet`` aufweisen und Menüpunkte, die auf die oben gezeigten Subkomponenten verweisen.

	<details>
	<summary>Code anzeigen</summary>
	<p>
	
	```TypeScript
	@Component({
	  selector: 'app-flight-booking',
	  templateUrl: './flight-booking.component.html'
	})
	export class FlightBookingComponent implements OnInit {
	
	  constructor() { }
	
	  ngOnInit() {
	  }
	
	}
	```

	```HTML
	<div class="card">
	  <div class="content">
	    <a routerLink="./flight-search">Flight Search</a> | 
	    <a routerLink="./passenger-search">Passenger Search</a> 
	  </div>
	</div>
	
	<router-outlet></router-outlet>
	```
	</p>
	</details>


	
	Beachten Sie, dass diese Komponente einen eigenen Platzhalter mit ``router-outlet`` definiert.

2. Stellen Sie sicher, dass die neue Komponente in der Datei ``flight-booking.module`` registriert ist.

	<details>
	<summary>Code anzeigen</summary>
	<p>

	```TypeScript
	@NgModule({
	  declarations: [
        [...]
	    FlightBookingComponent  // <-- Important!
	  ],
	  [...]
	})
	export class FlightBookingModule { }
	```

	</p>
	</details>

3. Definieren Sie in der Datei ``flight-booking.routes.ts`` eine Route für die neue Komponente. Alle bisherigen Routen sollen zu ihren Child-Routen werden.

	<details>
	<summary>Code anzeigen</summary>
	<p>

   ```TypeScript
	export const FLIGHT_BOOKING_ROUTES: Routes = [
	  {
	    path: 'flight-booking',
	    component: FlightBookingComponent,
	    children: [
	      {
	        path: 'flight-search',
	        component: FlightSearchComponent
	      },
	      {
	        path: 'passenger-search',
	        component: PassengerSearchComponent
	      },
	      {
	        path: 'flight-edit/:id',
	        component: FlightEditComponent
	      }
	    ]
	  }
	
	];
	```

	</p>
	</details>


4. Wechseln Sie in die Datei ``sidebar.component.html`` und definieren Sie dort einen Hauptmenüpunkt für die Route ``flight-booking/flight-search``. Die Route für ``passenger-search`` können Sie entfernen.

	<details>
	<summary>Code anzeigen</summary>
	<p>
	
	```HTML
	<ul class="nav">
    <li>
        <a routerLink="home">
            <i class="ti-home"></i>
            <p>Home</p>
        </a>
    </li>

	<!-- New -->
    <li>
        <a routerLink="flight-booking/flight-search">
            <i class="ti-arrow-top-right"></i>
            <p>Flight Booking</p>
        </a>
    </li>

	<!-- Old -->
    <!--

    <li>
        <a routerLink="flight-search">
            <i class="ti-arrow-top-right"></i>
            <p>Flight Search</p>
        </a>
    </li>

    <li>
        <a routerLink="passenger-search">
            <i class="ti-user"></i>
            <p>Passengers</p>
        </a>
    </li>
    -->
	```
	
	</p>
	</details>


5. Wechseln Sie in die Datei ``flight-card.component.html`` und aktualisieren Sie dort den Link auf ``flight-edit`` auf ``../flight-edit``.

	<details>
	<summary>Code anzeigen</summary>
	<p>
	
	```HTML
	<!-- New -->
	<a class="btn btn-default"
    	[routerLink]="['../flight-edit', item.id, {showDetails: true}]">
  		Edit
	</a>

	<!-- Old -->
	<a class="btn btn-default"
    	[routerLink]="['flight-edit', item.id, {showDetails: true}]">
  		Edit
	</a>
	```
	
	</p>
	</details>


6. Testen Sie Ihre Lösung.

## Bonus: Aux-Routes *

In dieser Übung werden Sie eine neue BasketComponent erzeugen und diese über eine Aux-Route einblenden. Mit den Möglichkeiten von CSS können Sie sie als Popover darstellen.

1. Erzeugen Sie im Ordner ``src/app`` eine ``BasketComponent``. Sie können die einzelnen Dateien dafür aus der präsentierten Lösung übernehmen.

2. Stellen Sie sicher, dass diese Komponente in der Datei ``app.module.ts`` registriert ist.

	<details>
	<summary>Code anzeigen</summary>
	<p>
	
	```TypeScript
	@NgModule({
		[...],
	  	declarations: [
	    	[...],
	    	BasketComponent  // <-- Important!
	  	],
	  	[...]	
	})
	export class AppModule { }
	```
	
	</p>
	</details>

2. Öffnen Sie die Datei ``app.component.html`` und fügen Sie ein weiteres ``router-outlet`` ein. Vergeben Sie den Namen ``aux``.

	<details>
	<summary>Code anzeigen</summary>
	<p>
	
	```HTML
	<div class="content">
	
	  <!-- Existing outlet -->
	  <router-outlet></router-outlet>

	  <!-- New additional outlet -->	
	  <router-outlet name="aux"></router-outlet>
	
	</div>
	```
	
	</p>
	</details>


3. Öffnen Sie die Datei ``app.routes.ts`` und ergänzen Sie eine Route ``basket``, die auf die neue ``BasketComponent`` verweist und dem neuen Outlet ``aux`` gewidtmet ist.

	<details>
	<summary>Code anzeigen</summary>
	<p>

	```TypeScript
	[...]
	  {
	    path: 'basket',
	    component: BasketComponent,
	    outlet: 'aux'
	  },
	[...]
	```

	</p>
	</details>


4. Öffnen Sie die Datei ``sidebar.component.html`` und ergänzen Sie einen Menüeintrag, der die ``BasketComponent`` anzeigt. 

	<details>
	<summary>Code anzeigen</summary>
	<p>
	
	```HTML
	<li routerLinkActive="active">
	<a [routerLink]="[{outlets: {aux: 'basket' }}]">
	    <i class="ti-shopping-cart"></i>
	    <p>Basket</p>
	</a>
	</li>
	```
	
	</p>
	</details>

5. Testen Sie Ihre Lösung.


## Guards

### CanActivateGuard

In dieser Übung erstellen Sie einen AuthService, mit dem sich Benutzer anmelden können. Dieser AuthService merkt sich den aktuellen Benutzernamen bzw. ob der Benutzer angemeldet ist. Die Möglichkeiten des Services sollen dem Benutzer in der ``HomeComponent`` angeboten werden.

Zusätzlich erstellen Sie einen ``CanActivate``-Guard mit dem Namen ``AuthGuard``, der nur dann einen Routenwechsel zulässt, wenn der aktuelle Benutzer angemeldet ist. Hierzu stützt er sich auf den ``AuthService`` ab:

```
  [HomeComponent] -------> [AuthService]
                                 ^
                                 |
                            [AuthGuard]
```

Sie können sich dabei am folgenden Ablauf orientieren:

1. Erstellen Sie einen Ordner ``auth`` im Ordner ``shared``.

2. Erstellen Sie im neuen Ordner ``auth`` einen ``AuthService``:

	```TypeScript
	@Injectable()
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

3. Erstellen Sie im selben Ordner eine Datei ``auth.guard.ts`` mit einem ``CanActivate``-Guard, der sich auf den ``AuthService`` stützt.

	<details>
	<summary>Code anzeigen</summary>
	<p>
	
	```TypeScript
	@Injectable()
	export class AuthGuard implements CanActivate {
	
	    constructor(private router: Router, private authService: AuthService) { }
	
	    canActivate() {
	        if (this.authService.userName) {
	            return true;
	        }
	        this.router.navigate(['/home', { needsLogin: true }])
	        return true;
	    }
	
	}
	```
	
	</p>
	</details>

4. Registrieren Sie den ``AuthGuard`` und den ``AuthService`` in der Datei ``shared.module.ts`.

	<details>
	<summary>Code anzeigen</summary>
	<p>
	
	```TypeScript
	@NgModule({
	  [...]
	  providers: [
	    AuthService,
		AuthGuard
	  ],
      [...]
	})
	export class SharedModule { }
	```
	
	</p>
	</details>


5. Stellen Sie sicher, dass das ``AppModule`` (``app.module.ts``) das ``SharedModule`` importiert.

	<details>
	<summary>Code anzeigen</summary>
	<p>
	
	```TypeScript
	@NgModule({
	  imports: [
	 	[...]
	    SharedModule
	  ],
	  [...]
	})
	export class AppModule { }
	```
	
	</p>
	</details>


5. Öffnen Sie die Datei ``home.component.ts`` und lassen Sie sich dort den ``AuthService`` injizieren. Wrappen Sie seine Funktionalität mit Methoden bzw. Setter.

	<details>
	<summary>Code anzeigen</summary>
	<p>
	
	```TypeScript
	export class HomeComponent implements OnInit {
	
	  constructor(private authService: AuthService) { }

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

6. Öffnen Sie die Datei ``home.component.html``. Geben Sie dort den aktuellen Benutzernamen aus und bieten Sie Schaltflächen für das Login bzw. Logout an.

	<details>
	<summary>Code anzeigen</summary>
	<p>
	
	```HTML
	<h1 *ngIf="userName">Willkommen, {{userName}}</h1>
	<h1 *ngIf="!userName">Willkommen!</h1>
	
	<div class="card">
	    <div class="content">
	      <button class="btn btn-default" (click)="login()">Login</button>
	      <button class="btn btn-default" (click)="logout()">Logout</button>
	    </div>
	</div>
	```
	
	</p>
	</details>


7. Registrieren Sie den ``AuthGuard`` bei der Routen-Konfiguration in ``flight-booking.routes.ts``, um die eine der eingerichteten Routen zu schützen.

	<details>
	<summary>Code anzeigen</summary>
	<p>

	```TypeScript
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


8. Testen Sie Ihre Lösung.


## CanDeactivateGuard

In dieser Übung entwickeln Sie einen ``CanDeactivate``-Guard um den Benutzer vor dem Verlassen einer Route zu warnen.

1. Erzeugen Sie im Ordner ``shared`` einen Ordner ``deactivation``.

2. Erzeugen Sie im neuen Ordner ``deactivation`` eine Datei ``can-deactivate.guard``:

	```TypeScript
	export interface CanDeactivateComponent {
	  canDeactivate(): Observable<boolean>;
	}
	
	@Injectable()
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

	Das Interface ``CanDeactivateComponent`` kommt hier als Abstraktion für die Komponenten, die mit dem Guard zu nutzen sind, zum Einsatz.


4. Öffnen Sie die Datei ``flight-edit.component.ts`` und implementieren Sie dort das Interface ``CanDeactivateComponent``, sodass beim verlassen zum einen ein Flag gesetzt wird und zum anderen ein ``Observable<boolean> `` zurückgeliefert wird. Das Flag dazu führen, dass eine Warnmeldung angezeigt wird. Sobald der Benutzer bekannt gegeben hat, ob wir die Route wirklich verlassen möchte, soll über das Observable ``true`` bzw. ``false`` an den Router gesendet werden. Danach muss es geschlossen werden. Zusätzlich soll danach das Flag wieder zurückgesetzt werden.

	<details>
	<summary>Code anzeigen</summary>
	<p>
	
	```TypeScript
	export class FlightEditComponent implements OnInit, CanDeactivateComponent {
	  
	  [...]
	
	  sender: Observer<boolean>;
	  showWarning = false;
	
	  decide(decision: boolean): void {
	    this.showWarning = false;
	    this.sender.next(decision);
	    this.sender.complete();
	  }
	
	  canDeactivate(): Observable<boolean> {
	    return Observable.create((sender: Observer<boolean>) => {
	      this.sender = sender;
	      this.showWarning = true;
	    });
	
	  }
	
	  [...]
	}
	```
	
	</p>
	</details>

5. Erweitern Sie die Datei ``flight-edit.component.html`` um die zuvor erwähte Warnung mit den beiden Wahrmöglichkeiten für den Benutzer.

3. Registrieren Sie den Guard in der Datei ``shared.module.ts``.

	<details>
	<summary>Code anzeigen</summary>
	<p>
	
	```TypeScript
	@NgModule({
	  [...]
	  providers: [
	    [...],
	    CanDeactivateGuard
	  ],
	  [...]
	})
	export class SharedModule { }
	```
	
	</p>
	</details>

6. Registrieren Sie den Guard auch in der Datei ``flight-booking.routes.ts``:

	<details>
	<summary>Code anzeigen</summary>
	<p>
	
	```TypeScript
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


7. Testen Sie Ihre Lösung.

## Bonus: Login **

Erweitern Sie den ``AuthService``, sodass er unter Verwendung hartcodierter Daten prüft, ob eine bestimmte Benutzername/Passwort-Kombination existiert. Nutzen Sie diesen Service in der Methode ``login`` des ``AuthService``. Erweitern Sie die Login-Maske, sodass der Benutzer hier Benutzername und Passwort erfassen kann. Falls Sie ``ngModel`` verwenden, stellen Sie sicher, dass das ``FormsMoudle`` ins ``AppModule`` importiert wird.


## Bonus: Resolver *

In dieser Übung werden Sie einen Resolver schreiben, der einen Flug anhand der Id in der Url für die ``FlightEditComponent`` lädt. Dazu werden Sie auch den FlightService um eine Methode ``findById`` erweitern.

Sie können sich dabei am folgenden Ablauf orientieren:

1. Erweitern Sie den ``FlightService`` (``flight.service.ts``) um eine Methode ``findById``, die anhand einer übergebenen Id einen Flug als ``Observable<Flight>`` liefert.

	<details>
	<summary>Code anzeigen</summary>
	<p>
	
	```TypeScript
	findById(id: string): Observable<Flight> {
	  let url = 'http://www.angular.at/api/flight';
	  let params = new HttpParams().set('id', id);
	  let headers = new HttpHeaders().set('Accept', 'application/json');
	
	  return this.http.get<Flight>(url, {params, headers});
	}
	```
	
	</p>
	</details>

2. Erstellen Sie im Ordner ``src/app/flight-booking/flight-search`` eine Datei ``flight.resolver.ts``, die die Id aus der Url entnimmt und mit dem ``FlightService`` den gewünschten Flug lädt.

	<details>
	<summary>Code anzeigen</summary>
	<p>
	
	```TypeScript
	@Injectable()
	export class FlightResolver implements Resolve<Flight> {
	
	  constructor(private flightService: FlightService) {
	  }
	
	  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Flight>  {
	    let id = route.params['id'];
	    return this.flightService.findById(id); 
	  }
	
	}
	```
	
	</p>
	</details>

3. Registrieren Sie den ``FlightResolver`` in der Datei ``flight-booking.module.ts``.

	<details>
	<summary>Code anzeigen</summary>
	<p>
	
	```TypeScript
	@NgModule({
		[...]  
		providers: [
	    	FlightResolver,
			[...]
		],
		[...]  
	})
	export class FlightBookingModule { }
	```
	
	</p>
	</details>

4. Hinterlegen Sie den ``FlightResolver`` in der Datei ``flight-booking.routes.ts`` bei der Route ``flight-edit``.

	<details>
	<summary>Code anzeigen</summary>
	<p>

	```TypeScript
	[...]
	{
	  path: 'flight-edit/:id',
	  component: FlightEditComponent,
	  canDeactivate: [CanDeactivateGuard],
	  resolve: {
	    flight: FlightResolver
	  }
	}
	[...]
	```

	</p>
	</details>


5. Ändern Sie die Datei ``flight-edit.component.ts``, sodass der vom Resolver geladene Flug entgegengenommen wird.

	<details>
	<summary>Code anzeigen</summary>
	<p>
	
	```TypeScript
	export class FlightEditComponent implements OnInit, CanDeactivateComponent {

	
	  [...]
	  flight: Flight;
	
	  constructor(
	    private route: ActivatedRoute) { }
	
	  ngOnInit() {
	    this.route.params.subscribe(p => {
	      this.id = p['id'];
	      this.showDetails = p['showDetails'];
	    });
	
	    this.route.data.subscribe(data => {
	      this.flight = data['flight'];
	    });
	  }

	  [...]
	
	}
	```
	
	</p>
	</details>


6. Geben Sie im Template der ``FlightEditComponent`` (``flight-edit.component.ts``) die Eigenschaft ``flight`` aus:

	```HTML
	<pre>{{flight | json}}</pre>
	```

7. Testen Sie Ihre Lösung. 


## Bonus: Loading Indicator *

Diese Übung setzt voraus, dass Sie in der vorherigen Übung einen ``FlightResolver`` umgesetzt haben.

1. Lassen Sie sich in der Datei ``app.component.ts`` den ``Router`` injizieren und nutzen Sie seine Events um zu ermitteln, ob ein Loading Indicator anzuzeigen ist:

	```TypeScript
	export class AppComponent  {
	
	  showLoadingIndicator: boolean = false;
	
	  constructor(private router: Router) {

        router.events.filter( 
                       e => e instanceof NavigationStart
                            || e instanceof GuardsCheckEnd)
              .subscribe(event => {
                     this.showLoadingIndicator = true;
              });

        router.events.filter(
                       e => e instanceof NavigationEnd
                            || e instanceof  NavigationError
                            || e instanceof NavigationCancel
                            || e instanceof GuardsCheckStart )
              .subscribe(event => {
                     this.showLoadingIndicator = false;
              });

       }
	}
	
	```

2. Fügen Sie am Ende der ``app.component.html`` einen Loading Indicator ein:

	```HTML
	<div style="z-index: 50" class="loading-indicator" *ngIf="showLoadingIndicator">
	  <div class="spinner">
	    <div class="double-bounce1"></div>
	    <div class="double-bounce2"></div>
	  </div>
	</div>
	```

3. Fügen Sie in die ``app.component.css`` die folgenden Formatierungen für den Loading Indicator ein:

	```CSS
	.loading-indicator {
	    position: fixed;
	    left: 0px;
	    top: 0px;
	    width: 100%;
	    height: 100%;
	    background-color: black;
	    opacity: 0.3;
	}
	
	.spinner {
	    width: 40px;
	    height: 40px;
	
	    position: relative;
	    margin: 100px auto;
	}
	
	.double-bounce1, .double-bounce2 {
	    width: 100%;
	    height: 100%;
	    border-radius: 50%;
	    background-color: #FFF;
	    opacity: 0.6;
	    position: absolute;
	    top: 0;
	    left: 0;
	
	    -webkit-animation: sk-bounce 2.0s infinite ease-in-out;
	    animation: sk-bounce 2.0s infinite ease-in-out;
	}
	
	.double-bounce2 {
	    -webkit-animation-delay: -1.0s;
	    animation-delay: -1.0s;
	}
	
	@-webkit-keyframes sk-bounce {
	    0%, 100% { -webkit-transform: scale(0.0) }
	    50% { -webkit-transform: scale(1.0) }
	}
	
	@keyframes sk-bounce {
	    0%, 100% {
	        transform: scale(0.0);
	        -webkit-transform: scale(0.0);
	    } 50% {
	          transform: scale(1.0);
	          -webkit-transform: scale(1.0);
	      }
	}
	```

4. Fügen Sie zum Testen des Loading Indicators in der Datei ``flight.resolver.ts`` einen Dalay ein:

	```TypeScript
	@Injectable()
	export class FlightResolver implements Resolve<Flight> {
	
	  constructor(private flightService: FlightService) {
	  }
	
	  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Flight>  {
	    let id = route.params['id'];
	    return this.flightService.findById(id).pipe(delay(3000)); // <-- delay!
	  }
	
	}
	```

5. Testen Sie Ihre Lösung und stellen Sie fest, dass beim Abrufen der ``FlightEditComponent`` der Loading Indicator erscheint.

6. Entfernen Sie das ``Delay`` wieder aus der Datei ``flight.resolver.ts``.

## Lazy Loading

### Lazy Loading konfigurieren

In diesem Teil der Übung werden Sie das ``FlightBookingModule`` per Lazy Loading laden.

1. Ergänzen Sie die Datei ``app.routes.ts`` um eine weitere Route, die das ``FlightBookingModule`` via Lazy Loading lädt.

	<details>
	<summary>Code anzeigen</summary>
	<p>
	
	```TypeScript
	export const APP_ROUTES: Routes = [
	  {
	    path: '',
	    redirectTo: 'home',
	    pathMatch: 'full'
	  },
	  {
	    path: 'home',
	    component: HomeComponent
	  },
	  {
	    path: 'flight-booking',
	    loadChildren: './flight-booking/flight-booking.module#FlightBookingModule',
	    data: {
	      preload: true
	    }
	  },
	  [...],
	  {
	    path: '**', // <-- Catch-All-Route muss die letzte Route sein!
        [...]
      }
	]
	```
	
	</p>
	</details>


2. Öffnen Sie die Datei ``flight-booking.routes.ts`` und setzen Sie den Pfad für die ``FlightBookingComponent`` auf einen Leerstring. Entfernen Sie auch alle Verweise auf ``AuthGuards``. Diese machen vorerst Probleme. Die Lösung dazu wird weiter unten in einer eigenen Übung beschrieben.

	<details>
	<summary>Code anzeigen</summary>
	<p>
	
	```TypeScript
	export const FLIGHT_BOOKING_ROUTES: Routes = [
		{
	    	// path: 'flight-booking', // <-- Before
			path: '', // <-- Now
		    component: FlightBookingComponent,
		    // canActivate:[AuthGuard], // <-- Remove all AuthGuards (for now)
			[...]
		}
		[...]
	}
	```
	
	</p>
	</details>


3. Öffnen Sie die Datei ``app.module.ts`` und stellen Sie sicher, dass das ``FlightBookingModule`` hier nicht mehr importiert wird. 

	<details>
	<summary>Code anzeigen</summary>
	<p>
	
	```TypeScript
	@NgModule({
  		imports: [
    		BrowserModule,
    		HttpClientModule,
    		// FlightBookingModule,	// <-- This would prevent lazy loading
    		RouterModule.forRoot(APP_ROUTES),
			[...]
    	],
		[...]
	})
	export class AppModule { }
	```

	
	</p>
	</details>

	Eine Referenz auf das ``FlightBookingModule`` würde dazu führen, dass es im Hauptbundle landet und das würde wiederum Lazy Loading verhindern.

4. Betrachten Sie die Ausgaben der Angular CLI und stellen Sie fest, dass diese nun ein Bundle ``flight-booking.module.chunk.js`` generiert hat.

5. Testen Sie Ihre Lösung im Browser. Wechseln Sie auf das Registerblatt ``Network`` in den Dev Tools (F12) und vergewissern Sie sich, dass das Modul erst bei Bedarf geladen wird.


## Preloading

1. Öffnen Sie die Datei ``app.module.ts`` und geben Sie beim Aufruf von ``RouterModule.forRoot`` die Preloading Strategie ``PreloadAllModules`` an.

	<details>
	<summary>Code anzeigen</summary>
	<p>
	
	```TypeScript
	@NgModule({
	  imports: [
		[...]    
		RouterModule.forRoot(
	      APP_ROUTES, 
	      {
	        preloadingStrategy: PreloadAllModules
	      }),
	    [...]
	  ],
	  [...]
	})
	export class AppModule { }
	```
	
	</p>
	</details>


2. Wechseln Sie im Browser in das Registerblatt ``Network`` der Developer Tools und vergewissern Sie sich, dass das ``FlightBookingModule`` per Lazy Loading unmittelbar nach den Anwendungsstart geladen wird.


## Problem mit Shared Services lösen

In dieser Übung werden Sie Ihr ``SharedModule`` über eine statische Methode ``forRoot`` mit Services und mit einer statischen Methode ``forChild`` ohne Services anbieten. Dadurch, dass sie forRoot **nur** beim ``AppModule`` verwenden, stellen Sie sicher, dass es nur einen einzigen globalen AuthService gibt. Somit können Sie im per Lazy Loading geladenen Module auf den aktuellen Benutzernamen zugreifen und den oben beschriebenen ``AuthGuard`` wieder aktivieren.

1. Geben Sie in der ``PassengerSearchComponent`` den aktuellen Benutzernamen aus:

	```TypeScript
	export class PassengerSearchComponent implements OnInit {
	
	  constructor(private authService: AuthService) { }
	
	  ngOnInit() {
	    console.debug('userName', this.authService.userName);
	  }
	
	}
	```

2. Starten Sie die Anwendung und melden Sie sich an. Stellen Sie fest, dass nach dem Anmelden der Benutzername ausgegeben wird.

3. Wechseln Sie zur Passagiersuche und stellen Sie fest, dass nun auf der JavaScript-Konsole anstatt des Benutzernames lediglich ``undefined`` ausgegeben wird. 

1. Öffnen Sie die Datei ``shared.module.ts``. Führen Sie eine statische Methode ``forRoot`` und eine statische Methode ``forChild`` ein und stellen Sie sicher, dass nur ``forRoot`` die Provider ausliefert.

	<details>
	<summary>Code anzeigen</summary>
	<p>
	
	```TypeScript
	@NgModule({
	  imports: [
	    [...]
	  ],
	  declarations: [
	    [...]
	  ],
	  providers: [ /* Keine Provider hier, siehe forRoot */ ],
	  exports: [
	    [...]
	  ]
	})
	export class SharedModule {
	
	  static forChild(): ModuleWithProviders {
	    return {
	      ngModule: SharedModule,
	      providers: [ /* Keine Provider hier, siehe forRoot */ ]
	    }
	  }
	
	  static forRoot(): ModuleWithProviders {
	    return {
	      ngModule: SharedModule,
	      providers: [
	        AuthService,
	        [...] // Eventuelle andere Services hier
	      ]
	    }
	  }
	
	}
	```

	
	</p>
	</details>


2. Stellen Sie sicher, dass in der ``app.module.ts`` das ``SharedModule`` mittels ``forRoot`` importiert wird.

	<details>
	<summary>Code anzeigen</summary>
	<p>
	
	```TypeScript
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


3. Stellen Sie auch sicher, dass in der Datei ``flight.booking.module.ts`` das ``SharedModule`` mittels ``forChild`` importiert wird.

	<details>
	<summary>Code anzeigen</summary>
	<p>
	
	```TypeScript
	@NgModule({
	  	imports: [
			[...]    
			SharedModule.forChild()
	  	],
		[...]
	})
	export class FlightBookingModule { }
	```
	
	</p>
	</details>


4. Testen Sie die Anwendung und vergewissern Sie sich, dass nun die ``PassengerSearchComponent`` den richtigen Benutzernamen auf die JavaScript-Konsole schreibt.

5. Falls Sie weiter oben einen ``AuthGuard`` geschrieben haben, können Sie diesen nun (wieder) in der Datei ``flight-booking.routes.ts`` aktivieren.

	<details>
	<summary>Code anzeigen</summary>
	<p>
	
	```TypeScript
	export const FLIGHT_BOOKING_ROUTES: Routes = [
		{
			path: '', // <-- Now
		    component: FlightBookingComponent,
		    canActivate:[AuthGuard], // <-- Add AuthGuard
			[...]
		}
		[...]
	}
	```
	
	</p>
	</details>

## Alternative: Treeshakable Providers

In dieser Übung verwenden Sie die mit Angular 6 eingeführten treeshakable Provider, um das Problem mit Shared Services und Lazy Loading zu lösen.

1. Entfernen Sie alle Referenzen auf den ``AuthService`` aus dem ``SharedModule``:

```TypeScript
@NgModule({ ... })
export class SharedModule {

	static forChild(): ModuleWithProviders {
		return {
			ngModule: SharedModule,
			providers: [ /* Keine Provider hier, siehe forRoot */ ]
		}
	}

	static forRoot(): ModuleWithProviders {
		return {
			ngModule: SharedModule,
			providers: [
				// AuthService, // <-- AuthService wird entfernt!
				[...] // Eventuelle andere Services hier
			]
		}
	}

}
```

2. Öffnen Sie den ``AuthService`` und ergänzen Sie seine Metadaten wie folgt:

```TypeScript


```

## Bonus: Eigene Preloading Strategy **

In diesem Teil der Übung werden Sie eine eigene ``PreloadingStrategy`` implementieren, die nur bestimmte, über das ``data``-Attribut markierte Routen vorlädt. Dazu werden Sie jene Routen, die es vorzuladen gilt, in der Routen-Konfiguration mit einem Boolean markieren.

1. Erstellen Sie im Ordner ``shared`` einen Ordner ``preloadig``.

2. Erstellen Sie im neuen Ordner ``preloading`` eine Datei ``custom-preloading-strategy.ts``, die die oben erwähnte Aufgabe umsetzt.

	<details>
	<summary>Code anzeigen</summary>
	<p>
	
	```TypeScript
	@Injectable()
	export class CustomPreloadingStrategy implements PreloadingStrategy {
	
	  preload(route: Route, fn: () => Observable<any>): Observable<any> {
	
	    if (route.data && route.data['preload']) {
	      return fn();
	    }
	
	    return of(null);
	
	  }
	}
	```
	
	</p>
	</details>


3. Registrieren Sie die ``CustomPreloadingStrategy`` im Rahmen eines Providers in der Datei ``shared.module.ts``.

	<details>
	<summary>Code anzeigen</summary>
	<p>
	
	```TypeScript
	@NgModule({
		[...]
		providers: [ 
			[...]
			CustomPreloadingStrategy
			[...]
	  	],
	  	[...]
	})
	export class SharedModule {	
	}
	```
	
	</p>
	</details>

4. Hinterlegen Sie in der Datei ``app.routes.ts`` für die Route ``flight-booking`` in der Eigenschaft ``data``, dass die Route vorgeladen weden soll.

	<details>
	<summary>Code anzeigen</summary>
	<p>
	
	```TypeScript
	{
	  path: 'flight-booking',
	  loadChildren: './flight-booking/flight-booking.module#FlightBookingModule',
	  data: {
	    preload: true
	  }
	},
	[...]
	{
		path: '**',			// Diese Route muss die letzte sein!
		redirectTo: 'home'
	}
	``` 
	
	</p>
	</details>
	
	Hinweis: Über die Eigenschaft ``data`` können Sie beliebige Zusatzinformationen für eine Route hinterlegen.

5. Öffnen Sie die Datei ``app.module.ts`` und übergeben Sie die neue ``CustomPreloadingStrategy`` an ``forRoot``:

	<details>
	<summary>Code anzeigen</summary>
	<p>
	
	```TypeScript
	@NgModule({
	  imports: [
		[...]    
		RouterModule.forRoot(
	      APP_ROUTES, 
	      {
	        preloadingStrategy: CustomPreloadingStrategy
	      }),
	    [...]
	  ],
	  [...]
	})
	export class AppModule { }
	```
	
	</p>
	</details>

6. Testen Sie Ihre Lösung und stellen Sie unter Verwendung des Registerblatts ``Network`` in den Dev Tools fest, dass Preloading stattfindet.

7. Ändern Sie in der Datei ``app.routes.ts`` und geben Sie im data-Attribut an, dass ``flight-booking`` nicht mehr vorgeladen werden soll.
 
	<details>
	<summary>Code anzeigen</summary>
	<p>
	
 	```TypeScript
	{
	  path: 'flight-booking',
	  loadChildren: './flight-booking/flight-booking.module#FlightBookingModule',
	  data: {
	    preload: false
	  }
	},
	```   
	
	</p>
	</details>

8. Testen Sie Ihre Lösung erneut und stellen Sie fest, dass nun kein Preloading mehr stattfindet.
