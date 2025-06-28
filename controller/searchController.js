import Show from '../models/show.js';
import Venue from '../models/venue.js';

export const searchMoviesByCity = async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ message: 'City is required' });
    }

    // Finding venues in the city
    const venues = await Venue.find({ city });
    const venueIds = venues.map(v => v._id);

    if (venueIds.length === 0) {
      return res.status(404).json({ message: 'No venues found in this city' });
    }

    //Find shows at those venues
    const shows = await Show.find({ venueId: { $in: venueIds } })
      .populate('movieId')   // bring in movie details
      .populate('venueId');  // bring in venue details

    if (shows.length === 0) {
      return res.status(404).json({ message: 'No shows found in this city' });
    }

    const result = shows.map(show => ({
      showId: show._id,
      movie: {
        title: show.movieId.title,
        genre: show.movieId.genre,
        language: show.movieId.language,
        duration: show.movieId.duration
      },
      venue: {
        name: show.venueId.name,
        address: show.venueId.address,
      },
      startTime: show.startTime
    }));

    return res.status(200).json(result);

  } catch (err) {
    console.error('Search Error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};