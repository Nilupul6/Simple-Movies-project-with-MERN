
import { PiBookOpenTextLight } from 'react-icons/pi';
import { BiUserCircle} from 'react-icons/bi';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineDelete } from 'react-icons/md';
import { Link } from 'react-router-dom';

const MovieSingleCard = ({movie}) => {
  return (
    <div 
    key={movie._id}
    className='border-2 border-gray-500 rounded-lg px-4 py-2 m-4 relative hover:shadow-x1'>
        <h2 className='absolute top-1 right-2 px-4 py-1 bg-red-300 rounded-lg'>
            {movie.releaseYear}
        </h2>
        <h4 className='my-2 text-gray-500'>{movie._id}</h4>
        <div className='flex justify-start items-center gap-x-2'>
            <PiBookOpenTextLight className='text-red-300 text-2xl' />
            <h2 className='my-1'>{movie.name}</h2>

        </div>
        <div className='fles justify-start items-center gap-x-2'>
            <BiUserCircle className='text-red-300 text-2xl'/>
            <h2 className='my-1'>{movie.duration}</h2>
        </div>
        <div className='flex justify-between item-center gap-x-2 mt-4 p-4'>
              <Link to={`/movie/detail/${movie._id}`}>
                <BsInfoCircle className="text-2xl text-green-800 hover:text-black" />
              </Link>
              <Link to={`/movie/edit/${movie._id}`}>
                <AiOutlineEdit className="text-2xl text-yellow-800 hover:text-black" />
              </Link>
              <Link to={`/movie/delete/${movie._id}`}>
                <MdOutlineDelete className="text-2xl text-red-800 hover:text-black" />
              </Link>

        </div>
    </div>
  )
}

export default MovieSingleCard