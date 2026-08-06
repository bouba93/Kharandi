import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ZoomIn, ZoomOut, Moon, Sun, ChevronLeft, ChevronRight, Maximize, Minimize, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { getReadingProgress, saveReadingProgress } from '../../services/content';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface SecurePDFViewerProps {
  url: string; documentId: string; username: string; title?: string;
}

export const SecurePDFViewer: React.FC<SecurePDFViewerProps> = ({
  url, documentId, username, title = "Document"
}) => {
  const [numPages,     setNumPages]     = useState<number | null>(null);
  const [pageNumber,   setPageNumber]   = useState(1);
  const [zoom,         setZoom]         = useState(1);
  const [isNightMode,  setIsNightMode]  = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRead,       setIsRead]       = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);

  // Charger progression via Django
  useEffect(() => {
    getReadingProgress(documentId).then(p => {
      if (p?.progress) setPageNumber(Math.round((p.progress / 100) * (numPages || 1)) || 1);
      if (p?.is_read)  setIsRead(true);
    }).catch(() => {});
  }, [documentId, numPages]);

  // Sauvegarder progression via Django
  const updateProgress = async (newPage: number) => {
    setPageNumber(newPage);
    if (numPages) {
      const progress = Math.round((newPage / numPages) * 100);
      await saveReadingProgress(documentId, progress, isRead).catch(() => {});
    }
  };

  const markAsRead = async () => {
    setIsRead(true);
    await saveReadingProgress(documentId, 100, true).catch(() => {});
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) { viewerRef.current?.requestFullscreen(); setIsFullscreen(true); }
    else { document.exitFullscreen(); setIsFullscreen(false); }
  };

  const progress = numPages ? Math.round((pageNumber / numPages) * 100) : 0;

  return (
    <div ref={viewerRef} className={`flex flex-col w-full h-full ${isNightMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className={`flex items-center justify-between px-6 py-3 border-b ${isNightMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h2 className="font-bold text-lg truncate max-w-xs">{title}</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-mono">Lu par: {username}</span>
          <button onClick={() => setIsNightMode(!isNightMode)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            {isNightMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={toggleFullscreen} className="p-2 rounded-lg hover:bg-gray-100">
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
      </div>

      <div className={`flex flex-wrap items-center justify-center gap-2 md:gap-4 py-2 px-2 md:px-6 border-b bg-white`}>
        <button onClick={() => updateProgress(Math.max(1, pageNumber - 1))} disabled={pageNumber <= 1}
          className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30"><ChevronLeft size={18} /></button>
        <span className="text-sm font-bold min-w-[3rem] text-center">{pageNumber} / {numPages || '?'}</span>
        <button onClick={() => updateProgress(Math.min(numPages || 1, pageNumber + 1))} disabled={pageNumber >= (numPages || 1)}
          className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30"><ChevronRight size={18} /></button>
        <div className="h-4 w-px bg-gray-200 hidden md:block mx-0 md:mx-2" />
        <button onClick={() => setZoom(z => Math.max(0.5, z - 0.2))} className="p-1.5 rounded-lg hover:bg-gray-100"><ZoomOut size={18} /></button>
        <span className="text-xs text-gray-500 w-8 md:w-10 text-center">{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(z => Math.min(2.5, z + 0.2))} className="p-1.5 rounded-lg hover:bg-gray-100"><ZoomIn size={18} /></button>
        <div className="h-4 w-px bg-gray-200 hidden sm:block mx-2" />
        <div className="hidden sm:flex flex-1 max-w-[100px] bg-gray-100 rounded-full h-1.5">
          <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <span className="hidden sm:inline text-xs text-gray-400">{progress}%</span>
        {!isRead && progress >= 80 && (
          <button onClick={markAsRead} className="hidden sm:flex items-center gap-1 text-xs font-bold text-green-600 hover:underline">
            <CheckCircle size={14} /> Marquer lu
          </button>
        )}
        {isRead && <span className="hidden sm:flex text-xs font-bold text-green-600 items-center gap-1"><CheckCircle size={14} /> Lu</span>}
      </div>

      <div className="flex-1 overflow-auto flex justify-center p-4">
        <Document file={url} onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={<div className="flex items-center justify-center h-64">Chargement du PDF...</div>}>
          <Page pageNumber={pageNumber} scale={zoom}
            renderTextLayer={false} renderAnnotationLayer={false}
            className={isNightMode ? 'invert brightness-90' : ''} />
        </Document>
      </div>
    </div>
  );
};
