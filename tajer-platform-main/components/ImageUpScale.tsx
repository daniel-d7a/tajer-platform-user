import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface ImageUpScaleProps {
    src: string;
    alt: string;
    onClose: () => void;
}

export default function ImageUpScale({ src, alt, onClose }: ImageUpScaleProps) {
    const t = useTranslations('common');
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const imageContainerRef = useRef<HTMLDivElement>(null);

    // Reset when new image opens
    useEffect(() => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
        setLastPosition({ x: 0, y: 0 });
    }, [src]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'r') {
                e.preventDefault();
                handleReset();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleZoomIn = () => {
        setScale(prev => {
            const newScale = Math.min(prev + 0.25, 5);
            centerImage();
            return newScale;
        });
    };

    const handleZoomOut = () => {
        setScale(prev => {
            const newScale = Math.max(prev - 0.25, 0.5);
            if (newScale <= 1) {
                setPosition({ x: 0, y: 0 });
                setLastPosition({ x: 0, y: 0 });
            }
            return newScale;
        });
    };

    const handleReset = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
        setLastPosition({ x: 0, y: 0 });
    };

    const centerImage = () => {
        if (imageContainerRef.current) {
            
            setPosition({ x: 0, y: 0 });
            setLastPosition({ x: 0, y: 0 });
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (scale <= 1) return;
        
        setIsDragging(true);
        setLastPosition({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
        
        // Add grabbing cursor to body to prevent flickering
        document.body.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || scale <= 1) return;

        const newX = e.clientX - lastPosition.x;
        const newY = e.clientY - lastPosition.y;

        // Calculate bounds to prevent dragging beyond image edges
        if (imageContainerRef.current) {
            const container = imageContainerRef.current;
            const containerRect = container.getBoundingClientRect();
            
            // Calculate maximum drag distance based on scale
            const maxX = (containerRect.width * (scale - 1)) / 2;
            const maxY = (containerRect.height * (scale - 1)) / 2;
            
            // Constrain position within bounds
            const constrainedX = Math.max(-maxX, Math.min(maxX, newX));
            const constrainedY = Math.max(-maxY, Math.min(maxY, newY));
            
            setPosition({
                x: constrainedX,
                y: constrainedY
            });
        } else {
            setPosition({
                x: newX,
                y: newY
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        document.body.style.cursor = '';
    };

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        
        const delta = -e.deltaY * 0.01;
        const zoomIntensity = 0.1;
        const newScale = Math.max(0.5, Math.min(scale + delta * zoomIntensity, 5));
        
        if (imageContainerRef.current) {
            const container = imageContainerRef.current;
            const containerRect = container.getBoundingClientRect();
            
            // Mouse position relative to container
            const mouseX = e.clientX - containerRect.left;
            const mouseY = e.clientY - containerRect.top;
            
            // Container center
            const containerCenterX = containerRect.width / 2;
            const containerCenterY = containerRect.height / 2;
            
            // Current mouse position in image coordinates
            const imageX = (mouseX - containerCenterX - position.x) / scale;
            const imageY = (mouseY - containerCenterY - position.y) / scale;
            
            // Calculate new position to keep mouse point fixed
            const newPosition = {
                x: mouseX - containerCenterX - imageX * newScale,
                y: mouseY - containerCenterY - imageY * newScale
            };
            
            // Apply bounds constraints for new scale
            const maxX = (containerRect.width * (newScale - 1)) / 2;
            const maxY = (containerRect.height * (newScale - 1)) / 2;
            
            const constrainedPosition = {
                x: Math.max(-maxX, Math.min(maxX, newPosition.x)),
                y: Math.max(-maxY, Math.min(maxY, newPosition.y))
            };
            
            setPosition(constrainedPosition);
            setLastPosition({
                x: e.clientX - constrainedPosition.x,
                y: e.clientY - constrainedPosition.y
            });
        }
        
        setScale(newScale);
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        
        if (scale > 1) {
            handleReset();
        } else {
            // Zoom to 2x at click position
            if (imageContainerRef.current) {
                const container = imageContainerRef.current;
                const containerRect = container.getBoundingClientRect();
                
                const mouseX = e.clientX - containerRect.left;
                const mouseY = e.clientY - containerRect.top;
                
                const containerCenterX = containerRect.width / 2;
                const containerCenterY = containerRect.height / 2;
                
                const imageX = (mouseX - containerCenterX) / scale;
                const imageY = (mouseY - containerCenterY) / scale;
                
                const newScale = 2;
                const newPosition = {
                    x: mouseX - containerCenterX - imageX * newScale,
                    y: mouseY - containerCenterY - imageY * newScale
                };
                
                // Apply bounds
                const maxX = (containerRect.width * (newScale - 1)) / 2;
                const maxY = (containerRect.height * (newScale - 1)) / 2;
                
                const constrainedPosition = {
                    x: Math.max(-maxX, Math.min(maxX, newPosition.x)),
                    y: Math.max(-maxY, Math.min(maxY, newPosition.y))
                };
                
                setPosition(constrainedPosition);
                setLastPosition({
                    x: e.clientX - constrainedPosition.x,
                    y: e.clientY - constrainedPosition.y
                });
                setScale(newScale);
            }
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 p-4"
            onClick={onClose}
            ref={containerRef}
        >
            <div 
                className="relative w-[80vw] h-[80vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with close button only */}
                <div className="flex items-center justify-end p-4">
                    <button 
                        onClick={onClose}
                        className="bg-transparent hover:bg-red-600 text-white rounded-full p-2 transition-all duration-200 hover:scale-110"
                        title="Close (ESC)"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Image container - takes remaining space */}
                <div 
                    ref={imageContainerRef}
                    className="flex-1 relative overflow-hidden bg-transparent select-none"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={handleWheel}
                    onDoubleClick={handleDoubleClick}
                    style={{
                        cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
                    }}
                >
                    <div 
                        className="absolute inset-0 transition-transform duration-150 ease-out"
                        style={{
                            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                            transformOrigin: 'center center'
                        }}
                    >
                        <Image 
                            src={src} 
                            alt={alt} 
                            fill
                            quality={100}
                            className="object-contain"
                            draggable={false}
                            priority
                        />
                    </div>

                    {/* Simple zoom indicator */}
                    {scale !== 1 && (
                        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm backdrop-blur-sm">
                            {Math.round(scale * 100)}%
                        </div>
                    )}

                    {/* Floating controls on the image */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-xl p-1 border border-white/20">
                        <button 
                            onClick={handleZoomOut}
                            className="p-2 text-white hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110"
                            title="Zoom Out"
                        >
                            <ZoomOut size={15} />
                        </button>
                        
                        <button 
                            onClick={handleReset}
                            className="p-2 text-white hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110"
                            title="Reset"
                        >
                            <RotateCcw size={15} />
                        </button>
                        
                        <button 
                            onClick={handleZoomIn}
                            className="p-2 text-white hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110"
                            title="Zoom In"
                        >
                            <ZoomIn size={15} />
                        </button>
                    </div>
                </div>

                {/* Minimal footer with only instructions */}
                  <div className="p-3 ">
          <div className="text-xs text-muted-foreground text-center">
            {t('Scroll')} {scale > 1 ? t('drag') : ''} {t('doubleClick')}
          </div>
        </div>
            </div>
        </div>
    );
}