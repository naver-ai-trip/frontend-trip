"use client";
import TypeAnimation from "@/components/ui/typeanimation";
import { motion } from "framer-motion";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface ModernLoaderProps {
  words?: string[];
  currentProgressNode?: string | null;
}

const stateLabels: Record<string, string> = {
  initialize: "Initializing...",
  route: "Routing...",
  search_plan: "Searching plans...",
  generate: "Generating response...",
  save: "Saving...",
};

const ModernLoader: React.FC<ModernLoaderProps> = ({
  words = ["Setting things up...", "Initializing modules...", "Almost ready..."],
  currentProgressNode = null,
}) => {
  const [currentLine, setCurrentLine] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const colors = useMemo(
    () => ["bg-gray-500", "bg-teal-500", "bg-blue-500", "bg-gray-600", "bg-pink-500"],
    [],
  );
  const BUFFER = 20;
  const MAX_LINES = 10;

  const generateLines = useCallback(
    (count = 20) =>
      Array.from({ length: count }, (_, idx) => ({
        id: Date.now() + idx,
        segments: Array.from({ length: Math.floor(Math.random() * 4) + 1 }, () => ({
          width: `${Math.floor(Math.random() * 80) + 50}px`,
          color: colors[Math.floor(Math.random() * colors.length)],
          isCircle: Math.random() > 0.93,
          indent: Math.random() > 0.7 ? 1 : 0,
        })),
      })),
    [colors],
  );

  const [lines, setLines] = useState(() => generateLines());

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [currentLine]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentLine((prev) => {
        const nextLine = prev + 1;
        if (nextLine >= lines.length - 10) setLines((old) => [...old, ...generateLines(50)]);
        return nextLine;
      });
    }, 200);
    return () => clearTimeout(timer);
  }, [currentLine, lines.length, generateLines]);

  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((prev) => !prev), 530);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const cleanup = () => {
      if (lines.length > MAX_LINES && currentLine > BUFFER * 2) {
        setLines((oldLines) => {
          const safeIndex = currentLine - BUFFER * 2;
          if (safeIndex > 0) {
            setCurrentLine((prev) => prev - safeIndex);
            return oldLines.slice(safeIndex);
          }
          return oldLines;
        });
      }
    };
    const interval = setInterval(cleanup, 5000);
    return () => clearInterval(interval);
  }, [currentLine, lines.length]);

  return (
    <div className="max-w-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-background relative rounded-2xl"
      >
        <div className="relative z-10 flex flex-col items-center gap-2 px-2 py-1">
          {/* <div className="flex items-center gap-1.5">
            <motion.div className="w-2 xs:w-2.5 sm:w-3 h-2 xs:h-2.5 sm:h-3 rounded-full bg-red-500" />
            <motion.div className="w-2 xs:w-2.5 sm:w-3 h-2 xs:h-2.5 sm:h-3 rounded-full bg-yellow-500" />
            <motion.div className="w-2 xs:w-2.5 sm:w-3 h-2 xs:h-2.5 sm:h-3 rounded-full bg-green-500" />
          </div> */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full flex-1 text-center"
          >
            <TypeAnimation
              words={words}
              typingSpeed="slow"
              deletingSpeed="slow"
              pauseDuration={2000}
              className="text-muted-foreground font-mono text-sm"
            />
          </motion.div>

          {currentProgressNode && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="rounded bg-purple-100 px-2 py-1 text-xs font-semibold whitespace-nowrap text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
            >
              {stateLabels[currentProgressNode] || currentProgressNode}
            </motion.div>
          )}
        </div>

        {/* <div ref={containerRef} className="relative px-5 py-4 font-mono text-sm overflow-y-hidden h-[calc(100%-48px)]">
          <div className="space-y-2 relative z-10">
            <AnimatePresence mode="sync">
              {visibleLines.map((line, idx) => {
                const actualIndex = visibleStart + idx;
                if (actualIndex >= currentLine) return null;
                const extraMargin = (idx + 1) % 4 === 0 ? "mt-2" : "";
                const paddingClass = line.segments[0]?.indent ? "pl-4" : "";
                return (
                  <React.Fragment key={line.id}>
                    <motion.div
                      className={cn("flex items-center gap-2 h-5", extraMargin, paddingClass)}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      {line.segments.map((seg, i) =>
                        seg.isCircle ? (
                          <motion.div
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2, delay: 0.05 }}
                            className={cn("w-4 h-4 rounded-full opacity-50", seg.color)}
                          />
                        ) : (
                          <motion.div
                            key={i}
                            initial={{ width: 0 }}
                            animate={{ width: seg.width }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className={cn("h-3 rounded-sm opacity-50", seg.color)}
                            style={{ width: seg.width }}
                          />
                        )
                      )}
                    </motion.div>

                    {(actualIndex + 1) % 6 === 0 && (
                      <motion.div
                        className="w-full h-1 bg-background rounded-sm opacity-30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </AnimatePresence>

            {currentLine < lines.length && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center h-5"
                style={{ paddingLeft: `${lines[currentLine]?.segments[0]?.indent ? 16 : 0}px` }}
              >
                <motion.div
                  animate={{ opacity: cursorVisible ? 1 : 0 }}
                  transition={{ duration: 0.1 }}
                  className="w-0.5 h-3.5 bg-blue-500"
                />
              </motion.div>
            )}
          </div>
        </div> */}
      </motion.div>
    </div>
  );
};

export default ModernLoader;
