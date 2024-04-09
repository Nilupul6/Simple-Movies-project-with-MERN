import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';

const DetailMovie = () => {
  const [movie, setMovie] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3000/api/v1/movie/${id}`)
      .then((response) => {
        setMovie(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);
  return (
    <div className='p-4'>
        <BackButton />
        <h1 className='text-3xl my-4'>Show Movie</h1>
        {loading ? (
            <Spinner />
        ) : (
            <div className='flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4'>
                <div className='my-4'>
                     <span className='text-xl mr-4 text-gray-500'>ID : </span>
                     {movie._id}
                </div>
                <div className='my-4'>
                     <span className='text-xl mr-4 text-gray-500'>Name : </span>
                     {movie.name}
                </div>
                <div className='my-4'>
                     <span className='text-xl mr-4 text-gray-500'>Description : </span>
                     {movie.description}
                </div>
                <div className='my-4'>
                     <span className='text-xl mr-4 text-gray-500'>Duration : </span>
                     {movie.duration}
                </div>
                <div className='my-4'>
                     <span className='text-xl mr-4 text-gray-500'>Rating : </span>
                     {movie.rating}
                </div>
                <div className='my-4'>
                     <span className='text-xl mr-4 text-gray-500'>TotalRating : </span>
                     {movie.totalRating}
                </div>
                <div className='my-4'>
                     <span className='text-xl mr-4 text-gray-500'>Release Year : </span>
                     {movie.releaseYear}
                </div>
                <div className='my-4'>
                        <span className='text-xl mr-4 text-gray-500'>Genre :</span>
                        {movie.genres}
                </div>
                <div className='my-4'>
                     <span className='text-xl mr-4 text-gray-500'>Directors : </span>
                     {movie.directors}
                </div>
                <div className='my-4'>
                     <span className='text-xl mr-4 text-gray-500'>Actors : </span>
                     {movie.actors}
                </div>
                <div className='my-4'>
                     <span className='text-xl mr-4 text-gray-500'>Price :</span>
                     {movie.price}
                </div>
            </div>
        )}
    </div>
  )
}

export default DetailMovie