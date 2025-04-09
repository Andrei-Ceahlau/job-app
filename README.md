# Aplicație de Gestionare Persoane și Mașini

Această aplicație permite gestionarea persoanelor și a mașinilor asociate acestora, implementând funcționalități CRUD complete (Create, Read, Update, Delete) pentru ambele entități.

## Cerințe de sistem

- Node.js (v18.12.0 recomandat)
- npm (v8.19.2 recomandat)
- PostgreSQL (v14 sau mai recent)

## Structură proiect

Proiectul este împărțit în două componente principale:

- `server/` - Backend API dezvoltat cu Node.js, Express și Sequelize
- `client/` - Frontend dezvoltat cu Angular

## Pași de instalare și pornire

### 1. Clonarea repository-ului

```bash
git clone https://github.com/Andrei-Ceahlau/job-app.git
cd job-app
```

### 2. Configurarea bazei de date PostgreSQL

1. Instalați PostgreSQL dacă nu aveți deja:

   - Windows: Descărcați de la [postgresql.org](https://www.postgresql.org/download/windows/)
   - macOS: `brew install postgresql`
   - Linux: `sudo apt install postgresql postgresql-contrib`

2. Creați o bază de date nouă:

   ```sql
   CREATE DATABASE todo_app;
   ```

3. Configurați credențialele în fișierul `.env` din rădăcina proiectului:
   ```
   DB_USER=postgres
   DB_PASSWORD=parola_ta
   DB_NAME=todo_app
   DB_HOST=localhost
   ```

### 3. Instalarea dependențelor

Instalați dependențele pentru server și client:

```bash
# Instalare dependențe server
npm install

# Instalare dependențe client
cd client
npm install
cd ..
```

### 4. Pornirea aplicației

Metoda 1: Pornirea separată a serverului și clientului

```bash
# Terminal 1 - Pornire server
npm run dev
# sau
nodemon server/app.js

# Terminal 2 - Pornire client
cd client
ng serve
```

Metoda 2: Pornire combinată (după build-ul clientului)

```bash
# Build client
cd client
ng build
cd ..

# Pornire server (va servi și fișierele client)
npm start
```

### 5. Accesarea aplicației

- Backend API: [http://localhost:8080](http://localhost:8080)
- Frontend (când rulează separat): [http://localhost:3000](http://localhost:3000) (sau portul configurat)
- Frontend (când rulează după build): [http://localhost:8080](http://localhost:8080)

## Funcționalități implementate

### Componenta Persoane

- Vizualizarea listei de persoane cu detalii
- Adăugarea unei persoane noi (nume, prenume, CNP, vârstă)
- Editarea unei persoane existente
- Ștergerea unei persoane (cu confirmare)
- Filtrarea persoanelor după diverse criterii
- Asocierea mai multor mașini unei persoane

### Componenta Mașini

- Vizualizarea listei de mașini cu detalii
- Adăugarea unei mașini noi (marcă, model, an fabricație, capacitate cilindrică)
- Editarea unei mașini existente
- Ștergerea unei mașini (cu confirmare)
- Filtrarea mașinilor după diverse criterii
- Calculul automat al taxei de impozit în funcție de capacitatea cilindrică:
  - < 1500 cm³: 50 lei
  - 1500-2000 cm³: 100 lei
  - > 2000 cm³: 200 lei

### Componenta Informații

- Vizualizarea informațiilor sistemului
- Adăugare/Editare/Ștergere informații

## Structura bazei de date

Aplicația folosește următoarele tabele:

- `Persons` - Stochează datele persoanelor
- `Cars` - Stochează datele mașinilor
- `Junctions` - Tabel de legătură pentru relația many-to-many între persoane și mașini
- `Informations` - Stochează informații diverse despre sistem

## Troubleshooting

1. Dacă întâmpinați eroarea "EADDRINUSE" la pornirea serverului:

   ```bash
   # Opriți toate procesele care rulează pe portul 8080
   pkill -f nodemon
   # sau
   kill $(lsof -t -i:8080)
   ```

2. Dacă apar erori legate de baza de date:

   - Verificați dacă serviciul PostgreSQL rulează
   - Verificați dacă credențialele din fișierul `.env` sunt corecte
   - Verificați dacă baza de date `todo_app` există

3. Dacă vedeți eroarea "nodemon update check failed":

   ```bash
   sudo chown -R $USER:$(id -gn $USER) ~/.config
   ```

4. Dacă clientul Angular nu pornește:
   - Verificați versiunea Node.js (trebuie să fie compatibilă cu Angular)
   - Verificați dacă toate dependențele sunt instalate corect: `cd client && npm install`

## Tehnologii utilizate

- **Backend**:
  - Node.js și Express pentru API
  - Sequelize ca ORM pentru baza de date
  - PostgreSQL pentru persistența datelor
- **Frontend**:
  - Angular 14+
  - Bootstrap pentru design responsive
  - NgBootstrap pentru componente UI
  - Axios pentru request-uri HTTP
  - Font Awesome pentru iconițe

## Dezvoltare ulterioară

Pentru a extinde funcționalitățile aplicației, puteți:

1. Adăuga autentificare și autorizare
2. Implementa dashboard cu statistici
3. Adăuga exporturi în diverse formate (PDF, Excel)
4. Implementa funcții de căutare avansată
5. Adăuga notificări și alerte

## Contact

Pentru întrebări sau probleme legate de această aplicație, vă rugăm să deschideți un issue pe GitHub sau să contactați direct dezvoltatorul.
