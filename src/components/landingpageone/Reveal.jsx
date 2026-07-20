'use client';

import React from 'react';
import { useInView } from 'react-intersection-observer';

export default function Reveal({ 
    children, 
    animation = "up", // 'up', 'down', 'left', 'right', or 'scale'
    delay = "delay-0", // Tailwind delay classes like 'delay-100', 'delay-200'
    className = "" 
}) {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.2, // Triggers when 20% visible
    });

    // Define starting states based on the animation prop
    const startStates = {
        up: "opacity-0 translate-y-10",
        down: "opacity-0 -translate-y-10",
        left: "opacity-0 -translate-x-10",
        right: "opacity-0 translate-x-10",
        scale: "opacity-0 scale-95"
    };

    return (
        <div 
            ref={ref} 
            className={`transition-all duration-700 ease-out ${delay} ${className} ${
                inView ? "opacity-100 translate-y-0 translate-x-0 scale-100" : startStates[animation]
            }`}
        >
            {children}
        </div>
    );
}