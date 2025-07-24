import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Announcement } from '@/types/supabase';
import { Megaphone, AlertCircle } from 'lucide-react';

const ScrollingAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  useEffect(() => {
    if (announcements.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000); // Change announcement every 4 seconds

    return () => clearInterval(interval);
  }, [announcements.length]);

  const loadAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading announcements:', error);
        return;
      }

      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error loading announcements:', error);
    }
  };

  if (announcements.length === 0) {
    return null;
  }

  const currentAnnouncement = announcements[currentIndex];

  return (
    <div className="bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 text-white py-2 px-4 relative overflow-hidden">
      <div className="flex items-center gap-3 animate-pulse">
        <div className="flex items-center gap-2">
          {currentAnnouncement.priority === 1 ? (
            <AlertCircle className="h-5 w-5 animate-bounce" />
          ) : (
            <Megaphone className="h-5 w-5" />
          )}
          <span className="font-semibold text-sm">
            {currentAnnouncement.title}
          </span>
        </div>
        <div className="flex-1">
          <p className="text-sm animate-scroll">
            {currentAnnouncement.content}
          </p>
        </div>
      </div>
      
      {/* Progress dots */}
      <div className="absolute bottom-0 right-4 flex gap-1">
        {announcements.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-1 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ScrollingAnnouncements;