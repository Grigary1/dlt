import { useRef, useEffect, useState } from "react";

const WIDTH = 400;
const HEIGHT = 600;

function FlappyBird() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [gameState, setGameState] = useState("start"); // start | playing | over
  const [score, setScore] = useState(0);

  // Game objects (refs → no re-render)
  const bird = useRef({ y: 250, velocity: 0 });
  const pipes = useRef([]);

  const GRAVITY = 0.3;
  const JUMP = -8;
  const PIPE_GAP = 300;
  const PIPE_WIDTH = 60;
  const PIPE_SPEED = 0.5;

  // Reset game
  const resetGame = () => {
    bird.current = { y: 250, velocity: 0 };
    pipes.current = [];
    setScore(0);
    setGameState("playing");
  };

  // Main game loop
  const gameLoop = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Background
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Bird physics
    bird.current.velocity += GRAVITY;
    bird.current.y += bird.current.velocity;

    // Draw bird
    ctx.fillStyle = "#FFD700";
    ctx.fillRect(80, bird.current.y, 30, 30);

    // Generate pipes
    if (
      pipes.current.length === 0 ||
      pipes.current[pipes.current.length - 1].x < WIDTH - 200
    ) {
      const topHeight = Math.random() * 200 + 50;
      pipes.current.push({
        x: WIDTH,
        top: topHeight,
        passed: false,
      });
    }

    // Pipes
    ctx.fillStyle = "#228B22";
    pipes.current.forEach((pipe) => {
      pipe.x -= PIPE_SPEED;

      // Top pipe
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.top);

      // Bottom pipe
      ctx.fillRect(
        pipe.x,
        pipe.top + PIPE_GAP,
        PIPE_WIDTH,
        HEIGHT
      );

      // Collision
      if (
        80 + 30 > pipe.x &&
        80 < pipe.x + PIPE_WIDTH &&
        (bird.current.y < pipe.top ||
          bird.current.y + 30 > pipe.top + PIPE_GAP)
      ) {
        setGameState("over");
        cancelAnimationFrame(animationRef.current);
      }

      // Score
      if (!pipe.passed && pipe.x + PIPE_WIDTH < 80) {
        pipe.passed = true;
        setScore((s) => s + 1);
      }
    });

    // Remove off-screen pipes
    pipes.current = pipes.current.filter((p) => p.x > -PIPE_WIDTH);

    // Ground collision
    if (bird.current.y > HEIGHT || bird.current.y < 0) {
      setGameState("over");
      cancelAnimationFrame(animationRef.current);
    }

    animationRef.current = requestAnimationFrame(gameLoop);
  };

  // Start loop when playing
  useEffect(() => {
    if (gameState === "playing") {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [gameState]);

  // Jump control
  const handleJump = () => {
    if (gameState === "start") {
      resetGame();
    } else if (gameState === "playing") {
      bird.current.velocity = JUMP;
    } else if (gameState === "over") {
      resetGame();
    }
  };

  return (
    <div style={styles.container} onClick={handleJump}>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />
      <div style={styles.overlay}>
        {gameState === "start" && <h2>Click to Start</h2>}
        {gameState === "over" && (
          <>
            <h2>Game Over</h2>
            <p>Click to Restart</p>
          </>
        )}
        <div style={styles.score}>Score: {score}</div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: "relative",
    width: 400,
    margin: "40px auto",
    cursor: "pointer",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
    fontFamily: "sans-serif",
    textShadow: "2px 2px 4px #000",
  },
  score: {
    position: "absolute",
    top: 20,
    fontSize: "20px",
  },
};

export default FlappyBird;
