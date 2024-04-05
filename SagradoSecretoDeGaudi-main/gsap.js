 //Scroller
 const container = document.querySelector('.timeline_project');
 const selections = gsap.utils.toArray('.timeline_project section');
 const etxts = gsap.utils.toArray('.anim');
 const mask = document.querySelector('.mask');
 
 // Calculate the total width of all text sections
 let totalWidth = 0;
 selections.forEach(section => {
     totalWidth += section.offsetWidth;
 });
 
 //scroll trigger (scrolling = moving right on timeline)
 let scrollTween = gsap.to(selections, {
     xPercent: -100 * (selections.length - 1), // x-axis scroll
     ease: "none", // constant speed of animation
     scrollTrigger: {
         trigger: ".timeline_project",
         pin: true, // element will be pinned to the viewport (while scrolling trigger, no down scrolling)
         scrub: 1, // scroll and movement of text happens synchronized
         end: "+=1500" // End point when all text sections are fully shown
     }
 });
 
 //mask black filling gray SVG
 gsap.to(mask, {
     width: "100%",
     scrollTrigger: {
         trigger: ".timeline_project",
         start: "top top",
         scrub: 1, 
         end: "+=1800"
     }
 });