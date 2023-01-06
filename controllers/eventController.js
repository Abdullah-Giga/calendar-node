const { JsonWebTokenError } = require('jsonwebtoken');
const Event = require('../models/events');

// Get all events
const events_get = (req, res) => {
    Event.find({user_email : req.user.email}).then((result) => res.status(201).json(result)).catch((err) => console.log(err));
}
// render calendar page
const calendar = (req, res) => {
    res.render('calendar');
}
// render create new event page
const createNew = (req, res) => {
    res.render('create');
}
// New event controller
const createNew_post = async (req, res) => {
    const event = new Event(req.body);
    event.save().then((result) => res.send({result})).catch((err) => console.log(err));
}



// Render edit page
const edit = (req, res) => {
    const id = req.params.id;
    Event.findById(id).then((result) => res.render('edit', {event : result})).catch((err) => console.log(err));
}


// Event edit cotroller
const edit_post = (req, res) => {
    const id = req.params.id;
    console.log("update called")

         Event.findByIdAndUpdate(id,{
            $set:{
                start : req.body.start,
                end: req.body.end,
                name : req.body.name,
                location: req.body.location,
                allDay: req.body.allDay
            }
            },{new: true}
        ).then((result) => res.json({redirect : '/events'})).catch((err) => console.log(err));
        }

// Event delete cotroller
const deleteEvent = (req, res) => {
    const id = req.params.id;
    Event.findByIdAndDelete(id).then((result) => res.json({redirect : '/events'})).catch((err) => console.log(err));
}

module.exports = {events_get, calendar, createNew,createNew_post, edit, edit_post, deleteEvent};