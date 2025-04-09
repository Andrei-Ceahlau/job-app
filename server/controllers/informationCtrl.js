module.exports = db => {
  return {
    create: (req, res) => {
      db.models.Information.create(req.body).then(() => {
        res.send({ success: true });
      }).catch(err => {
        console.error(err);
        res.status(500).send({ success: false, error: err.message });
      });
    },

    update: (req, res) => {
      db.models.Information.update(req.body, { where: { id: req.body.id } }).then(() => {
        res.send({ success: true })
      }).catch(err => {
        console.error(err);
        res.status(500).send({ success: false, error: err.message });
      });
    },

    findAll: (req, res) => {
      db.query(`SELECT id, name, type, CASE WHEN liked IS TRUE THEN 'Da' ELSE 'Nu' END AS liked
      FROM "Informations"
      ORDER BY id`, { type: db.QueryTypes.SELECT }).then(resp => {
        res.send(resp);
      }).catch(err => {
        console.error(err);
        res.status(500).send({ success: false, error: err.message });
      });
    },

    find: (req, res) => {
      db.query(`SELECT id, name, type, liked
      FROM "Informations"
      WHERE id = ${req.params.id}`, { type: db.QueryTypes.SELECT }).then(resp => {
        if (resp && resp.length > 0) {
          res.send(resp[0]);
        } else {
          res.status(404).send({ success: false, error: 'Information not found' });
        }
      }).catch(err => {
        console.error(err);
        res.status(500).send({ success: false, error: err.message });
      });
    },

    destroy: (req, res) => {
      db.query(`DELETE FROM "Informations" WHERE id = ${req.params.id}`, { type: db.QueryTypes.DELETE }).then(() => {
        res.send({ success: true });
      }).catch(err => {
        console.error(err);
        res.status(500).send({ success: false, error: err.message });
      });
    }
  };
};
