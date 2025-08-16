import React, { useEffect, useRef, useState } from 'react';

interface BlogSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  stickyHeader?: boolean;
  backgroundColor?: string;
}

const BlogSection: React.FC<BlogSectionProps> = ({ 
  title, 
  subtitle, 
  children, 
  stickyHeader = true,
  backgroundColor = 'bg-white'
}) => {
  const [isStuck, setIsStuck] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!stickyHeader) return;

    const observer = new IntersectionObserver(
      ([e]) => setIsStuck(e.intersectionRatio < 1),
      { threshold: [1], rootMargin: '-1px 0px 0px 0px' }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => observer.disconnect();
  }, [stickyHeader]);

  return (
    <section className={`min-h-screen ${backgroundColor}`}>
      <div 
        ref={headerRef}
        className={`${stickyHeader ? 'sticky top-0 z-20' : ''} transition-all duration-200 ${
          isStuck ? 'bg-white/95 backdrop-blur-md shadow-sm' : ''
        }`}
      >
        <div className="max-w-4xl mx-auto px-6 py-4 md:py-6">
          <h2 className="text-2xl md:text-3xl font-light text-gray-900">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm md:text-base text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-6 pb-12">
        {children}
      </div>
    </section>
  );
};

export default BlogSection;