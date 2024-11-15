import { useState, useEffect, useRef } from 'react';

const Game = () => {
  const [gameState, setGameState] = useState({
    points: 0,
    pipes: [],
    gameOver: false,
    handPosition: null
  });
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLImageElement>(null);
  const animationFrameId = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(true);

  const CANVAS_WIDTH = 640;
  const CANVAS_HEIGHT = 480;
  const PIPE_WIDTH = 60;
  const BIRD_SIZE = 20;

  // Utility function for CORS requests
  const fetchWithCORS = async (url: string) => {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  };

  const drawGame = (ctx: CanvasRenderingContext2D) => {
    if (!videoRef.current) return;

    // Draw video frame
    ctx.drawImage(videoRef.current, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw pipes
    ctx.fillStyle = 'rgba(46, 204, 113, 0.8)';
    gameState.pipes.forEach((pipe: any) => {
      // Top pipe
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.y_top);
      // Bottom pipe
      ctx.fillRect(pipe.x, pipe.y_bottom, PIPE_WIDTH, CANVAS_HEIGHT - pipe.y_bottom);
    });
    
    // Draw hand position (bird)
    if (gameState.handPosition) {
      ctx.fillStyle = '#e74c3c';
      ctx.beginPath();
      ctx.arc(
        gameState.handPosition.x,
        gameState.handPosition.y,
        BIRD_SIZE,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
    
    // Draw score
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.font = 'bold 24px Arial';
    const scoreText = `Score: ${gameState.points}`;
    ctx.strokeText(scoreText, CANVAS_WIDTH - 150, 40);
    ctx.fillText(scoreText, CANVAS_WIDTH - 150, 40);
  };

  const updateGameState = async () => {
    try {
      setError(null);
      const data = await fetchWithCORS('http://localhost:5000/game-state');
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Update video frame
      if (videoRef.current && data.frame) {
        videoRef.current.src = `data:image/jpeg;base64,${data.frame}`;
      }

      setGameState(prevState => ({
        ...prevState,
        points: data.game_state.points,
        pipes: data.game_state.pipes,
        gameOver: data.game_state.game_over,
        handPosition: data.hand_position
      }));
    } catch (err) {
      console.error('Error fetching game state:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsPlaying(false);
    }
  };

  const resetGame = async () => {
    try {
      await fetchWithCORS('http://localhost:5000/reset-game');
      setIsPlaying(true);
      setError(null);
      setGameState(prevState => ({
        ...prevState,
        points: 0,
        pipes: [],
        gameOver: false
      }));
    } catch (err) {
      console.error('Error resetting game:', err);
      setError(err instanceof Error ? err.message : 'Failed to reset game');
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      if (isPlaying && !gameState.gameOver) {
        updateGameState();
        drawGame(ctx);
        animationFrameId.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isPlaying, gameState.gameOver]);

  return (
    <div className="flex flex-col items-center gap-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {error}
          <button 
            onClick={() => { setError(null); setIsPlaying(true); }}
            className="ml-4 underline"
          >
            Try Again
          </button>
        </div>
      )}
      
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-4 border-violet-500 rounded-lg"
      />
      
      {/* Hidden video element to handle frames */}
      <img
        ref={videoRef}
        className="hidden"
        alt="video-frame"
      />
      
      {gameState.gameOver && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Game Over!</h2>
          <p className="text-xl mb-4">Final Score: {gameState.points}</p>
          <button
            onClick={resetGame}
            className="bg-violet-500 text-white px-6 py-2 rounded-lg hover:bg-violet-600 transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;
