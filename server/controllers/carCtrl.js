module.exports = db => {
  return {
    create: (req, res) => {
      // Calcularea taxei de impozit
      let taxa_impozit = 50; // default pentru capacitate < 1500
      
      if (req.body.capacitate_cilindrica > 2000) {
        taxa_impozit = 200;
      } else if (req.body.capacitate_cilindrica >= 1500) {
        taxa_impozit = 100;
      }

      // Creare mașină
      db.models.Car.create({
        marca: req.body.marca,
        model: req.body.model,
        an_fabricatie: req.body.an_fabricatie,
        capacitate_cilindrica: req.body.capacitate_cilindrica,
        taxa_impozit: taxa_impozit
      }).then(car => {
        res.send({ success: true, id: car.id });
      }).catch(err => {
        console.error(err);
        res.status(500).send({ success: false, error: err.message });
      });
    },

    update: (req, res) => {
      // Calcularea taxei de impozit
      let taxa_impozit = 50; // default pentru capacitate < 1500
      
      if (req.body.capacitate_cilindrica > 2000) {
        taxa_impozit = 200;
      } else if (req.body.capacitate_cilindrica >= 1500) {
        taxa_impozit = 100;
      }

      // Actualizare mașină
      db.models.Car.update({
        marca: req.body.marca,
        model: req.body.model,
        an_fabricatie: req.body.an_fabricatie,
        capacitate_cilindrica: req.body.capacitate_cilindrica,
        taxa_impozit: taxa_impozit
      }, { 
        where: { id: req.body.id } 
      }).then(() => {
        res.send({ success: true });
      }).catch(err => {
        console.error(err);
        res.status(500).send({ success: false, error: err.message });
      });
    },

    findAll: (req, res) => {
      db.query(`
        SELECT c.id, c.marca, c.model, c.an_fabricatie, c.capacitate_cilindrica, c.taxa_impozit,
          COALESCE(
            json_agg(
              json_build_object(
                'id', p.id,
                'nume', p.nume,
                'prenume', p.prenume
              )
            ) FILTER (WHERE p.id IS NOT NULL), '[]'
          ) as persons
        FROM "Cars" c
        LEFT JOIN "Junctions" j ON c.id = j.id_car
        LEFT JOIN "Persons" p ON j.id_person = p.id
        GROUP BY c.id
        ORDER BY c.id ASC
      `, { type: db.QueryTypes.SELECT }).then(resp => {
        res.send(resp);
      }).catch(err => {
        console.error(err);
        res.status(500).send({ success: false, error: err.message });
      });
    },

    find: (req, res) => {
      db.query(`
        SELECT c.id, c.marca, c.model, c.an_fabricatie, c.capacitate_cilindrica, c.taxa_impozit,
          COALESCE(
            json_agg(
              json_build_object(
                'id', p.id,
                'nume', p.nume,
                'prenume', p.prenume
              )
            ) FILTER (WHERE p.id IS NOT NULL), '[]'
          ) as persons
        FROM "Cars" c
        LEFT JOIN "Junctions" j ON c.id = j.id_car
        LEFT JOIN "Persons" p ON j.id_person = p.id
        WHERE c.id = ${req.params.id}
        GROUP BY c.id
      `, { type: db.QueryTypes.SELECT }).then(resp => {
        if (resp && resp.length > 0) {
          res.send(resp[0]);
        } else {
          res.status(404).send({ success: false, error: 'Car not found' });
        }
      }).catch(err => {
        console.error(err);
        res.status(500).send({ success: false, error: err.message });
      });
    },

    destroy: (req, res) => {
      // La ștergerea unei mașini, se vor șterge automat și
      // juncțiunile datorită configrației CASCADE din model
      db.models.Car.destroy({
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