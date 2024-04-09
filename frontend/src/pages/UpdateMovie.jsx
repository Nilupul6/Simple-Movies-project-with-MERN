import React, { useState, useEffect } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateMovie = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [rating, setRating] = useState('');
  const [totalRating, setTotalRating] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [genres, setGenres] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [coverImage, setCoverImage] = useState('');
  const [actors, setActors] = useState([]);
  const [price, setPrice] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const {id} = useParams();

  useEffect(()=>{
    setLoading(true);
    axios
      .get(`http://127.0.0.1:3000/api/v1/movie/${id}`)
      .then((res)=>{
        setName(res.data.data.name);
        setDescription(res.data.data.description);
        setDuration(res.data.data.duration);
        setRating(res.data.data.rating);
        setTotalRating(res.data.data.totalRating);
        setReleaseYear(res.data.data.releaseYear);
        setReleaseDate(res.data.data.releaseDate);
        setGenres(res.data.data.genres);
        setDirectors(res.data.data.directors);
        setCoverImage(res.data.data.coverImage);
        setActors(res.data.data.actors);
        setPrice(res.data.data.price);
        setLoading(false);
      })
      .catch((error)=>{
        setLoading(false);
        console.log(error);
      })


  },[])

  const handleUpdateMovie = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Validate required fields
    if (!name || !description || !duration || !rating || !releaseYear || !genres.length || !directors.length || !actors.length || !coverImage || !price) {
      setError('Please fill in all fields.');
      return;
    }

    const data = {
      name,
      description,
      duration,
      rating,
      totalRating,
      releaseYear,
      releaseDate,
      genres,
      directors,
      coverImage,
      actors,
      price
    };
    console.log(data);
    setLoading(true);
    setError('');

    axios
      .patch(`http://localhost:3000/api/v1/movie/${id}`, data)
      .then(() => {
        setLoading(false);
        navigate('/');
        // Optionally, show a success message or redirect
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setError('Failed to save the movie. Please try again.');
      });
  };

  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Create Movie</h1>
      {loading && <Spinner />}
      {error && <div className='text-red-500'>{error}</div>}
      <form className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto' onSubmit={handleUpdateMovie}>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
            placeholder='Name'
            required
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
            placeholder='Description'
            required
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Duration</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
            placeholder='Duration'
            required
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Rating</label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
            placeholder='Rating'
            required
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Total Rating</label>
          <input
            type="number"
            value={totalRating}
            onChange={(e) => setTotalRating(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
            placeholder='Total Rating'
            required
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Release Year</label>
          <input
            type="number"
            value={releaseYear}
            onChange={(e) => setReleaseYear(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
            placeholder='Release Year'
            required
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Release Date</label>
          <input
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
            placeholder='Release Year'
            required
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Genre</label>
          <input
            type="text"
            value={genres}
            onChange={(e) => setGenres(e.target.value.split(','))}
            className='border-2 border-gray-500 px-4 py-2 w-full'
            placeholder='Genre (comma-separated)'
            required
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Directors</label>
          <input
            type="text"
            value={directors}
            onChange={(e) => setDirectors(e.target.value.split(','))}
            className='border-2 border-gray-500 px-4 py-2 w-full'
            placeholder='Directors (comma-separated)'
            required
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Cover Image</label>
          <input
            type="text"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
            placeholder='Cover Image URL'
            required
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Actors</label>
          <input
            type="text"
            value={actors}
            onChange={(e) => setActors(e.target.value.split(','))}
            className='border-2 border-gray-500 px-4 py-2 w-full'
            placeholder='Actors (comma-separated)'
            required
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
            placeholder='Price'
            required
          />
        </div>
        <button type='submit' className='p-2 bg-sky-300 m-8'>
          Save
        </button>
      </form>
    </div>
  );
};

export default UpdateMovie;
