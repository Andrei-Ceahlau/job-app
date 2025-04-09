module.exports = db => {
  return {
    create: (req, res) => {
      // Creare persoană
      db.models.Person.create({
        nume: req.body.nume,
        prenume: req.body.prenume,
        cnp: req.body.cnp,
        varsta: req.body.varsta
      }).then(person => {
        // Adăugare relații în Junction dacă există mașini selectate
        if (req.body.cars && req.body.cars.length > 0) {
          const junctionEntries = req.body.cars.map(carId => ({
            id_person: person.id,
            id_car: carId
          }));

          db.models.Junction.bulkCreate(junctionEntries)
            .then(() => {
              res.send({ success: true, id: person.id });
            })
            .catch(err => {
              console.error(err);
              res.status(500).send({ success: false, error: err.message });
            });
        } else {
          res.send({ success: true, id: person.id });
        }
      }).catch(err => {
        console.error(err);
        res.status(500).send({ success: false, error: err.message });
      });
    },

    update: (req, res) => {
      // Actualizare persoană
      db.models.Person.update({
        nume: req.body.nume,
        prenume: req.body.prenume,
        cnp: req.body.cnp,
        varsta: req.body.varsta
      }, { 
        where: { id: req.body.id } 
      }).then(() => {
        // Ștergere relații existente
        db.models.Junction.destroy({
          where: { id_person: req.body.id }
        }).then(() => {
          // Adăugare relații noi
          if (req.body.cars && req.body.cars.length > 0) {
            const junctionEntries = req.body.cars.map(carId => ({
              id_person: req.body.id,
              id_car: carId
            }));

            db.models.Junction.bulkCreate(junctionEntries)
              .then(() => {
                res.send({ success: true });
              })
              .catch(err => {
                console.error(err);
                res.status(500).send({ success: false, error: err.message });
              });
          } else {
            res.send({ success: true });
          }
        }).catch(err => {
          console.error(err);
          res.status(500).send({ success: false, error: err.message });
        });
      }).catch(err => {
        console.error(err);
        res.status(500).send({ success: false, error: err.message });
      });
    },

    findAll: (req, res) => {
      db.query(`
        SELECT p.id, p.nume, p.prenume, p.cnp, p.varsta,
          COALESCE(
            json_agg(
              json_build_object(
                'id', c.id,
                'marca', c.marca,
                'model', c.model,
                'an_fabricatie', c.an_fabricatie,
                'capacitate_cilindrica', c.capacitate_cilindrica,
                'taxa_impozit', c.taxa_impozit
              )
            ) FILTER (WHERE c.id IS NOT NULL), '[]'
          ) as cars
        FROM "Persons" p
        LEFT JOIN "Junctions" j ON p.id = j.id_person
        LEFT JOIN "Cars" c ON j.id_car = c.id
        GROUP BY p.id
        ORDER BY p.id ASC
      `, { type: db.QueryTypes.SELECT }).then(resp => {
        res.send(resp);
      }).catch(err => {
        console.error(err);
        res.status(500).send({ success: false, error: err.message });
      });
    },

    find: (req, res) => {
      db.query(`
        SELECT p.id, p.nume, p.prenume, p.cnp, p.varsta,
          COALESCE(
            json_agg(
              json_build_object(
                'id', c.id,
                'marca', c.marca,
                'model', c.model,
                'an_fabricatie', c.an_fabricatie,
                'capacitate_cilindrica', c.capacitate_cilindrica,
                'taxa_impozit', c.taxa_impozit
              )
            ) FILTER (WHERE c.id IS NOT NULL), '[]'
          ) as cars
        FROM "Persons" p
        LEFT JOIN "Junctions" j ON p.id = j.id_person
        LEFT JOIN "Cars" c ON j.id_car = c.id
        WHERE p.id = ${req.params.id}
        GROUP BY p.id
      `, { type: db.QueryTypes.SELECT }).then(resp => {
        if (resp && resp.length > 0) {
          res.send(resp[0]);
        } else {
          res.status(404).send({ success: false, error: 'Person not found' });
        }
      }).catch(err => {
        console.error(err);
        res.status(500).send({ success: false, error: err.message });
      });
    },

    destroy: (req, res) => {
      // La ștergerea unei persoane, se vor șterge automat și
      // junțiunile datorită configrației CASCADE din model
      db.models.Person.destroy({
        where: { id: req.params.id }
      }).then(() => {
        res.send({ success: true });
      }).catch(err => {
        console.error(err);
        res.status(500).send({ success: false, error: err.message });
      });
    }
  };
}; 