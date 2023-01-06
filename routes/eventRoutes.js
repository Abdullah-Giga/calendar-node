const { Router } = require("express");
const {events_get, calendar, createNew,createNew_post ,edit, edit_post, deleteEvent} = require("../controllers/eventController");
const { requireAuth } = require("../middlewares/authMiddleware");

const router = Router();
// pages
router.get('/events', requireAuth, calendar);

router.get('/events/new', requireAuth, createNew);

router.get('/events/edit/:id', requireAuth, edit);

// requests
router.get('/myEvents', requireAuth, events_get);

router.post('/events', requireAuth, createNew_post);

router.put('/events/edit/:id', requireAuth, edit_post);

router.delete('/events/edit/:id', requireAuth, deleteEvent);    

module.exports = router;