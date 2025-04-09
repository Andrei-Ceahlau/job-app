import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CarService } from '../../../services/car.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-masini-modal',
  templateUrl: './masini-modal.component.html',
  styleUrls: ['./masini-modal.component.scss']
})
export class MasiniModalComponent implements OnInit {
  @Input() car: any;
  carForm!: FormGroup;

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private carService: CarService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.carForm = this.formBuilder.group({
      id: [this.car ? this.car.id : null],
      marca: [this.car ? this.car.marca : '', [Validators.required, Validators.maxLength(255)]],
      model: [this.car ? this.car.model : '', [Validators.required, Validators.maxLength(255)]],
      an_fabricatie: [this.car ? this.car.an_fabricatie : 2022, [Validators.required, Validators.min(1900), Validators.max(9999)]],
      capacitate_cilindrica: [this.car ? this.car.capacitate_cilindrica : 0, [Validators.required, Validators.min(0), Validators.max(9999)]],
      taxa_impozit: [this.car ? this.car.taxa_impozit : 50, [Validators.required]]
    });

    // Calculează taxa de impozit inițială dacă este o mașină nouă
    if (!this.car) {
      this.calculateTax();
    }
  }

  get f(): any {
    return this.carForm.controls;
  }

  calculateTax(): void {
    const capacitate = this.f['capacitate_cilindrica'].value;
    let taxa = 50; // default pentru capacitate < 1500
    
    if (capacitate > 2000) {
      taxa = 200;
    } else if (capacitate >= 1500) {
      taxa = 100;
    }
    
    this.f['taxa_impozit'].setValue(taxa);
  }

  save(): void {
    if (this.carForm.invalid) {
      Object.keys(this.f).forEach(key => {
        const control = this.f[key];
        control.markAsTouched();
      });
      return;
    }

    const carData = this.carForm.value;

    if (this.car) {
      // Update existing car
      this.carService.updateCar(carData).subscribe(
        () => {
          this.activeModal.close(true);
        },
        (error) => {
          this.toastr.error('Eroare la actualizarea mașinii!');
          console.error(error);
        }
      );
    } else {
      // Create new car
      this.carService.createCar(carData).subscribe(
        () => {
          this.activeModal.close(true);
        },
        (error) => {
          this.toastr.error('Eroare la adăugarea mașinii!');
          console.error(error);
        }
      );
    }
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }
}
