import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const CurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Kolkata'
    });
  };

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-center gap-3">
      <Clock className="h-5 w-5 text-primary animate-pulse" />
      <div>
        <p className="text-sm font-semibold text-primary">Current Time</p>
        <p className="text-xs text-muted-foreground">{formatTime(currentTime)}</p>
      </div>
    </div>
  );
};

export default CurrentTime;