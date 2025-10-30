import React from 'react'

const PopularProbelmCard = ({problem, description, star, response, views}) => {
  return (
        <div className="problem-card rounded-lg p-5 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2 hover:text-indigo-400 cursor-pointer">{problem}</h3>
            <p className="text-gray-400 text-sm mb-4 flex-grow">{description}</p>
            <div className="flex justify-between items-end">
                <div className="flex flex-wrap gap-2">
                    <span className="bg-sky-500/20 text-sky-300 text-xs font-semibold px-2 py-1 rounded-full">Python</span>
                    <span className="bg-green-500/20 text-green-300 text-xs font-semibold px-2 py-1 rounded-full">Asyncio</span>
                </div>
                <div className="flex items-center space-x-4 text-gray-400">
                    <span><i className="fas fa-eye mr-1"></i> {views ? views: 0}</span>
                    <span><i className="fas fa-comment-alt mr-1"></i> {response}</span>
                    <span><i className="fas fa-arrow-up mr-1"></i> {star ? star: 0}</span>
                </div>
            </div>
        </div>
  )
}

export default PopularProbelmCard