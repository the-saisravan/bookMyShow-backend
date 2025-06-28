import Movie from '../models/movie.js';
import Venue from '../models/venue.js';
import Show from '../models/show.js';

export const addMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({ message: 'Movie added', movie });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const addVenue = async (req, res) => {
  try {
    const venue = await Venue.create(req.body);
    res.status(201).json({ message: 'Venue added', venue });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const createShow = async (req, res) => {
  try {
    const { movieId, venueId, startTime } = req.body;

    const venue = await Venue.findById(venueId);
    if (!venue) return res.status(404).json({ message: 'Venue not found' });

    const show = await Show.create({
      movieId,
      venueId,
      startTime,
      seatsAvailable: venue.seatLayout,
      seatsBooked: []
    });

    res.status(201).json({ message: 'Show created', show });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};