/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

import Football1 from '../public/images/Banner1.png';
import Football2 from '../public/images/Banner2.png';
const sportsData = [
  { name: 'Football1', image: Football1 },
  { name: 'Football2', image: Football2 },
];

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sportsData.length);
    }, 1200); // Change image every second

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="relative w-full h-[320px] rounded-xl overflow-hidden">
      {sportsData.map((item, index) => (
        <div
          key={item.name}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={item.image}
            alt={item.name}
            layout="fill"
            objectFit="cover"
            className="rounded"
          />
        </div>
      ))}
    </div>
  );
};

export default Slider;