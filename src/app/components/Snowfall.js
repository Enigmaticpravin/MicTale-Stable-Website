import React, { useEffect, useRef } from 'react';

const Snowfall = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let snowflakes = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Snowflake class
    class Snowflake {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
        this.opacity = Math.random() * 0.6 + 0.4;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.radius = Math.random() * 3 + 1;
        this.speed = Math.random() * 1 + 0.5;
        this.wind = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.6 + 0.4;
        this.swing = Math.random() * 0.5;
        this.swingSpeed = Math.random() * 0.01 + 0.005;
        this.angle = 0;
      }

      update() {
        this.angle += this.swingSpeed;
        this.x += Math.sin(this.angle) * this.swing + this.wind;
        this.y += this.speed;

        // Reset if snowflake goes off screen
        if (this.y > canvas.height) {
          this.reset();
        }
        if (this.x > canvas.width + 10) {
          this.x = -10;
        } else if (this.x < -10) {
          this.x = canvas.width + 10;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
        
        ctx.shadowBlur = 5;
        ctx.shadowColor = `rgba(255, 255, 255, ${this.opacity * 0.5})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const createSnowflakes = () => {
     const numberOfSnowflakes = Math.floor((canvas.width * canvas.height) / 15000);

      snowflakes = [];
      for (let i = 0; i < numberOfSnowflakes; i++) {
        snowflakes.push(new Snowflake());
      }
    };
    createSnowflakes();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      snowflakes.forEach(snowflake => {
        snowflake.update();
        snowflake.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default Snowfall;