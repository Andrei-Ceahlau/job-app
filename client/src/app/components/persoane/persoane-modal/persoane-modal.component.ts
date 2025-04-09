import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonService } from '../../../services/person.service';
import { CarService } from '../../../services/car.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-persoane-modal',
  templateUrl: './persoane-modal.component.html',
  styleUrls: ['./persoane-modal.component.scss']
})
export class PersoaneModalComponent implements OnInit {
  @Input() person: any;
  personForm!: FormGroup;
  availableCars: any[] = [];

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private personService: PersonService,
    private carService: CarService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.loadCars();
  }

  createForm(): void {
    this.personForm = this.formBuilder.group({
      id: [this.person ? this.person.id : null],
      nume: [this.person ? this.person.nume : '', [Validators.required, Validators.maxLength(255)]],
      prenume: [this.person ? this.person.prenume : '', [Validators.required, Validators.maxLength(255)]],
      cnp: [this.person ? this.person.cnp : '', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
      varsta: [this.person ? this.person.varsta : 0, [Validators.required]],
      cars: [this.person && this.person.cars ? this.person.cars.map((car: any) => car.id) : []]
    });
  }

  get f(): any {
    return this.personForm.controls;
  }

  loadCars(): void {
    this.carService.getCars().subscribe(
      (data) => {
        this.availableCars = data.map((car: any) => ({
          ...car,
          fullName: `${car.marca} ${car.model} (${car.an_fabricatie}) - ${car.capacitate_cilindrica} cm³`
        }));
      },
      (error) => {
        this.toastr.error('Eroare la încărcarea mașinilor!');
        console.error(error);
      }
    );
  }

  calculateAgeFromCNP(): void {
    const cnpValue = this.f['cnp'].value;
    
    if (cnpValue && cnpValue.length === 13) {
      // Extragem anul, luna și ziua din CNP
      let year = parseInt(cnpValue.substring(1, 3), 10);
      const month = parseInt(cnpValue.substring(3, 5), 10);
      const day = parseInt(cnpValue.substring(5, 7), 10);
      
      // Determinăm secolul (1/2 pentru 1900, 5/6 pentru 2000)
      const firstDigit = parseInt(cnpValue.substring(0, 1), 10);
      
      if (firstDigit === 1 || firstDigit === 2) {
        year += 1900;
      } else if (firstDigit === 5 || firstDigit === 6) {
        year += 2000;
      } else {
        // Pentru alte cazuri (3/4 pentru 1800, etc.)
        year += 1900;
      }
      
      // Calculăm vârsta
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      
      // Verificăm dacă ziua de naștere a trecut deja în acest an
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      this.f['varsta'].setValue(age);
    }
  }

  save(): void {
    if (this.personForm.invalid) {
      Object.keys(this.f).forEach(key => {
        const control = this.f[key];
        control.markAsTouched();
      });
      return;
    }

    const personData = this.personForm.value;

    if (this.person) {
      // Update existing person
      this.personService.updatePerson(personData).subscribe(
        () => {
          this.activeModal.close(true);
        },
        (error) => {
          this.toastr.error('Eroare la actualizarea persoanei!');
          console.error(error);
        }
      );
    } else {
      // Create new person
      this.personService.createPerson(personData).subscribe(
        () => {
          this.activeModal.close(true);
        },
        (error) => {
          this.toastr.error('Eroare la adăugarea persoanei!');
          console.error(error);
        }
      );
    }
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }
}
