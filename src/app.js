import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Draggable from 'gsap/Draggable';
gsap.registerPlugin(ScrollTrigger, Draggable);

const sections = gsap.utils.toArray('section');
const track = document.querySelector('[data-draggable]');
const navLinks = gsap.utils.toArray('[data-link]');
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
);

const lastItemWidth = () => navLinks[navLinks.length - 1].offsetWidth;

const getUseableHeight = () =>
  document.documentElement.offsetHeight - window.innerHeight;

const getDraggableWidth = () => {
  return track.offsetWidth * 0.5 - lastItemWidth();
};

const updatePosition = () => {
  const left = track.getBoundingClientRect().left * -1;
  const width = getDraggableWidth();
  const useableHeight = getUseableHeight();
  const y = gsap.utils.mapRange(0, width, 0, useableHeight, left);

  st.scroll(y);
};

/* Create the timeline to move the track */
const tl = gsap.timeline().to(track, {
  x: () => getDraggableWidth() * -1,
  ease: 'none' // remove easing - very important!
});

/* Create the ScrollTrigger instance */
const st = ScrollTrigger.create({
  animation: tl,
  scrub: 0 // sync timeline to scroll position
});

/* Create the Draggable instance */
const draggableInstance = Draggable.create(track, {
  type: 'x',
  inertia: true,
  bounds: {
    minX: 0,
    maxX: getDraggableWidth() * -1
  },
  edgeResistance: 1,
  onDragStart: () => st.disable(),
  onDragEnd: () => st.enable(),
  onDrag: updatePosition,
  onThrowUpdate: updatePosition
});

/* Allow navigation via keyboard */
track.addEventListener('keyup', (e) => {
  const id = e.target.getAttribute('href');
  if (!id || e.key !== 'Tab') return;

  const section = document.querySelector(id);
  const y = section.getBoundingClientRect().top + window.scrollY;

  st.scroll(y);
});
