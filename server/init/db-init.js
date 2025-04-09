module.exports = async (db) => {
  try {
    console.log('Inițializare bază de date...');
    
    // Sincronizare modele cu baza de date (creează tabelele dacă nu există)
    await db.models.Person.sync({ force: true });
    await db.models.Car.sync({ force: true });
    await db.models.Junction.sync({ force: true });
    await db.models.Information.sync({ force: true });
    
    console.log('Tabele create cu succes!');
    
    // Adăugare date de test pentru mașini
    const cars = await db.models.Car.bulkCreate([
      {
        marca: 'Dacia',
        model: 'Logan',
        an_fabricatie: 2020,
        capacitate_cilindrica: 1400,
        taxa_impozit: 50
      },
      {
        marca: 'Volkswagen',
        model: 'Golf',
        an_fabricatie: 2018,
        capacitate_cilindrica: 1600,
        taxa_impozit: 100
      },
      {
        marca: 'BMW',
        model: 'X5',
        an_fabricatie: 2021,
        capacitate_cilindrica: 2500,
        taxa_impozit: 200
      }
    ]);
    
    console.log('Mașini adăugate cu succes!');
    
    // Adăugare date de test pentru persoane
    const persons = await db.models.Person.bulkCreate([
      {
        nume: 'Popescu',
        prenume: 'Ion',
        cnp: '1900101123456',
        varsta: 33
      },
      {
        nume: 'Ionescu',
        prenume: 'Maria',
        cnp: '2910202123456',
        varsta: 32
      }
    ]);
    
    console.log('Persoane adăugate cu succes!');
    
    // Adăugare relații între persoane și mașini
    await db.models.Junction.bulkCreate([
      {
        id_person: persons[0].id,
        id_car: cars[0].id
      },
      {
        id_person: persons[0].id,
        id_car: cars[1].id
      },
      {
        id_person: persons[1].id,
        id_car: cars[2].id
      }
    ]);
    
    console.log('Relații adăugate cu succes!');
    
    // Adăugare date de test pentru informații
    await db.models.Information.bulkCreate([
      {
        name: 'Informație de test 1',
        type: 1,
        liked: true
      },
      {
        name: 'Informație de test 2',
        type: 2,
        liked: false
      }
    ]);
    
    console.log('Informații adăugate cu succes!');
    
    console.log('Inițializare bază de date completă!');
    return true;
  } catch (error) {
    console.error('Eroare la inițializarea bazei de date:', error);
    return false;
  }
}; 