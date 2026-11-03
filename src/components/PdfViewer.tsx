import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { Loader2 } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface PdfViewerProps {
  url: string;
}

interface PdfPageProps {
  pageNum: number;
  pdfDoc: pdfjsLib.PDFDocumentProxy;
  containerWidth: number;
}

const PdfPage: React.FC<PdfPageProps> = React.memo(({ pageNum, pdfDoc, containerWidth }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    pdfDoc.getPage(pageNum).then((page) => {
      if (isCancelled || !canvasRef.current) return;

      const unscaledViewport = page.getViewport({ scale: 1 });
      const targetWidth = Math.max(280, containerWidth - 16);
      const scale = targetWidth / unscaledViewport.width;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2.5);
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.width = Math.floor(viewport.width * pixelRatio);
      canvas.height = Math.floor(viewport.height * pixelRatio);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      page.render({
        canvasContext: context,
        canvas,
        viewport
      }).promise.then(() => {
        if (!isCancelled) {
          setRendered(true);
        }
      }).catch((err) => {
        if (err?.name !== 'RenderingCancelledException') {
          console.debug('Render error:', err);
        }
      });
    }).catch(() => {});

    return () => {
      isCancelled = true;
    };
  }, [pageNum, pdfDoc, containerWidth]);

  return (
    <div className="w-full flex flex-col items-center justify-center my-1.5 sm:my-2 select-none">
      <div className="bg-white shadow-xl rounded-sm overflow-hidden relative">
        {!rendered && (
          <div className="w-72 h-96 bg-gray-100 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        )}
        <canvas ref={canvasRef} className={`block max-w-full ${rendered ? '' : 'hidden'}`} />
      </div>
    </div>
  );
});

export const PdfViewer: React.FC<PdfViewerProps> = ({ url }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [containerWidth, setContainerWidth] = useState<number>(360);

  // Gesture Pinch-to-Zoom State
  const [zoomScale, setZoomScale] = useState<number>(1);
  const initialDistanceRef = useRef<number | null>(null);
  const baseScaleRef = useRef<number>(1);
  const lastTapRef = useRef<number>(0);

  // Measure container width
  useEffect(() => {
    const updateWidth = () => {
      if (scrollContainerRef.current) {
        setContainerWidth(scrollContainerRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Fetch and Load PDF Document
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    const load = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({
          url,
          cMapUrl: 'https://unpkg.com/pdfjs-dist@4.10.38/cmaps/',
          cMapPacked: true
        });
        const doc = await loadingTask.promise;
        if (!isCancelled) {
          setPdfDoc(doc);
          setNumPages(doc.numPages);
          setLoading(false);
        }
      } catch {
        try {
          const res = await fetch(url);
          const buffer = await res.arrayBuffer();
          const fallbackDoc = await pdfjsLib.getDocument({
            data: new Uint8Array(buffer),
            cMapUrl: 'https://unpkg.com/pdfjs-dist@4.10.38/cmaps/',
            cMapPacked: true
          }).promise;
          if (!isCancelled) {
            setPdfDoc(fallbackDoc);
            setNumPages(fallbackDoc.numPages);
            setLoading(false);
          }
        } catch {
          if (!isCancelled) {
            setLoading(false);
          }
        }
      }
    };

    load();

    return () => {
      isCancelled = true;
    };
  }, [url]);

  // Touch handlers for natural pinch-to-zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialDistanceRef.current = dist;
      baseScaleRef.current = zoomScale;
    } else if (e.touches.length === 1) {
      const now = Date.now();
      if (now - lastTapRef.current < 300) {
        // Double-tap toggles zoom
        setZoomScale((prev) => (prev > 1.2 ? 1 : 1.85));
      }
      lastTapRef.current = now;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialDistanceRef.current !== null) {
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = currentDist / initialDistanceRef.current;
      const newScale = Math.min(Math.max(baseScaleRef.current * factor, 1.0), 3.5);
      setZoomScale(newScale);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      initialDistanceRef.current = null;
      if (zoomScale < 1.08) {
        setZoomScale(1.0);
      }
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        touchAction: 'pan-x pan-y pinch-zoom',
        WebkitOverflowScrolling: 'touch'
      }}
      className="flex-1 w-full h-full min-h-0 bg-gray-950 overflow-y-auto overflow-x-auto p-2 sm:p-4 select-none scroll-smooth"
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin text-[#C9A227] mb-3" />
          <p className="text-xs font-serif">Loading lesson pages...</p>
        </div>
      ) : (
        <div
          style={{
            transform: zoomScale !== 1 ? `scale(${zoomScale})` : undefined,
            transformOrigin: 'top center',
            transition: initialDistanceRef.current ? 'none' : 'transform 0.15s ease-out'
          }}
          className="w-full flex flex-col items-center"
        >
          {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
            pdfDoc && (
              <PdfPage
                key={pageNum}
                pageNum={pageNum}
                pdfDoc={pdfDoc}
                containerWidth={containerWidth}
              />
            )
          ))}
        </div>
      )}
    </div>
  );
};
