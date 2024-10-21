import React, { useEffect, useState } from 'react';
import { Carousel,Spinner } from "@material-tailwind/react";
import AxiosRequest from '../../Components/AxiosRequest'
import { ReactComponent as LoadingSpinner } from '../../../src/assets/LoadingSpinner.svg'; // Adjust path as needed

const Carousels = () => {
  const [sliderImages, setSliderImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isOwner = localStorage.getItem('isOwner');

  console.log('IsOwner',isOwner);

  useEffect(() => {
    const fetchSliderImages = async () => {
      try {
        const response = await AxiosRequest.get('/allImages');
        setSliderImages(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching slider images', error);
        setIsLoading(false);
      }
    };

    fetchSliderImages();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center bg-white justify-center min-h-screen font-poppins">
        <LoadingSpinner width="200" height="200" />
      </div>
    );
  }

  return (
    <div className="w-full h-[36vh] md:h-[56vh] mx-auto">
      <Carousel
        autoplay
        loop
        navigation={({ setActiveIndex, activeIndex, length }) => (
          <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
            {new Array(length).fill("").map((_, i) => (
              <span
                key={i}
                className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                  activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
                }`}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
        )}
      >
        {sliderImages.map((image, index) => (
          // <a href={image.url} target="_blank" rel="noopener noreferrer">
          // <img
          //   key={index}
          //   loading='lazy'
          //   src={image.imageUrl}
          //   alt={`image ${index + 1}`}
          //   className="h-full w-full"
          // />
          // </a>
          isOwner ? (
            <img
              key={index}
              // loading='lazy'
              src={image.imageUrl}
              alt={`image ${index + 1}`}
              className="h-full w-full"
            />
          ) : (
            <a href={image.url} target="_blank" rel="noopener noreferrer" key={index}>
              <img
                // loading='lazy'
                src={image.imageUrl}
                alt={`image ${index + 1}`}
                className="h-full w-full"
              />
            </a>
          )
        ))}
      </Carousel>
    </div>
  );
};

export default Carousels;


