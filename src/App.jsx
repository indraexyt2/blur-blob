import React, { useState, useEffect } from "react";
import LightIcon from '@mui/icons-material/LightModeRounded';
import DarkIcon from '@mui/icons-material/Brightness4Rounded';

const App = () => {
  // Initial position of the blob (center of the screen)
  const initialX = window.innerWidth / 2;
  const initialY = window.innerHeight / 2;

  // Function to dynamically generate softer and more harmonious colors using HSL
  const generateSofterColors = (x, y) => {
    const hue = (x / window.innerWidth) * 360; // Calculate hue based on x position
    const saturation = 60 + (y / window.innerHeight) * 20; // Moderate saturation (60-80%)
    const lightness = 60 + (y / window.innerHeight) * 10; // Lightness (60-70%) to avoid dark colors

    // Generate three harmonious colors with slightly different hues
    const color1 = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    const color2 = `hsl(${(hue + 60) % 360}, ${saturation}%, ${lightness}%)`;
    const color3 = `hsl(${(hue + 120) % 360}, ${saturation}%, ${lightness}%)`;

    // Return a radial gradient with softer colors
    return `radial-gradient(circle at ${x}px ${y}px, ${color1}, ${color2}, ${color3})`;
  };

  // State to store blob styles with initial softer dynamic color
  const [blobStyle, setBlobStyle] = useState({
    display: "block", // Blob always visible
    width: "550px", // Increased blob size
    height: "550px", // Increased blob size
    background: generateSofterColors(initialX, initialY), // Use softer dynamic colors
    borderRadius: "80%",
    pointerEvents: "none",
  });

  const [blobPosition, setBlobPosition] = useState({
    x: initialX, // Start in the middle of the screen
    y: initialY,
  });

  const [targetPosition, setTargetPosition] = useState({
    x: initialX,
    y: initialY,
  });

  // Function to handle mouse movement
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    // Update target position only without directly moving blob
    setTargetPosition({ x: clientX, y: clientY });

    // Update blob style with new softer colors
    setBlobStyle((prevStyle) => ({
      ...prevStyle,
      background: generateSofterColors(clientX, clientY), // Dynamic color change with softer transitions
    }));
  };

  // Function to linearly interpolate between current and target position
  const lerp = (start, end, t) => {
    return start + (end - start) * t; // t is a factor between 0 and 1
  };

  // Use requestAnimationFrame to smoothly move the blob
  useEffect(() => {
    let animationFrameId;

    const moveBlobSmoothly = () => {
      setBlobPosition((prevPosition) => {
        // Calculate the new positions using linear interpolation with a slower rate
        const newX = lerp(prevPosition.x, targetPosition.x, 0.01); // Slower with 0.01
        const newY = lerp(prevPosition.y, targetPosition.y, 0.01); // Slower with 0.01

        return {
          x: newX,
          y: newY,
        };
      });

      animationFrameId = requestAnimationFrame(moveBlobSmoothly); // Continue animation
    };

    moveBlobSmoothly(); // Start animation

    return () => cancelAnimationFrame(animationFrameId); // Cleanup on unmount
  }, [targetPosition]);

  // Add the keyframes for rotation animation
  useEffect(() => {
    const styleSheet = document.styleSheets[0];
    const keyframes = `
      @keyframes rotateBlob {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `;
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
  }, []);

  const [isDarkMode, setDarkMode ] = useState(false);
  const handleDarkMode = () => {
    setDarkMode(!isDarkMode)
    if (!isDarkMode) {
      document.documentElement.classList.add('dark'); // Aktifkan dark mode
    } else {
      document.documentElement.classList.remove('dark'); // Nonaktifkan dark mode
    }
  }

  useEffect(() => {
    console.log(isDarkMode);
  }, [isDarkMode])
  
  return (
    <div
      className="relative bg-citrine dark:bg-biru w-full h-screen overflow-hidden"
      onMouseMove={handleMouseMove} // Blob still follows the mouse
    >
      <div 
        className={`relative cursor-pointer z-10 flex justify-end pe-5 md:pe-16 py-5 ${isDarkMode ? 'text-citrine' : 'text-biru'}`}
        onClick={handleDarkMode}>
        { isDarkMode ? <LightIcon /> : <DarkIcon /> }
      </div>
      
      {/* The Blob Container with Rotation */}
      <div
        id="blob-wrapper"
        style={{
          position: "absolute",
          top: `${blobPosition.y - 300}px`, // Adjusting for larger blob
          left: `${blobPosition.x - 300}px`, // Adjusting for larger blob
          pointerEvents: "none", // Prevent interaction
        }}
      >
        {/* The Blob */}
        <div
          id="color-blob"
          style={{
            ...blobStyle,
            animation: "rotateBlob 5s linear infinite", // Rotation animation
          }}
          className="absolute blur-[150px] opacity-75 z-0"
        ></div>
      </div>
      <div className="absolute w-max text-biru dark:text-citrine top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <h2 className="text-5xl font-bold ">Blur Blob</h2>
        <span className="font-thin flex justify-center">- by Indrawansyah</span>
      </div>
    </div>
  );
};

export default App;
