import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PersoaneModalComponent } from './persoane-modal/persoane-modal.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-persoane',
  templateUrl: './persoane.component.html',
  styleUrls: ['./persoane.component.scss']
})
export class PersoaneComponent implements OnInit {
  persons: any[] = [];
  filteredPersons: any[] = [];
  searchTerm: string = '';

  constructor(
    private personService: PersonService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadPersons();
  }

  loadPersons(): void {
    this.personService.getPersons().subscribe(
      data => {
        this.persons = data;
        this.filteredPersons = [...this.persons];
      },
      error => {
        this.toastr.error('Eroare la încărcarea persoanelor!');
        console.error(error);
      }
    );
  }

  openModal(person?: any): void {
    const modalRef = this.modalService.open(PersoaneModalComponent, { size: 'lg' });
    modalRef.componentInstance.person = person ? { ...person } : null;
    
    modalRef.result.then(
      result => {
        if (result) {
          this.loadPersons();
          this.toastr.success(
            person ? 'Persoana a fost actualizată cu succes!' : 'Persoana a fost adăugată cu succes!'
          );
        }
      },
      () => {}
    );
  }

  confirmDelete(person: any): void {
    const modalRef = this.modalService.open(ConfirmDialogComponent, { backdrop: 'static', keyboard: false });
    modalRef.componentInstance.title = 'Confirmare ștergere';
    modalRef.componentInstance.content = `<p class="text-center">Sigur doriți să ștergeți persoana ${person.nume} ${person.prenume}?</p>`;
    
    modalRef.result.then(
      () => {
        // Confirmă ștergerea
        this.deletePerson(person.id);
      },
      () => {
        // Anulare - nu face nimic
      }
    );
  }

  deletePerson(id: number): void {
    this.personService.deletePerson(id).subscribe(
      () => {
        this.loadPersons();
        this.toastr.success('Persoana a fost ștearsă cu succes!');
      },
      error => {
        this.toastr.error('Eroare la ștergerea persoanei!');
        console.error(error);
      }
    );
  }

  onSearch(): void {
    const search = this.searchTerm.toLowerCase();
    
    if (!search) {
      this.filteredPersons = [...this.persons];
      return;
    }
    
    this.filteredPersons = this.persons.filter(person => 
      person.nume.toLowerCase().includes(search) ||
      person.prenume.toLowerCase().includes(search) ||
      person.cnp.toLowerCase().includes(search) ||
      person.varsta.toString().includes(search) ||
      this.carListToString(person.cars).toLowerCase().includes(search)
    );
  }

  carListToString(cars: any[]): string {
    if (!cars || cars.length === 0) {
      return '';
    }
    
    return cars.map(car => 
      `${car.marca} ${car.model} ${car.an_fabricatie} ${car.capacitate_cilindrica} ${car.taxa_impozit}`
    ).join(' ');
  }
}
