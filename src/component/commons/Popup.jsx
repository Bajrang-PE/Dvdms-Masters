//eslint-disable-next-line
import { motion, AnimatePresence } from 'framer-motion';

export default function Popup({ isVisible, children, largeDataset = false }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            className="popup__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              height: '100vh',
              width: '100vw',
              backgroundColor: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(2px)',
              top: 0,
              left: 0,
              zIndex: 1000,
            }}
          />

          <motion.div
            className="popup__data-container"
            initial={{ scale: 0.8, opacity: 0, x: '-50%', y: '-50%' }}
            animate={{ scale: 1, opacity: 1, x: '-50%', y: '-50%' }}
            exit={{ scale: 0.8, opacity: 0, x: '-50%', y: '-50%' }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              zIndex: 1200,
              backgroundColor: 'white',
              borderRadius: '7px',
              boxShadow: '0 0 10px rgba(0,0,0,0.3)',
              ...(largeDataset
                ? { height: '70rem', overflowY: 'scroll' }
                : { height: 'auto' }),
            }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
