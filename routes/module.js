var express = require('express');
var router = express.Router();
var Module = require('../lib/models/models.js').Module;
var Thing = require('../lib/models/models.js').Thing;

/* GET modules page. */
router.get('/list', function(req, res) {
  Module.getAll(function(err, modules){
    res.render('modules', { result: modules });
  });
});

/* GET create module page. */
router.get('/create', function(req, res) {
  res.render('module_create', { module: req.query });
});

/* GET remove IO relation */
router.get('/:id/remove/:type/:tid', function(req, res) {
  Module.removeIO(req.params.type, req.params.id, req.params.tid, function(err){
    if(err){
      res.render('error',{message:err.message, error: err});
      return;
    }

    res.redirect('/module/' + req.params.id);

  });
});

/** 
 * Add a relation to a module
 */
router.post('/:id/add/:type', function(req, res) {
  
  // For local debug
  var debug = false;

  if(debug) console.log('Trying to add', req.params.type, 'relation to module.');

  Thing.getByName(req.body.name, function(err, thing) {
    
    function errHandler(err) {
      if(debug) console.log(err);
      res.render('error',{message:err.message, error: err})
    }

    if (err) return errHandler(err);

    // Callback
    var cb = function (err, theThing) {
      if (err) return errHandler(err);
      Module.get(req.params.id, function(err, module) {
        if (err) return errHandler(err);
        
        if(debug) console.log('Got module and thing, now trying to create relation', theThing);

        module.addRelation(theThing, req.params.type, function(err, result) {
          if (err) return errHandler(err);

          if(debug) console.log('Added', req.params.type, 'relation to module.');

          module[req.params.type + 's'].push(theThing);

          res.render('module',{ module: module, flash: {
            message: req.params.type + " relation added to module " + module.name
          }});
        }); // addRelation

      });
    };

    if (!thing) {
      if(debug) console.log('thing does not exist, creating...');
      return Thing.create(req.body, cb);
    }

    if(debug) console.log('got thing already existing');
    cb(null, thing);
  });
});

/* POST module */
router.post('/create', function(req, res) {
  Module.create(req.body, function(err, module){
    if(err){
      res.render('module_create', { error: err });
      return;
    }

    res.redirect('/module/' + module.id);
  });
});

/* GET module view page */
router.get('/:id', function(req, res) {
  Module.get(req.params.id, function(err, module){
    if(err) {
      res.render('error', { message: err.message, error: err });
      return;
    }

    res.render('module', { module: module });

  });
});

/* GET module edit page */
router.get('/edit/:id', function(req, res) {
  Module.get(req.params.id, function(err, module){
    if(err) {
      res.render('error', { message: err.message, error: err });
      return;
    }

    res.render('module_edit', { module: module });

  });
});

/* GET remove module - return to list */
router.get('/remove/:id', function(req, res) {
  Module.remove(req.params.id, function(err){
    if(err) {
      res.render('error', { message: err.message, error: err });
      return;
    }

    res.redirect('/module/list?remove=success');

  });
});

/* POST module edit page */
router.post('/edit/:id', function(req, res) {
  Module.edit(req.params.id, req.body, function(err){
    if(err) {
      res.render('error', { message: err.message, error: err });
      return;
    }

    res.redirect('/module/' + req.params.id);

  });
});


module.exports = router;
