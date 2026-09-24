import React, { useEffect, useRef } from 'react';

export const Hero3DCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight || 550);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // 3D Particles Matrix setup
    const particleCount = 220;
    const particles = [];
    const radius = Math.min(width, height) * 0.38;

    // Mouse tracking for 3D camera rotation
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - width / 2;
      const y = e.clientY - rect.top - height / 2;
      targetRotationY = (x / width) * Math.PI * 0.5;
      targetRotationX = (y / height) * Math.PI * 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Generate 3D sphere points using Fibonacci sphere algorithm
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
    for (let i = 0; i < particleCount; i++) {
      const y = 1 - (i / (particleCount - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      particles.push({
        x: x * radius,
        y: y * radius,
        z: z * radius,
        baseX: x * radius,
        baseY: y * radius,
        baseZ: z * radius,
        size: Math.random() * 2 + 1.2,
        color: i % 3 === 0 ? '#818cf8' : i % 3 === 1 ? '#f472b6' : '#38bdf8',
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    let angleY = 0;

    // 3D projection rendering loop
    const render = (time) => {
      ctx.clearRect(0, 0, width, height);

      // Smooth camera interpolation
      currentRotationX += (targetRotationX - currentRotationX) * 0.05;
      currentRotationY += (targetRotationY - currentRotationY) * 0.05;

      angleY += 0.005; // Auto rotate globe

      const cosY = Math.cos(angleY + currentRotationY);
      const sinY = Math.sin(angleY + currentRotationY);
      const cosX = Math.cos(currentRotationX);
      const sinX = Math.sin(currentRotationX);

      const fov = 400; // 3D Perspective Field of View
      const centerX = width / 2;
      const centerY = height / 2;

      // Sort particles by depth Z for proper 3D rendering order
      const projected = particles.map((p) => {
        // Rotate around Y axis
        let rx = p.baseX * cosY - p.baseZ * sinY;
        let rz = p.baseX * sinY + p.baseZ * cosY;
        let ry = p.baseY;

        // Rotate around X axis
        const ry2 = ry * cosX - rz * sinX;
        const rz2 = ry * sinX + rz * cosX;

        // 3D Perspective projection formula
        const scale = fov / (fov + rz2 + 300);
        const projX = rx * scale + centerX;
        const projY = ry2 * scale + centerY;

        return {
          projX,
          projY,
          projZ: rz2,
          scale,
          color: p.color,
          size: p.size,
          pulse: Math.sin(time * 0.002 * p.pulseSpeed + p.pulseOffset) * 0.5 + 0.5,
        };
      });

      // Sort array by Z depth (back to front)
      projected.sort((a, b) => b.projZ - a.projZ);

      // Draw 3D connecting lines between close points
      ctx.lineWidth = 0.6;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j += 8) {
          const p1 = projected[i];
          const p2 = projected[j];
          const dx = p1.projX - p2.projX;
          const dy = p1.projY - p2.projY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 85 && p1.projZ > -150 && p2.projZ > -150) {
            const alpha = (1 - dist / 85) * 0.25 * Math.min(p1.scale, p2.scale);
            ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.projX, p1.projY);
            ctx.lineTo(p2.projX, p2.projY);
            ctx.stroke();
          }
        }
      }

      // Draw 3D Particles
      projected.forEach((p) => {
        const opacity = Math.max(0.1, Math.min(1, (p.projZ + 250) / 400));
        const finalSize = p.size * p.scale * (1 + p.pulse * 0.4);

        ctx.fillStyle = p.color;
        ctx.globalAlpha = opacity;

        // Glow halo for close 3D nodes
        if (p.projZ > 50) {
          ctx.shadowBlur = 12 * p.scale;
          ctx.shadowColor = p.color;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.arc(p.projX, p.projY, Math.max(0.5, finalSize), 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      // Draw central 3D glowing core
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        10,
        centerX,
        centerY,
        radius * 0.85
      );
      gradient.addColorStop(0, 'rgba(99, 102, 241, 0.15)');
      gradient.addColorStop(0.5, 'rgba(236, 72, 153, 0.05)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.85, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render(0);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full opacity-70" />
    </div>
  );
};
