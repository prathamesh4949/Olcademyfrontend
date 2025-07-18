
export const fadeIn = (direction = "up", delay = 0) => {
  let x = 0;
  let y = 0;

  if (direction === "up") y = 60;
  if (direction === "down") y = -60;
  if (direction === "left") x = 60;
  if (direction === "right") x = -60;

  return {
    hidden: {
      opacity: 0,
      x,
      y,
      scale: 0.95,
    },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 15,
        duration: 1.2,
        delay,
      },
    },
    hidden: { opacity: 0, y: direction === "up" ? 50 : -50 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", delay }
    }
  };
};

