import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  delay?: number;
};

export default function ScrollAnimation({ children, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }} // 👈 re-animates on scroll
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}
