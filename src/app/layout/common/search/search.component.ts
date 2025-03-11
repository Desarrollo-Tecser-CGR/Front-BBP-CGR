import { Overlay } from '@angular/cdk/overlay';
import { NgClass, NgForOf, NgTemplateOutlet, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { GlobalConstants } from 'app/core/constants/GlobalConstants';
import {
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
    inject,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormControl,
} from '@angular/forms';
import {
    MAT_AUTOCOMPLETE_SCROLL_STRATEGY,
    MatAutocomplete,
    MatAutocompleteModule,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink,  Router, RouterModule  } from '@angular/router';
import { fuseAnimations } from '@fuse/animations/public-api';
import { Subject, debounceTime, filter, map, takeUntil } from 'rxjs';
import { AdvancedSearchModalComponent } from '../advanced-search-modal/advanced-search-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'app/core/user/user.types';

@Component({
    selector: 'search',
    templateUrl: './search.component.html',
    styleUrl : './search.component.scss',
    encapsulation: ViewEncapsulation.None,
    exportAs: 'fuseSearch',
    animations: fuseAnimations,
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        FormsModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        MatOptionModule,
        RouterLink,
        NgTemplateOutlet,
        MatFormFieldModule,
        MatInputModule,
        NgClass,
        RouterModule,
        NgForOf,
        NgIf
    ],
    providers: [
        {
            provide: MAT_AUTOCOMPLETE_SCROLL_STRATEGY,
            useFactory: () => {
                const overlay = inject(Overlay);
                return () => overlay.scrollStrategies.block();
            },
        },
    ],
})
export class SearchComponent implements OnChanges, OnInit, OnDestroy {
    @Input() appearance: 'bar' | 'basic' = 'bar';
    @Input() debounce: number = 300;
    user: User | null = null;
    @Input() minLength: number = 2;
    @Output() search: EventEmitter<any> = new EventEmitter<any>();

    opened: boolean = false;
    resultSets: any[];
    searchControl: UntypedFormControl = new UntypedFormControl();
    private _matAutocomplete: MatAutocomplete;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    

    /**
     * Constructor
     */
    constructor(
        private _elementRef: ElementRef,
        private _httpClient: HttpClient,
        private _renderer2: Renderer2,
        private _dialog: MatDialog,
        private router: Router,
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Host binding for component classes
     */
    @HostBinding('class') get classList(): any {
        return {
            'search-appearance-bar': this.appearance === 'bar',
            'search-appearance-basic': this.appearance === 'basic',
            'search-opened': this.opened,
        };
    }

    /**
     * Setter for bar search input
     *
     * @param value
     */
    @ViewChild('barSearchInput')
    set barSearchInput(value: ElementRef) {
        // If the value exists, it means that the search input
        // is now in the DOM, and we can focus on the input..
        if (value) {
            // Give Angular time to complete the change detection cycle
            setTimeout(() => {
                // Focus to the input element
                value.nativeElement.focus();
            });
        }
    }

    /**
     * Setter for mat-autocomplete element reference
     *
     * @param value
     */
    @ViewChild('matAutocomplete')
    set matAutocomplete(value: MatAutocomplete) {
        this._matAutocomplete = value;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On changes
     *
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges): void {
        // Appearance
        if ('appearance' in changes) {
            // To prevent any issues, close the
            // search after changing the appearance
            this.close();
        }
    }

    /**
     * On init
     */
    ngOnInit(): void {
        const roles = localStorage.getItem('accessRoles');
        const cargo = roles ? JSON.parse(roles)[0] : 'Rol';
        this.user = { cargo } as User;

        this.searchControl.valueChanges
            .pipe(
                debounceTime(this.debounce),
                takeUntil(this._unsubscribeAll),
                map((value) => {
                    // Set the resultSets to null if no value or too short
                    if (!value || value.length < this.minLength) {
                        this.resultSets = null;
                    }
    
                    return value;
                }),
                // Filter out values that don't meet the minLength
                filter((value) => value && value.length >= this.minLength)
            )
            .subscribe((value) => {
                const endpoint = `${GlobalConstants.API_BASE_URL}/api/v1/resume/getIdentity`;
    
                // Llamada GET con parámetros en la URL
                this._httpClient
                    .get(endpoint, { params: { query: value } }) // Pasa el valor como parámetro
                    .subscribe((resultSets: any) => {
                        
                        // Guarda los resultados
                        this.resultSets = resultSets;
    
                        // Emite el evento con los resultados
                        this.search.next(resultSets);
                    }, error => {
                    });
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On keydown of the search input
     *
     * @param event
     */
    onKeydown(event: KeyboardEvent): void {
        // Escape
        if (event.code === 'Escape') {
            // If the appearance is 'bar' and the mat-autocomplete is not open, close the search
            if (this.appearance === 'bar' && !this._matAutocomplete.isOpen) {
                this.close();
            }
        }
    }

    /**
     * Open the search
     * Used in 'bar'
     */
    open(): void {
        // Return if it's already opened
        if (this.opened) {
            return;
        }

        // Open the search
        this.opened = true;
    }

    /**
     * Close the search
     * * Used in 'bar'
     */
    close(): void {
        // Return if it's already closed
        if (!this.opened) {
            return;
        }

        // Clear the search input
        this.searchControl.setValue('');

        // Close the search
        this.opened = false;
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    openAdvancedSearch(): void {
        this.router.navigate(['/inbox']).then(() => {
            const dialogRef = this._dialog.open(AdvancedSearchModalComponent, {
                width: '600px',
                data: {
                    // Puedes pasar parámetros iniciales aquí si es necesario
                },
            });
    
            dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                    // Maneja los datos retornados del modal
                    this.searchControl.setValue(result.query || ''); // Ejemplo: usa el resultado para buscar
                    this.search.emit(result); // Emitir el resultado avanzado
                }
            });
        });
    }


    
}
