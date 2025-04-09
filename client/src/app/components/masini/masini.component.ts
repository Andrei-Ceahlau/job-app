import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MasiniModalComponent } from './masini-modal/masini-modal.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CarService } from '../../services/car.service';

@Component({
  selector: 'app-masini',
  templateUrl: './masini.component.html',
  styleUrls: ['./masini.component.scss']
})
export class MasiniComponent implements OnInit {
  cars: any[] = [];
  filteredCars: any[] = [];
  searchTerm: string = '';

  constructor(
    private carService: CarService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars(): void {
    this.carService.getCars().subscribe(
      data => {
        this.cars = data;
        this.filteredCars = [...this.cars];
      },
      error => {
        this.toastr.error('Eroare la încărcarea mașinilor!');
        console.error(error);
      }
    );
  }

  openModal(car?: any): void {
    const modalRef = this.modalService.open(MasiniModalComponent, { size: 'lg' });
    modalRef.componentInstance.car = car ? { ...car } : null;
    
    modalRef.result.then(
      result => {
        if (result) {
          this.loadCars();
          this.toastr.success(
            car ? 'Mașina a fost actualizată cu succes!' : 'Mașina a fost adăugată cu succes!'
          );
        }
      },
      () => {}
    );
  }

  confirmDelete(car: any): void {
    const modalRef = this.modalService.open(ConfirmDialogComponent, { backdrop: 'static', keyboard: false });
    modalRef.componentInstance.title = 'Confirmare ștergere';
    modalRef.componentInstance.content = `<p class="text-center">Sigur doriți să ștergeți mașina ${car.marca} ${car.model}?</p>`;
    
    modalRef.result.then(
      () => {
        // Confirmă ștergerea
        this.deleteCar(car.id);
      },
      () => {
        // Anulare - nu face nimic
      }
    );
  }

  deleteCar(id: number): void {
    this.carService.deleteCar(id).subscribe(
      () => {
        this.loadCars();
        this.toastr.success('Mașina a fost ștearsă cu succes!');
      },
      error => {
        this.toastr.error('Eroare la ștergerea mașinii!');
        console.error(error);
      }
    );
  }

  onSearch(): void {
    const search = this.searchTerm.toLowerCase();
    
    if (!search) {
      this.filteredCars = [...this.cars];
      return;
    }
    
    this.filteredCars = this.cars.filter(car => 
      car.marca.toLowerCase().includes(search) ||
      car.model.toLowerCase().includes(search) ||
      car.an_fabricatie.toString().includes(search) ||
      car.capacitate_cilindrica.toString().includes(search) ||
      car.taxa_impozit.toString().includes(search)
    );
  }
}
