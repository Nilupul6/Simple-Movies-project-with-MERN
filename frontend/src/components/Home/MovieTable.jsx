import React from 'react'
import { useEffect, useState } from "react";
import Spinner from '../Spinner';
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";

const MovieTable = ({movies}) => {
  return (
    <div>
        <table className="w-full border-separate border-spacing-2">
          <thead>
            <tr>
              <th className="border border-slate-600 rounded-md">No</th>
              <th className="border border-slate-600 rounded-md">Name</th>
              <th className="border border-slate-600 rounded-md">Duration</th>
              <th className="border border-slate-600 rounded-md">Release Year</th>
              <th className="border border-slate-600 rounded-md">Rating</th>
              <th className="border border-slate-600 rounded-md">Operations</th>
            </tr>
          </thead>
          <tbody>
            {movies && movies.length > 0 ? (
              movies.map((movie, index) => (
                <tr key={movie._id} className="h-8">
                  <td className="border border-slate-700 rounded-md text-center">{index + 1}</td>
                  <td className="border border-slate-700 rounded-md text-center">{movie.name}</td>
                  <td className="border border-slate-700 rounded-md text-center">{movie.duration}</td>
                  <td className="border border-slate-700 rounded-md text-center">{movie.releaseYear}</td>
                  <td className="border border-slate-700 rounded-md text-center">{movie.rating}</td>
                  <td className="border border-slate-700 rounded-md text-center">
    
                    <div className="flex justify-center gap-x-4">
                      <Link to={`/movie/detail/${movie._id}`}>
                        <BsInfoCircle className="text-2xl text-green-800" />
                      </Link>
                      <Link to={`/movie/edit/${movie._id}`}>
                        <AiOutlineEdit className="text-2xl text-yellow-800" />
                      </Link>
                      <Link to={`/movie/delete/${movie._id}`}>
                        <MdOutlineDelete className="text-2xl text-red-800" />
                      </Link>
                      </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No movies found.</td>
              </tr>
            )}
          </tbody>
        </table>
    </div>
  )
}

export default MovieTable