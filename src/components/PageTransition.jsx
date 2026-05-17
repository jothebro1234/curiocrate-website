import { motion } from 'framer-motion'

const variants = {
  initial: { opacity: 0, filter: 'blur(8px)', y: 16 },
  animate: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { duration: 0.7, ease: [0.4,0,0.2,1] } },
  exit:    { opacity: 0, filter: 'blur(8px)', y: -16, transition: { duration: 0.4, ease: [0.4,0,1,1] } },
}

export default function PageTransition({ children }) {
  return (
    <motion.div
      className="page"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}
